import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { ProductEntity } from 'backend/entities/product.entity';
import type { ProductModel } from 'models/product.model';

type ProductSeed = Omit<
  ProductModel,
  | 'createdAt'
  | 'available'
  | 'productCategory'
  | 'productImages'
  | 'defaultSupplierId'
  | 'cartItems'
  | 'customerOrderItems'
  | 'importOrders'
> & {
  productCategory: {
    id: string;
  };
};

const productSeeds: ProductSeed[] = [
  {
    id: '2a3ccc96-4f4e-5062-986a-1bcbd711e66c',
    productCategory: { id: 'ceef9a0a-8178-497e-8dfd-23c6420da616' },
    description:
      'Cà chua bi được trồng ở Lâm Đồng là loại thực phẩm dinh dưỡng, tốt cho sức khỏe được nhiều người chọn lựa. Cà chua bi to trái, căng mọng có thể dùng ăn chơi hoặc là nguyên liệu cho những món ăn ngon khác. Cà chua bi giúp đẹp da, sáng mắt là thực phẩm nên sử dụng thường xuyên!',
    shelfLife: 15,
    retailPrice: 30000,
    name: 'Cà chua bi hộp 250g',
    maxQuantity: 100,
    defaultImportPrice: 5000,
  },
  {
    id: 'afa69721-8a38-5dde-9028-062551493e38',
    productCategory: { id: 'ceef9a0a-8178-497e-8dfd-23c6420da616' },
    description:
      'Cà pháo là món ăn truyền thống trong mỗi mâm cơm gia đình Việt Nam từ thời xa xư. Loại quả này không những ngon, mà còn có thể làm thành thuốc giúp nhuận tràng, lợi tiểu, trị thũng thấp độc, trừ hòn cục trong bụng, ho lao... Cà pháo được chế biến nhiều nhất là món cà pháo muối, chấm mắm tôm.',
    shelfLife: 60,
    retailPrice: 8000,
    name: 'Cà pháo khay 200g',
    maxQuantity: 100,
    defaultImportPrice: 5500,
  },
  {
    id: 'fd748349-11c0-5339-9875-5965bd385750',
    productCategory: { id: 'ceef9a0a-8178-497e-8dfd-23c6420da616' },
    description:
      'Rau an toàn 4KFarm với tiêu chí 4 KHÔNG, luôn ưu tiên bảo vệ sức khoẻ người tiêu dùng. Tính hàn đặc trưng của Rau Mùng Tơi 4KFarm khiến nhiều gia đình ưa chuộng để chế biến các món ăn thanh mát, phù hợp với những ngày hè nóng bức. Hàm lượng dinh dưỡng cao cũng là một trong các đặc điểm nổi bật.',
    shelfLife: 10,
    retailPrice: 14000,
    name: 'Rau mồng tơi 4KFarm gói 500g',
    maxQuantity: 100,
    defaultImportPrice: 5500,
  },
  {
    id: 'fa4e01b6-cfd2-593f-a69d-3118735207fd',
    productCategory: { id: 'ceef9a0a-8178-497e-8dfd-23c6420da616' },
    description:
      'Khổ qua hay mướp đắng là thực phẩm quen thuộc trong thực đơn hàng tuần của các bà nội trợ. Trong khổ qua chứa rất nhiều vitamin và khoáng chất tốt cho cơ thể, giúp nâng cao chức năng miễn dịch, thanh nhiệt giải độc. Khổ qua có thể chế biến thành canh hoặc các món xào đều rất ngon.',
    shelfLife: 12,
    retailPrice: 9900,
    name: 'Khổ qua khay 500g',
    maxQuantity: 100,
    defaultImportPrice: 6000,
  },
  {
    id: '759f59ec-3028-573b-a4e9-16bcd339c029',
    productCategory: { id: 'ceef9a0a-8178-497e-8dfd-23c6420da616' },
    description:
      'Bắp cải trắng là loại rau được trồng tại Lâm Đồng rất dễ mua và chế biến thành nhiều món ăn đa dạng khác nhau trong bữa cơm hằng ngày. Bắp cải trắng đặc biệt mang đến lợi ích trong việc hỗ trợ phòng chống ung thư, giúp cơ thể khỏe mạnh toàn diện.',
    shelfLife: 9,
    retailPrice: 9900,
    name: 'Bắp cải trắng 500g',
    maxQuantity: 100,
    defaultImportPrice: 7000,
  },
  {
    id: 'e156e1cd-d375-56f9-a1a7-7bb233ca1999',
    productCategory: { id: 'c0d30ecb-f9f7-4a9c-8c60-0bfe550bc971' },
    description:
      'Sợi mì từ khoai tây và trứng vàng dai ngon hòa quyện trong nước súp lẩu tôm chua cay đậm đà cùng hương thơm lừng quyến rũ. Mì khoai tây Cung Đình lẩu tôm chua cay 80g chính hãng mì Cung Đình tiện lợi, nhanh chóng, là lựa chọn hấp dẫn cho bữa ăn nhanh gọn đơn giản, chất lượng',
    shelfLife: 90,
    retailPrice: 8000,
    name: 'Mì khoai tây Cung Đình lẩu tôm chua cay gói 80g',
    maxQuantity: 100,
    defaultImportPrice: 6500,
  },
  {
    id: '50487616-450d-572b-a8ab-f0e8f204b4d0',
    productCategory: { id: 'c0d30ecb-f9f7-4a9c-8c60-0bfe550bc971' },
    description:
      'Mì 3 Miền đột phá với nước súp tôm thịt ngọt thanh ngọt đậm đà hợp khẩu vị người Việt Nam. Sợi mì dai, thơm, màu vàng đẹp mắt hòa quyện trong làn nước súp tròn vị, tạo ra mì 3 Miền Gold chua cay Thái 75g cực hấp dẫn, cho bữa ăn nhanh gọn đơn giản mà vẫn đầy đủ dưỡng chất.',
    shelfLife: 90,
    retailPrice: 5000,
    name: 'Mì 3 Miền Gold chua cay Thái gói 75g',
    maxQuantity: 100,
    defaultImportPrice: 7000,
  },
  {
    id: '556efb35-c5e5-5bdd-b665-df64ade4b479',
    productCategory: { id: 'c0d30ecb-f9f7-4a9c-8c60-0bfe550bc971' },
    description:
      'Sợi mì vàng dai ngon hòa quyện trong nước súp sa tế thơm lừng, đậm đà thấm đẫm từng sợi mì sóng sánh cùng hương hành phi quyến rũ ngất ngây. Mì Hảo Hảo sa tế hành tím gói 75g chính hãng mì Hảo Hảo là lựa chọn hấp dẫn không thể bỏ qua cho những bữa ăn nhanh chóng đơn giản',
    shelfLife: 90,
    retailPrice: 4500,
    name: 'Mì Hảo Hảo sa tế hành tím gói 75g',
    maxQuantity: 100,
    defaultImportPrice: 5500,
  },
  {
    id: 'a873f0a4-956d-5a78-9e15-45861634303e',
    productCategory: { id: 'c0d30ecb-f9f7-4a9c-8c60-0bfe550bc971' },
    description:
      'Sợi mì vàng dai ngon hòa quyện trong nước súp sườn heo thơm lừng, đậm đà thấm đẫm từng sợi mì sóng sánh cùng hương tỏi phi quyến rũ ngất ngây. Mì Hảo Hảo sườn heo tỏi phi gói 73g chính hãng mì Hảo Hảo là lựa chọn hấp dẫn không thể bỏ qua cho những bữa ăn nhanh chóng đơn giản mà vẫn đủ chất',
    shelfLife: 90,
    retailPrice: 4500,
    name: 'Mì Hảo Hảo sườn heo tỏi phi gói 73g',
    maxQuantity: 100,
    defaultImportPrice: 5000,
  },
  {
    id: '2e86969c-7355-5830-9360-984da104b9c4',
    productCategory: { id: 'c0d30ecb-f9f7-4a9c-8c60-0bfe550bc971' },
    description:
      'Sợi mì vàng dai ngon được tẩm ướp nước mắm cá cơm hoà quyện trong nước súp tôm chua cay đậm đà cùng hành phi 1 nắng thơm lừng ngất ngây. Mì Gấu Đỏ tôm chua cay gói 63g chính hãng mì Gấu Đỏ thơm ngon khó cưỡng là lựa chọn hấp dẫn cho những bữa ăn nhanh gọn đơn giản và đầy đủ dưỡng chất',
    shelfLife: 90,
    retailPrice: 4000,
    name: 'Mì Gấu Đỏ tôm chua cay gói 63g',
    maxQuantity: 100,
    defaultImportPrice: 5500,
  },
  {
    id: 'a1072f23-ef07-564b-83fa-fa55e0f7c68d',
    productCategory: { id: '66f8245d-fdf5-41bc-939c-2e53fc1f9e77' },
    description:
      'Từ thương hiệu loại nước ngọt giải khát được nhiều người yêu thích với hương vị thơm ngon, sảng khoái. Nước ngọt Coca Cola chai 600ml chính hãng nước ngọt Coca Cola với lượng gas lớn sẽ giúp bạn xua tan mọi cảm giác mệt mỏi, căng thẳng, đem lại cảm giác thoải mái sau khi hoạt động ngoài trời',
    shelfLife: 120,
    retailPrice: 18000,
    name: 'Nước ngọt Coca Cola chai 600ml',
    maxQuantity: 100,
    defaultImportPrice: 6000,
  },
  {
    id: 'f559bd81-4fc9-5d01-90a9-47dd3e1188bc',
    productCategory: { id: '66f8245d-fdf5-41bc-939c-2e53fc1f9e77' },
    description:
      'Nước ngọt có gas của thương hiệu nước ngọt Fanta nổi tiếng giúp giải khát sau khi hoạt động ngoài trời, giải tỏa căng thẳng, mệt mỏi khi học tập, làm việc. Nước ngọt Fanta hương xá xị chai 1.5 lít thơm ngon kích thích vị giác, cung cấp năng lượng cho cơ thể. Cam kết chính hãng, an toàn',
    shelfLife: 90,
    retailPrice: 15000,
    name: 'Nước ngọt Fanta hương xá xị chai 1.5 lít',
    maxQuantity: 100,
    defaultImportPrice: 7000,
  },
  {
    id: '1c25dbab-24af-5f4e-b08c-680dbccaa7f8',
    productCategory: { id: '66f8245d-fdf5-41bc-939c-2e53fc1f9e77' },
    description:
      'Sản phẩm nước gạo OKF chính hãng thương hiệu Hàn Quốc thơm ngon, chứa nhiều dinh dưỡng và công dụng cho sức khỏe như bồi bổ sức khỏe, giảm stress, giảm béo, đẹp da,...rất được ưa chuộng. Nước gạo hàn quốc OKF 1.5 lít chai lớn dùng cho cả gia đình cam kết chất lượng, an toàn',
    shelfLife: 150,
    retailPrice: 45000,
    name: 'Nước gạo hàn quốc OKF 1.5 lít',
    maxQuantity: 100,
    defaultImportPrice: 6500,
  },
  {
    id: '59fbc74f-4da9-5b4b-915d-42304eb34a42',
    productCategory: { id: '66f8245d-fdf5-41bc-939c-2e53fc1f9e77' },
    description:
      'Kết hợp 2 giữa đào xay nhuyễn & nước ép táo chứa nhiều khoáng chất như kali, canxi, phốt pho, sắt, silicon, magie, giảm các bệnh viêm khớp và thấp khớp. Ngoài ra thành phần chứa nhiều chất chống ô xy hóa, vitamin C nên giảm thiểu nếp nhăn, xóa dấu hiệu tuổi tác trên làn da',
    shelfLife: 60,
    retailPrice: 40000,
    name: 'Nước ép đào và táo Fontana 1 lít',
    maxQuantity: 100,
    defaultImportPrice: 5000,
  },
  {
    id: 'b73df440-eb34-5640-b201-52c82f761d74',
    productCategory: { id: '66f8245d-fdf5-41bc-939c-2e53fc1f9e77' },
    description:
      'Nước trà Lipton với vị chát tự nhiên từ trà đen, kết hợp vị chua nhẹ của chanh tạo nên vị chua ngọt hài hòa. Trà đen Lipton Ice Tea hương chanh 455ml giúp giải tỏa cơn khát và đem lại cảm giác đầy sảng khoái, ít đường giúp bạn an tâm thưởng thức mà không lo đến vấn đề sức khỏe.',
    shelfLife: 100,
    retailPrice: 15000,
    name: 'Trà đen Lipton vị chanh 455ml',
    maxQuantity: 100,
    defaultImportPrice: 6500,
  },
  {
    id: 'd1b3ce4d-6a49-5991-b330-8eaf371c6efd',
    productCategory: { id: '9c9dda8c-d7a9-4aaf-a84b-8c51da751653' },
    description:
      'Sản phẩm sữa tươi TH True Milk Gold có thành phần hoàn toàn từ sữa tươi tách béo, thơm ngon tiện lợi. Lốc 4 hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Gold 180ml mang đến công thức 6 lợi ích đặc biệt dành riêng cho người lớn tuổi nâng cao sức khỏe và không hề chứa chất bảo quản.',
    shelfLife: 90,
    retailPrice: 45000,
    name: 'Hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Gold 180ml',
    maxQuantity: 100,
    defaultImportPrice: 6500,
  },
  {
    id: 'f264fb59-12be-55b5-83cc-0ce6dbbbe6e7',
    productCategory: { id: '9c9dda8c-d7a9-4aaf-a84b-8c51da751653' },
    description:
      'Sữa hạt Việt Ngũ Cốc là sản phẩm sữa từ hạt có nguyên liệu hoàn toàn từ tự nhiên với những hạt thiên nhiên kết hợp với sữa tươi sạch thơm ngon, được mọi người tin dùng và sử dụng. Lốc 4 hộp thức uống ngũ cốc dinh dưỡng Việt Ngũ Cốc 180ml lạ miệng, kích thích vị giác',
    shelfLife: 70,
    retailPrice: 25000,
    name: 'Hộp thức uống ngũ cốc dinh dưỡng Việt Ngũ Cốc 180ml',
    maxQuantity: 100,
    defaultImportPrice: 5000,
  },
  {
    id: '9f363036-fda4-5974-bb7f-0e5fcdfd8ba1',
    productCategory: { id: '9c9dda8c-d7a9-4aaf-a84b-8c51da751653' },
    description:
      'Kết hợp 2 giữa đào xay nhuyễn & nước ép táo chứa nhiều khoáng chất như kali, canxi, phốt pho, sắt, silicon, magie, giảm các bệnh viêm khớp và thấp khớp. Ngoài ra thành phần chứa nhiều chất chống ô xy hóa, vitamin C nên giảm thiểu nếp nhăn, xóa dấu hiệu tuổi tác trên làn da',
    shelfLife: 60,
    retailPrice: 70000,
    name: 'Sữa hạt óc chó TH True Nut hộp 1 lít',
    maxQuantity: 100,
    defaultImportPrice: 7000,
  },
  {
    id: '6985e68f-c353-5126-ac9c-530467bd7627',
    productCategory: { id: '9c9dda8c-d7a9-4aaf-a84b-8c51da751653' },
    description:
      'Sữa tươi thơm ngon, bổ dưỡng của thương hiệu sữa tươi TH true Milk là sự lựa chọn an toàn cho bạn. Lốc 4 hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Hilo 180ml giúp hỗ trợ xương chắc khỏe, cung cấp các dưỡng chất cần thiết cho cơ thể. Thành phần an toàn, đã được kiểm nghiệm nghiêm ngặt.',
    shelfLife: 30,
    retailPrice: 30000,
    name: 'Hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Hilo 180ml',
    maxQuantity: 100,
    defaultImportPrice: 5500,
  },
  {
    id: 'cff0032d-0751-5587-9be4-3630cd68b007',
    productCategory: { id: '9c9dda8c-d7a9-4aaf-a84b-8c51da751653' },
    description:
      'Sữa chua uống Susu với vị ngon sảng khoái, bổ sung thêm vitamin A cho mắt sáng. Sữa chua giàu canxi và vitamin D3 cho xương chắc khoẻ, vintamin B6, B12, chất xơ cho bé khoẻ mạnh và năng động. Sữa chua uống tiệt trùng vị cam SuSu túi 110ml hương cam thơm lừng, dễ uống, bé nào cũng mê',
    shelfLife: 90,
    retailPrice: 8000,
    name: 'Sữa chua uống tiệt trùng vị cam SuSu túi 110ml',
    maxQuantity: 100,
    defaultImportPrice: 5500,
  },
];

export default class createProducts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const accountRepo = connection.getRepository(ProductEntity);
    const res = accountRepo.create(productSeeds);
    await accountRepo.save(res);
  }
}
