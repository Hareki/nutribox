CREATE DATABASE nutribox;
GO
USE [nutribox]
GO

CREATE TABLE product_categories (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  name nvarchar(100) NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE()
);

INSERT INTO product_categories (id, name)
  VALUES
  ('F66CE541-7659-41D4-A617-FB2C46626C17', N'Rau củ'),
  ('387A9B33-9B3B-4C9F-A441-B6D86C1C5BEB', N'Thịt tươi sống'),
  ('4F817590-6AB9-45EC-ABEC-0186FD1DCB23', N'Nước giải khát'),
  ('8AD913F1-4792-45D4-BC22-EEA59E2AAA23', N'Mì, miến, cháo, phở'),
  ('086B4625-3E89-4CDB-862E-2A894DD943C1', N'Sữa các loại')

CREATE TABLE suppliers (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  name nvarchar(100) UNIQUE NOT NULL,
  phone nvarchar(50) UNIQUE NOT NULL,
  email nvarchar(100) UNIQUE NOT NULL,
  province_code int NOT NULL,
  district_code int NOT NULL,
  ward_code int NOT NULL,
  street_address nvarchar(500) NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE()
);

INSERT INTO suppliers (id, name, phone, email, province_code, district_code, ward_code, street_address)
  VALUES
  ('F11CBB01-5B4E-4AB6-9274-092A8557D664', N'Công ty TNHH MTV nông nghiệp Quốc Tế Việt Nam (Vinafood II)', '033-875-8008', 'supplier1@gmail.com', 79, 760, 26734, N'12/12 Đường 49'),
  ('28C9AFA0-63FB-48AB-8D16-1877726332EB', N'Công ty cổ phần Vissan', '033-831-1008', 'supplier2@gmail.com', 79, 760, 26737, N'360 Phạm Văn Đồng'),
  ('8E2F4A81-A14A-4FBD-9FE3-23B80B1D6A15', N'Công ty cổ phần Masan Consumer', '033-835-8123', 'supplier3@gmail.com', 79, 760, 26740, N'180/77 Nguyễn Hữu Cảnh'),
  ('D4DDF521-4ADB-4DAA-9A11-37D412518098', N'Công ty cổ phần C.P. Việt Nam', '033-865-8008', 'supplier4@gmail.com', 79, 760, 26743, N'12/3 Đường 48'),
  ('21421969-7AFB-47CF-A7CD-F20436DDCA83', N'Công ty TNHH Thực phẩm sạch VinaGarden', '033-875-1238', 'supplier5@gmail.com', 79, 760, 26746, N'12/12 Đường 49')


CREATE TABLE products (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  category_id uniqueidentifier NOT NULL,
  default_supplier_id uniqueidentifier NULL,
  name nvarchar(100) NOT NULL UNIQUE,
  available bit NOT NULL DEFAULT 1,
  import_price int NOT NULL,
  retail_price int NOT NULL,
  shelf_life int NOT NULL,
  description nvarchar(500) NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),

  -- Foreign key constraints
  FOREIGN KEY (category_id)
  REFERENCES product_categories (id),
  FOREIGN KEY (default_supplier_id)
  REFERENCES suppliers (id),

  -- Check constraints
  CONSTRAINT chk_import_price CHECK (import_price > 0 AND import_price < retail_price),
  CONSTRAINT chk_retail_price CHECK (retail_price > import_price AND retail_price > 0),
  CONSTRAINT chk_shelf_life CHECK (shelf_life > 0)
);



INSERT INTO products (id, category_id, default_supplier_id, name, import_price, retail_price, shelf_life, description)
  VALUES
  ('5C600D3B-5742-4CFF-8E71-000621D73C8E', 'F66CE541-7659-41D4-A617-FB2C46626C17', 'F11CBB01-5B4E-4AB6-9274-092A8557D664', N'Cà chua bi hộp 250g', 12000, 30000, 15, N'Cà chua bi được trồng ở Lâm Đồng là loại thực phẩm dinh dưỡng, tốt cho sức khỏe được nhiều người chọn lựa. Cà chua bi to trái, căng mọng có thể dùng ăn chơi hoặc là nguyên liệu cho những món ăn ngon khác. Cà chua bi giúp đẹp da, sáng mắt là thực phẩm nên sử dụng thường xuyên!'),
  ('C2DF87FB-D09D-4FD0-B015-0468283BB217', 'F66CE541-7659-41D4-A617-FB2C46626C17', 'F11CBB01-5B4E-4AB6-9274-092A8557D664', N'Cà pháo khay 200g', 4000, 8000, 60, N'Cà pháo là món ăn truyền thống trong mỗi mâm cơm gia đình Việt Nam từ thời xa xư. Loại quả này không những ngon, mà còn có thể làm thành thuốc giúp nhuận tràng, lợi tiểu, trị thũng thấp độc, trừ hòn cục trong bụng, ho lao... Cà pháo được chế biến nhiều nhất là món cà pháo muối, chấm mắm tôm.'),
  ('8C75CAA5-7194-4FDE-8B7A-141083A45239', 'F66CE541-7659-41D4-A617-FB2C46626C17', 'F11CBB01-5B4E-4AB6-9274-092A8557D664', N'Rau mồng tơi 4KFarm gói 500g', 10000, 14000, 10, N'Rau an toàn 4KFarm với tiêu chí 4 KHÔNG, luôn ưu tiên bảo vệ sức khoẻ người tiêu dùng. Tính hàn đặc trưng của Rau Mùng Tơi 4KFarm khiến nhiều gia đình ưa chuộng để chế biến các món ăn thanh mát, phù hợp với những ngày hè nóng bức. Hàm lượng dinh dưỡng cao cũng là một trong các đặc điểm nổi bật.'),
  ('9F9CBA91-23B4-450B-A741-2EC6406BE86F', 'F66CE541-7659-41D4-A617-FB2C46626C17', 'F11CBB01-5B4E-4AB6-9274-092A8557D664', N'Khổ qua khay 500g', 6000, 10000, 12, N'Khổ qua hay mướp đắng là thực phẩm quen thuộc trong thực đơn hàng tuần của các bà nội trợ. Trong khổ qua chứa rất nhiều vitamin và khoáng chất tốt cho cơ thể, giúp nâng cao chức năng miễn dịch, thanh nhiệt giải độc. Khổ qua có thể chế biến thành canh hoặc các món xào đều rất ngon.'),
  ('1542BC85-1D04-490F-86F9-41D4EA896EA7', 'F66CE541-7659-41D4-A617-FB2C46626C17', 'F11CBB01-5B4E-4AB6-9274-092A8557D664', N'Bắp cải trắng 500g', 6000, 12000, 9, N'Bắp cải trắng là loại rau được trồng tại Lâm Đồng rất dễ mua và chế biến thành nhiều món ăn đa dạng khác nhau trong bữa cơm hằng ngày. Bắp cải trắng đặc biệt mang đến lợi ích trong việc hỗ trợ phòng chống ung thư, giúp cơ thể khỏe mạnh toàn diện.'),
  ('146DD0DD-1EA8-4D6C-89A6-46CADDEE3695', '8AD913F1-4792-45D4-BC22-EEA59E2AAA23', '28C9AFA0-63FB-48AB-8D16-1877726332EB', N'Mì khoai tây Cung Đình lẩu tôm chua cay gói 80g', 5000, 8000, 90, N'Sợi mì từ khoai tây và trứng vàng dai ngon hòa quyện trong nước súp lẩu tôm chua cay đậm đà cùng hương thơm lừng quyến rũ. Mì khoai tây Cung Đình lẩu tôm chua cay 80g chính hãng mì Cung Đình tiện lợi, nhanh chóng, là lựa chọn hấp dẫn cho bữa ăn nhanh gọn đơn giản, chất lượng'),
  ('3D225ACA-EF97-4952-B58A-92DA69B4F1A8', '8AD913F1-4792-45D4-BC22-EEA59E2AAA23', '28C9AFA0-63FB-48AB-8D16-1877726332EB', N'Mì 3 Miền Gold chua cay Thái gói 75g', 3500, 5000, 90, N'Mì 3 Miền đột phá với nước súp tôm thịt ngọt thanh ngọt đậm đà hợp khẩu vị người Việt Nam. Sợi mì dai, thơm, màu vàng đẹp mắt hòa quyện trong làn nước súp tròn vị, tạo ra mì 3 Miền Gold chua cay Thái 75g cực hấp dẫn, cho bữa ăn nhanh gọn đơn giản mà vẫn đầy đủ dưỡng chất.'),
  ('F6809A8A-4F0D-4FD7-8018-9D2F1DF35F54', '8AD913F1-4792-45D4-BC22-EEA59E2AAA23', '28C9AFA0-63FB-48AB-8D16-1877726332EB', N'Mì Hảo Hảo sa tế hành tím gói 75g', 3000, 4500, 90, N'Sợi mì vàng dai ngon hòa quyện trong nước súp sa tế thơm lừng, đậm đà thấm đẫm từng sợi mì sóng sánh cùng hương hành phi quyến rũ ngất ngây. Mì Hảo Hảo sa tế hành tím gói 75g chính hãng mì Hảo Hảo là lựa chọn hấp dẫn không thể bỏ qua cho những bữa ăn nhanh chóng đơn giản'),
  ('32270146-E74B-4751-B6F2-9FA742637C49', '8AD913F1-4792-45D4-BC22-EEA59E2AAA23', '28C9AFA0-63FB-48AB-8D16-1877726332EB', N'Mì Hảo Hảo sườn heo tỏi phi gói 73g', 3000, 4000, 60, N'Sợi mì vàng dai ngon hòa quyện trong nước súp sườn heo thơm lừng, đậm đà thấm đẫm từng sợi mì sóng sánh cùng hương tỏi phi quyến rũ ngất ngây. Mì Hảo Hảo sườn heo tỏi phi gói 73g chính hãng mì Hảo Hảo là lựa chọn hấp dẫn không thể bỏ qua cho những bữa ăn nhanh chóng đơn giản mà vẫn đủ chất'),
  ('7A5F5E70-47DF-4F2D-AA0C-B2B9B06470A5', '8AD913F1-4792-45D4-BC22-EEA59E2AAA23', '28C9AFA0-63FB-48AB-8D16-1877726332EB', N'Mì Gấu Đỏ tôm chua cay gói 63g', 2500, 4000, 60, N'Sợi mì vàng dai ngon được tẩm ướp nước mắm cá cơm hoà quyện trong nước súp tôm chua cay đậm đà cùng hành phi 1 nắng thơm lừng ngất ngây. Mì Gấu Đỏ tôm chua cay gói 63g chính hãng mì Gấu Đỏ thơm ngon khó cưỡng là lựa chọn hấp dẫn cho những bữa ăn nhanh gọn đơn giản và đầy đủ dưỡng chất'),
  ('B8C0E732-3464-446F-83FA-B57FAC6490DB', '4F817590-6AB9-45EC-ABEC-0186FD1DCB23', '8E2F4A81-A14A-4FBD-9FE3-23B80B1D6A15', N'Nước ngọt Coca Cola chai 600ml', 4000, 8000, 60, N'Từ thương hiệu loại nước ngọt giải khát được nhiều người yêu thích với hương vị thơm ngon, sảng khoái. Nước ngọt Coca Cola chai 600ml chính hãng nước ngọt Coca Cola với lượng gas lớn sẽ giúp bạn xua tan mọi cảm giác mệt mỏi, căng thẳng, đem lại cảm giác thoải mái sau khi hoạt động ngoài trời'),
  ('DF19A734-E7E0-442B-8F84-C4FB3048D9D2', '4F817590-6AB9-45EC-ABEC-0186FD1DCB23', '8E2F4A81-A14A-4FBD-9FE3-23B80B1D6A15', N'Nước ngọt Fanta hương xá xị chai 1.5 lít', 5000, 10000, 60, N'Nước ngọt có gas của thương hiệu nước ngọt Fanta nổi tiếng giúp giải khát sau khi hoạt động ngoài trời, giải tỏa căng thẳng, mệt mỏi khi học tập, làm việc. Nước ngọt Fanta hương xá xị chai 1.5 lít thơm ngon kích thích vị giác, cung cấp năng lượng cho cơ thể. Cam kết chính hãng, an toàn'),
  ('5C072CED-F8A7-4002-9E23-D6FB3B17D958', '4F817590-6AB9-45EC-ABEC-0186FD1DCB23', '8E2F4A81-A14A-4FBD-9FE3-23B80B1D6A15', N'Nước gạo hàn quốc OKF 1.5 lít', 30000, 45000, 150, N'Sản phẩm nước gạo OKF chính hãng thương hiệu Hàn Quốc thơm ngon, chứa nhiều dinh dưỡng và công dụng cho sức khỏe như bồi bổ sức khỏe, giảm stress, giảm béo, đẹp da,...rất được ưa chuộng. Nước gạo hàn quốc OKF 1.5 lít chai lớn dùng cho cả gia đình cam kết chất lượng, an toàn'),
  ('88AE519A-007C-4FB1-9C72-E1330E8E5021', '4F817590-6AB9-45EC-ABEC-0186FD1DCB23', '8E2F4A81-A14A-4FBD-9FE3-23B80B1D6A15', N'Trà đen Lipton vị chanh 455ml', 8000, 15000, 60, N'Nước trà Lipton với vị chát tự nhiên từ trà đen, kết hợp vị chua nhẹ của chanh tạo nên vị chua ngọt hài hòa. Trà đen Lipton Ice Tea hương chanh 455ml giúp giải tỏa cơn khát và đem lại cảm giác đầy sảng khoái, ít đường giúp bạn an tâm thưởng thức mà không lo đến vấn đề sức khỏe.'),
  ('D72F00F8-E244-4066-B127-E684E1980E50', '4F817590-6AB9-45EC-ABEC-0186FD1DCB23', '8E2F4A81-A14A-4FBD-9FE3-23B80B1D6A15', N'Nước ép đào và táo Fontana 1 lít', 25000, 40000, 60, N'Kết hợp 2 giữa đào xay nhuyễn & nước ép táo chứa nhiều khoáng chất như kali, canxi, phốt pho, sắt, silicon, magie, giảm các bệnh viêm khớp và thấp khớp. Ngoài ra thành phần chứa nhiều chất chống ô xy hóa, vitamin C nên giảm thiểu nếp nhăn, xóa dấu hiệu tuổi tác trên làn da'),
  ('9D8A88C9-1E12-4D90-894A-E8108971EFAD', '086B4625-3E89-4CDB-862E-2A894DD943C1', 'D4DDF521-4ADB-4DAA-9A11-37D412518098', N'Hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Gold 180ml', 30000, 45000, 60, N'Sản phẩm sữa tươi TH True Milk Gold có thành phần hoàn toàn từ sữa tươi tách béo, thơm ngon tiện lợi. Lốc 4 hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Gold 180ml mang đến công thức 6 lợi ích đặc biệt dành riêng cho người lớn tuổi nâng cao sức khỏe và không hề chứa chất bảo quản.'),
  ('264E5DB1-49E7-4CEF-9547-EA026405BC14', '086B4625-3E89-4CDB-862E-2A894DD943C1', 'D4DDF521-4ADB-4DAA-9A11-37D412518098', N'Hộp thức uống ngũ cốc dinh dưỡng Việt Ngũ Cốc 180ml', 15000, 25000, 60, N'Sữa hạt Việt Ngũ Cốc là sản phẩm sữa từ hạt có nguyên liệu hoàn toàn từ tự nhiên với những hạt thiên nhiên kết hợp với sữa tươi sạch thơm ngon, được mọi người tin dùng và sử dụng. Lốc 4 hộp thức uống ngũ cốc dinh dưỡng Việt Ngũ Cốc 180ml lạ miệng, kích thích vị giác'),
  ('858E9CAC-0F43-4DA4-BA9C-EAF81719CABB', '086B4625-3E89-4CDB-862E-2A894DD943C1', 'D4DDF521-4ADB-4DAA-9A11-37D412518098', N'Sữa hạt óc chó TH True Nut hộp 1 lít', 45000, 70000, 60, N'Là sản phẩm sữa hạt có nguyên liệu hoàn toàn từ tự nhiên với những hạt thiên nhiên kết hợp với sữa tươi sạch tại trang trại TH, sữa hạt TH True Nut cung cấp các vitamin, khoáng chất cho cơ thể. Sữa hạt óc chó TH True Nut hộp 1 lít đóng hộp lớn tiện dùng, hạt óc chó béo bùi, thơm ngon'),
  ('2E33A1DF-289F-4232-A969-F4B04E45018B', '086B4625-3E89-4CDB-862E-2A894DD943C1', 'D4DDF521-4ADB-4DAA-9A11-37D412518098', N'Hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Hilo 180ml', 20000, 30000, 60, N'Sữa tươi thơm ngon, bổ dưỡng của thương hiệu sữa tươi TH true Milk là sự lựa chọn an toàn cho bạn. Lốc 4 hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Hilo 180ml giúp hỗ trợ xương chắc khỏe, cung cấp các dưỡng chất cần thiết cho cơ thể. Thành phần an toàn, đã được kiểm nghiệm nghiêm ngặt.'),
  ('807FEFB2-AE7C-4223-8D51-F6AB1704338B', '086B4625-3E89-4CDB-862E-2A894DD943C1', 'D4DDF521-4ADB-4DAA-9A11-37D412518098', N'Sữa chua uống tiệt trùng vị cam SuSu túi 110ml', 5000, 10000, 60, N'Sữa chua uống Susu với vị ngon sảng khoái, bổ sung thêm vitamin A cho mắt sáng. Sữa chua giàu canxi và vitamin D3 cho xương chắc khoẻ, vintamin B6, B12, chất xơ cho bé khoẻ mạnh và năng động. Sữa chua uống tiệt trùng vị cam SuSu túi 110ml hương cam thơm lừng, dễ uống, bé nào cũng mê')


CREATE TABLE product_images (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  product_id uniqueidentifier NOT NULL,
  image_url nvarchar(500) UNIQUE NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),

  FOREIGN KEY (product_id)
  REFERENCES products (id),
);

INSERT INTO product_images (product_id, image_url)
  VALUES
  ('5C600D3B-5742-4CFF-8E71-000621D73C8E', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-chua-bi-hop-300g/1.jpg'),
  ('5C600D3B-5742-4CFF-8E71-000621D73C8E', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-chua-bi-hop-300g/2.jpg'),
  ('5C600D3B-5742-4CFF-8E71-000621D73C8E', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-chua-bi-hop-300g/3.jpg'),
  ('C2DF87FB-D09D-4FD0-B015-0468283BB217', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-phao-khay-200g/1.jpg'),
  ('C2DF87FB-D09D-4FD0-B015-0468283BB217', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-phao-khay-200g/2.jpg'),
  ('C2DF87FB-D09D-4FD0-B015-0468283BB217', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-phao-khay-200g/3.jpg'),
  ('8C75CAA5-7194-4FDE-8B7A-141083A45239', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/rau-mong-toi-4kfarm-goi-500g_/1.jpg'),
  ('8C75CAA5-7194-4FDE-8B7A-141083A45239', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/rau-mong-toi-4kfarm-goi-500g_/2.jpg'),
  ('8C75CAA5-7194-4FDE-8B7A-141083A45239', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/rau-mong-toi-4kfarm-goi-500g_/3.jpg'),
  ('9F9CBA91-23B4-450B-A741-2EC6406BE86F', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/kho-qua-khay-500g/1.jpg'),
  ('9F9CBA91-23B4-450B-A741-2EC6406BE86F', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/kho-qua-khay-500g/2.jpg'),
  ('9F9CBA91-23B4-450B-A741-2EC6406BE86F', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/kho-qua-khay-500g/3.jpg'),
  ('1542BC85-1D04-490F-86F9-41D4EA896EA7', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/bap-cai-trang-500g/1.jpg'),
  ('1542BC85-1D04-490F-86F9-41D4EA896EA7', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/bap-cai-trang-500g/2.jpg'),
  ('1542BC85-1D04-490F-86F9-41D4EA896EA7', N'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/bap-cai-trang-500g/3.jpg'),
  ('146DD0DD-1EA8-4D6C-89A6-46CADDEE3695', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-khoai-tay-cung-dinh-lau-tom-chua-cay-goi-80g/1.jpg'),
  ('146DD0DD-1EA8-4D6C-89A6-46CADDEE3695', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-khoai-tay-cung-dinh-lau-tom-chua-cay-goi-80g/2.jpg'),
  ('146DD0DD-1EA8-4D6C-89A6-46CADDEE3695', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-khoai-tay-cung-dinh-lau-tom-chua-cay-goi-80g/3.jpg'),
  ('3D225ACA-EF97-4952-B58A-92DA69B4F1A8', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-3-mien-gold-bo-ham-rau-thom-goi-75g/1.jpg'),
  ('3D225ACA-EF97-4952-B58A-92DA69B4F1A8', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-3-mien-gold-bo-ham-rau-thom-goi-75g/2.jpg'),
  ('3D225ACA-EF97-4952-B58A-92DA69B4F1A8', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-3-mien-gold-bo-ham-rau-thom-goi-75g/3.jpg'),
  ('3D225ACA-EF97-4952-B58A-92DA69B4F1A8', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-3-mien-gold-bo-ham-rau-thom-goi-75g/4.jpg'),
  ('F6809A8A-4F0D-4FD7-8018-9D2F1DF35F54', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-sa-te-hanh-tim-goi-75g/1.jpg'),
  ('F6809A8A-4F0D-4FD7-8018-9D2F1DF35F54', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-sa-te-hanh-tim-goi-75g/2.jpg'),
  ('F6809A8A-4F0D-4FD7-8018-9D2F1DF35F54', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-sa-te-hanh-tim-goi-75g/3.jpg'),
  ('32270146-E74B-4751-B6F2-9FA742637C49', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-suon-heo-toi-phi-goi-73g/1.jpg'),
  ('32270146-E74B-4751-B6F2-9FA742637C49', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-suon-heo-toi-phi-goi-73g/2.jpg'),
  ('32270146-E74B-4751-B6F2-9FA742637C49', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-suon-heo-toi-phi-goi-73g/3.jpg'),
  ('7A5F5E70-47DF-4F2D-AA0C-B2B9B06470A5', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-gau-do-tom-chua-cay-goi-63g/1.jpg'),
  ('7A5F5E70-47DF-4F2D-AA0C-B2B9B06470A5', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-gau-do-tom-chua-cay-goi-63g/2.jpg'),
  ('7A5F5E70-47DF-4F2D-AA0C-B2B9B06470A5', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-gau-do-tom-chua-cay-goi-63g/3.jpg'),
  ('7A5F5E70-47DF-4F2D-AA0C-B2B9B06470A5', N'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-gau-do-tom-chua-cay-goi-63g/4.jpg'),
  ('B8C0E732-3464-446F-83FA-B57FAC6490DB', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-coca-cola-chai-600ml/1.jpg'),
  ('B8C0E732-3464-446F-83FA-B57FAC6490DB', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-coca-cola-chai-600ml/2.jpg'),
  ('B8C0E732-3464-446F-83FA-B57FAC6490DB', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-coca-cola-chai-600ml/3.jpg'),
  ('B8C0E732-3464-446F-83FA-B57FAC6490DB', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-coca-cola-chai-600ml/4.jpg'),
  ('DF19A734-E7E0-442B-8F84-C4FB3048D9D2', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-fanta-huong-xa-xi-chai-1_5-lit/1.jpg'),
  ('DF19A734-E7E0-442B-8F84-C4FB3048D9D2', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-fanta-huong-xa-xi-chai-1_5-lit/2.jpg'),
  ('DF19A734-E7E0-442B-8F84-C4FB3048D9D2', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-fanta-huong-xa-xi-chai-1_5-lit/3.jpg'),
  ('5C072CED-F8A7-4002-9E23-D6FB3B17D958', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-gao-han-quoc-okf-1_5-lit/1.jpg'),
  ('5C072CED-F8A7-4002-9E23-D6FB3B17D958', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-gao-han-quoc-okf-1_5-lit/2.jpg'),
  ('5C072CED-F8A7-4002-9E23-D6FB3B17D958', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-gao-han-quoc-okf-1_5-lit/3.jpg'),
  ('5C072CED-F8A7-4002-9E23-D6FB3B17D958', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-gao-han-quoc-okf-1_5-lit/4.jpg'),
  ('88AE519A-007C-4FB1-9C72-E1330E8E5021', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/tra-den-lipton-vi-chanh-455ml/1.jpg'),
  ('88AE519A-007C-4FB1-9C72-E1330E8E5021', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/tra-den-lipton-vi-chanh-455ml/2.jpg'),
  ('88AE519A-007C-4FB1-9C72-E1330E8E5021', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/tra-den-lipton-vi-chanh-455ml/3.jpg'),
  ('88AE519A-007C-4FB1-9C72-E1330E8E5021', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/tra-den-lipton-vi-chanh-455ml/4.jpg'),
  ('D72F00F8-E244-4066-B127-E684E1980E50', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ep-dao-va-tao-fontana-1-lit/1.jpg'),
  ('D72F00F8-E244-4066-B127-E684E1980E50', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ep-dao-va-tao-fontana-1-lit/2.jpg'),
  ('D72F00F8-E244-4066-B127-E684E1980E50', N'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ep-dao-va-tao-fontana-1-lit/3.jpg'),
  ('9D8A88C9-1E12-4D90-894A-E8108971EFAD', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/1.jpg'),
  ('9D8A88C9-1E12-4D90-894A-E8108971EFAD', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/2.jpg'),
  ('9D8A88C9-1E12-4D90-894A-E8108971EFAD', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/3.jpg'),
  ('9D8A88C9-1E12-4D90-894A-E8108971EFAD', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/4.jpg'),
  ('264E5DB1-49E7-4CEF-9547-EA026405BC14', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/1.jpg'),
  ('264E5DB1-49E7-4CEF-9547-EA026405BC14', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/2.jpg'),
  ('264E5DB1-49E7-4CEF-9547-EA026405BC14', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/3.jpg'),
  ('264E5DB1-49E7-4CEF-9547-EA026405BC14', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/4.jpg'),
  ('858E9CAC-0F43-4DA4-BA9C-EAF81719CABB', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-hat-oc-cho-th-true-nut-hop-1-lit/1.jpg'),
  ('858E9CAC-0F43-4DA4-BA9C-EAF81719CABB', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-hat-oc-cho-th-true-nut-hop-1-lit/2.jpg'),
  ('858E9CAC-0F43-4DA4-BA9C-EAF81719CABB', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-hat-oc-cho-th-true-nut-hop-1-lit/3.jpg'),
  ('2E33A1DF-289F-4232-A969-F4B04E45018B', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/1.jpg'),
  ('2E33A1DF-289F-4232-A969-F4B04E45018B', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/2.jpg'),
  ('2E33A1DF-289F-4232-A969-F4B04E45018B', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/3.jpg'),
  ('2E33A1DF-289F-4232-A969-F4B04E45018B', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/4.jpg'),
  ('807FEFB2-AE7C-4223-8D51-F6AB1704338B', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-chua-uong-tiet-trung-vi-cam-susu-tui-110ml/1.jpg'),
  ('807FEFB2-AE7C-4223-8D51-F6AB1704338B', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-chua-uong-tiet-trung-vi-cam-susu-tui-110ml/2.jpg'),
  ('807FEFB2-AE7C-4223-8D51-F6AB1704338B', N'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-chua-uong-tiet-trung-vi-cam-susu-tui-110ml/3.jpg')

CREATE TABLE roles (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  name nvarchar(100) UNIQUE NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE()
);

INSERT INTO roles (id, name)
  VALUES
  ('24B905F5-37CD-46D3-B8EE-05C85477BC54', N'ADMIN'),
  ('4AE9CDC7-FE33-4486-81BE-D8916F1402C9', N'CUSTOMER')

CREATE TABLE accounts (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  role_id uniqueidentifier NOT NULL,
  first_name nvarchar(100) NOT NULL,
  last_name nvarchar(100) NOT NULL,
  avatar_url nvarchar(500),
  phone nvarchar(50) UNIQUE NOT NULL,
  email nvarchar(100) UNIQUE NOT NULL,
  verified bit NOT NULL DEFAULT 0,
  password nvarchar(500) NOT NULL,
  birthday datetime2 NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),

  -- Foreign key constraints
  FOREIGN KEY (role_id)
  REFERENCES roles (id),

);

INSERT INTO accounts (id, role_id, first_name, last_name, phone, email, birthday, password)
  VALUES
  ('B849550E-3AEB-4411-A4E8-B1399305B8B5', '24B905F5-37CD-46D3-B8EE-05C85477BC54', N'Tú', N'Nguyễn Ngọc Minh', '033-875-8008', 'minhtu1392000@gmail.com', DATEFROMPARTS(2023, 9, 13), N'$2a$12$/mtrqZdNc0GUOaCvxi//g.6LidXeCeAZhcNccVb8U3reCwvsk9oCe'),
  ('72A30D01-16B4-4477-8548-D50D31BF3E4F', '4AE9CDC7-FE33-4486-81BE-D8916F1402C9', N'Trúc', N'Võ Thị Hoa', '033-875-8009', 'customer@gmail.com', DATEFROMPARTS(2023, 5, 13), N'$2a$12$/mtrqZdNc0GUOaCvxi//g.6LidXeCeAZhcNccVb8U3reCwvsk9oCe')

CREATE TABLE forgot_password_tokens (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  account_id uniqueidentifier NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),
  token nvarchar(100) NOT NULL,
  expiration_date datetime2 NOT NULL,
  used bit NOT NULL DEFAULT 0,

  -- Foreign key constraints
  FOREIGN KEY (account_id)
  REFERENCES accounts (id)
);

CREATE TABLE verification_tokens (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  account_id uniqueidentifier NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),
  token nvarchar(100) NOT NULL,
  expiration_date datetime2 NOT NULL,
  used bit NOT NULL DEFAULT 0,

  -- Foreign key constraints
  FOREIGN KEY (account_id)
  REFERENCES accounts (id)
);

CREATE TABLE account_addresses (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  title nvarchar(100) NOT NULL,
  account_id uniqueidentifier NOT NULL,
  province_code int NOT NULL,
  district_code int NOT NULL,
  ward_code int NOT NULL,
  street_address nvarchar(500) NOT NULL,
  is_default bit NOT NULL DEFAULT 0,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),

  -- Foreign key constraints
  FOREIGN KEY (account_id)
  REFERENCES accounts (id),

);

INSERT INTO account_addresses (account_id, title, province_code, district_code, ward_code, street_address)
  VALUES
  ('B849550E-3AEB-4411-A4E8-B1399305B8B5', N'Nhà riêng', 79, 760, 26737, N'360 Phạm Văn Đồng'),
  ('B849550E-3AEB-4411-A4E8-B1399305B8B5', N'Công ty', 79, 760, 26746, N'12/12 Đường 49'),
  ('72A30D01-16B4-4477-8548-D50D31BF3E4F', N'Nhà riêng', 79, 760, 26740, N'180/77 Nguyễn Hữu Cảnh'),
  ('72A30D01-16B4-4477-8548-D50D31BF3E4F', N'Công ty', 79, 760, 26743, N'12/3 Đường 48')

CREATE TABLE cart_items (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  product_id uniqueidentifier NOT NULL,
  account_id uniqueidentifier NOT NULL,
  quantity int NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),

  -- Foreign key constraints
  FOREIGN KEY (product_id)
  REFERENCES products (id),
  FOREIGN KEY (account_id)
  REFERENCES accounts (id),

  -- Check constraints
  CONSTRAINT chk_quantity CHECK (quantity > 0)

);

INSERT INTO cart_items (id, product_id, account_id, quantity)
  VALUES
  ('C78EB1A6-2B1B-4CC8-907D-5644624F2E86', '5C600D3B-5742-4CFF-8E71-000621D73C8E', 'B849550E-3AEB-4411-A4E8-B1399305B8B5', 5),
  ('56C96A1E-8F9E-4343-9A5B-BFD5A5D650FB', 'C2DF87FB-D09D-4FD0-B015-0468283BB217', 'B849550E-3AEB-4411-A4E8-B1399305B8B5', 5)

--('566B7F80-5C05-42C4-BBEC-D6F30203F78B', '5C600D3B-5742-4CFF-8E71-000621D73C8E', 'B849550E-3AEB-4411-A4E8-B1399305B8B5', 5),
--('BAA7EDB7-9475-4CE5-9873-228097FA81B2', 'C2DF87FB-D09D-4FD0-B015-0468283BB217', 'B849550E-3AEB-4411-A4E8-B1399305B8B5', 5)

CREATE TABLE order_statuses (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  name nvarchar(100) UNIQUE NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE()
);

INSERT INTO order_statuses (id, name)
  VALUES
  ('57379784-B3F7-4717-9155-25ED93EEF78D', N'Chờ xác nhận'),
  ('F2E5678D-19E0-4BE0-BB0D-FDC20E0989D4', N'Đang xử lý'),
  ('741AB523-D545-4C8A-97C8-0231802CF0F3', N'Đang giao hàng'),
  ('83B6EFB9-2A3E-464A-B31A-866F3A0D9274', N'Giao thành công'),
  ('AD8B7716-CB32-4D4B-98B2-3EA4367B9CD5', N'Đã huỷ đơn')

CREATE TABLE stores (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  phone nvarchar(50) UNIQUE NOT NULL,
  email nvarchar(100) UNIQUE NOT NULL,
  province_code int NOT NULL,
  district_code int NOT NULL,
  ward_code int NOT NULL,
  street_address nvarchar(500) NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE()
);

INSERT INTO stores (id, phone, email, province_code, district_code, ward_code, street_address)
  VALUES
  ('9879B6DC-8B77-4CA6-BE18-2D1490867785', N'033-875-8008', 'n18dccn192@student.ptithcm.edu.vn', 79, 760, 26737, N'360 Phạm Văn Đồng')

CREATE TABLE store_hours (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  store_id uniqueidentifier NOT NULL,
  day_of_week nvarchar(10) NOT NULL,
  open_time time NOT NULL,
  close_time time NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),

  -- Foreign key constraints
  FOREIGN KEY (store_id)
  REFERENCES stores (id),

  -- Check constraints
  CONSTRAINT chk_day_of_week_enum CHECK (
  day_of_week IN (
  'MONDAY', 'TUESDAY', 'WEDNESDAY',
  'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
  )
  )
);

INSERT INTO store_hours (store_id, day_of_week, open_time, close_time)
  VALUES
  ('9879B6DC-8B77-4CA6-BE18-2D1490867785', 'MONDAY', '09:00:00', '18:00:00'),
  ('9879B6DC-8B77-4CA6-BE18-2D1490867785', 'TUESDAY', '10:00:00', '18:00:00'),
  ('9879B6DC-8B77-4CA6-BE18-2D1490867785', 'WEDNESDAY', '11:00:00', '18:00:00'),
  ('9879B6DC-8B77-4CA6-BE18-2D1490867785', 'THURSDAY', '09:00:00', '18:00:00'),
  ('9879B6DC-8B77-4CA6-BE18-2D1490867785', 'FRIDAY', '09:00:00', '18:00:00'),
  ('9879B6DC-8B77-4CA6-BE18-2D1490867785', 'SATURDAY', '09:00:00', '18:00:00'),
  ('9879B6DC-8B77-4CA6-BE18-2D1490867785', 'SUNDAY', '08:00:00', '18:00:00')

CREATE TABLE product_orders (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  product_id uniqueidentifier NOT NULL,
  supplier_id uniqueidentifier NOT NULL,
  import_quantity int NOT NULL,
  remaining_quantity int NOT NULL,
  import_date datetime2 NOT NULL,
  expiration_date datetime2 NOT NULL,
  unit_import_price int NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),

  -- Foreign key constraints
  FOREIGN KEY (product_id)
  REFERENCES products (id),
  FOREIGN KEY (supplier_id)
  REFERENCES suppliers (id),

  -- Check constraints
  CONSTRAINT chk_import_quantity_positive CHECK (import_quantity > 0),
  CONSTRAINT chk_remaining_quantity_non_negative CHECK (remaining_quantity >= 0),
  CONSTRAINT chk_remaining_quantity_less_than_or_equal_to_import_quantity CHECK (remaining_quantity <= import_quantity),
  CONSTRAINT chk_expiration_date_after_import_date CHECK (DATEDIFF(DAY, import_date, expiration_date) >= 1),
  CONSTRAINT chk_po_unit_import_price_positive CHECK (unit_import_price > 0)
);

INSERT INTO product_orders (id, product_id, supplier_id, import_quantity, remaining_quantity, import_date, expiration_date, unit_import_price)
  VALUES
  ('F932E16F-6B4A-4DA4-A4ED-2B89EA89DC1C', '5C600D3B-5742-4CFF-8E71-000621D73C8E', 'F11CBB01-5B4E-4AB6-9274-092A8557D664', 3, 3, DATEADD(DAY, -2, GETDATE()), DATEADD(DAY, 28, GETDATE()), 10000),
  ('13604E00-048D-4A05-9B91-5083A9118C69', '5C600D3B-5742-4CFF-8E71-000621D73C8E', 'F11CBB01-5B4E-4AB6-9274-092A8557D664', 9, 9, GETDATE(), DATEADD(DAY, 30, GETDATE()), 10000),
  ('5878FE23-8682-4C0E-A77F-731E47964732', 'C2DF87FB-D09D-4FD0-B015-0468283BB217', '28C9AFA0-63FB-48AB-8D16-1877726332EB', 2, 2, DATEADD(DAY, -2, GETDATE()), DATEADD(DAY, 28, GETDATE()), 10000),
  ('3A2A8B5A-00D3-438B-B4F9-FA35807D1839', 'C2DF87FB-D09D-4FD0-B015-0468283BB217', '28C9AFA0-63FB-48AB-8D16-1877726332EB', 8, 8, GETDATE(), DATEADD(DAY, 30, GETDATE()), 10000)

CREATE TABLE customer_orders (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  status_id uniqueidentifier NOT NULL,
  account_id uniqueidentifier NOT NULL,
  phone nvarchar(50) NOT NULL,
  province_code int NOT NULL,
  district_code int NOT NULL,
  ward_code int NOT NULL,
  street_address nvarchar(500) NOT NULL,
  delivered_on datetime2,
  estimated_distance int NOT NULL,
  estimated_delivery_time datetime2 NOT NULL,
  total int NOT NULL,
  note nvarchar(500),
  profit int NOT NULL,
  paid bit NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),

  -- Foreign key constraints
  FOREIGN KEY (status_id)
  REFERENCES order_statuses (id),
  FOREIGN KEY (account_id)
  REFERENCES accounts (id),

  -- Check constraints
  CONSTRAINT chk_profit_positive CHECK (profit > 0),
  CONSTRAINT chk_total_positive CHECK (total > 0)
);


CREATE TABLE customer_order_items (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  customer_order_id uniqueidentifier NOT NULL,
  product_id uniqueidentifier NOT NULL,
  quantity int NOT NULL,
  unit_import_price int NOT NULL,
  unit_retail_price int NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE(),

  -- Foreign key constraints
  FOREIGN KEY (customer_order_id)
  REFERENCES customer_orders (id),
  FOREIGN KEY (product_id)
  REFERENCES products (id),

  -- Check constraints
  CONSTRAINT chk_coi_quantity_positive CHECK (quantity > 0),
  CONSTRAINT chk_coi_unit_import_price_positive CHECK (unit_import_price > 0),
  CONSTRAINT chk_coi_unit_retail_price_positive CHECK (unit_retail_price > 0)
);


CREATE TABLE export_history (
  id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
  product_order_id uniqueidentifier NOT NULL,
  customer_order_item_id uniqueidentifier NOT NULL,
  quantity int NOT NULL,
  created_at datetime2 NOT NULL DEFAULT GETDATE()

  -- Foreign key constraints
  FOREIGN KEY (product_order_id)
  REFERENCES product_orders (id),
  FOREIGN KEY (customer_order_item_id)
  REFERENCES customer_order_items (id),

  -- Check constraints
  CONSTRAINT chk_eh_quantity_positive CHECK (quantity > 0),
);