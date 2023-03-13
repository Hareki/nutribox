import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { revertUpdateDependentDoc } from 'api/base/mongoose/dependentHandler';
import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';
import Product from 'api/models/Product.model';
import { IProductInput } from 'api/models/Product.model/types';
import ProductCategory from 'api/models/ProductCategory.model';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const dataArray: IProductInput[] = [
    {
      // hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml
      name: 'Hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Gold 180ml',
      category: new Types.ObjectId('64087f60248e58a08bdc3e1b'),
      description:
        'Sản phẩm sữa tươi TH True Milk Gold có thành phần hoàn toàn từ sữa tươi tách béo, thơm ngon tiện lợi. Lốc 4 hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Gold 180ml mang đến công thức 6 lợi ích đặc biệt dành riêng cho người lớn tuổi nâng cao sức khỏe và không hề chứa chất bảo quản.',
      imageUrls: [
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/1.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/2.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/3.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/4.jpg',
      ],
      wholesalePrice: 30000,
      retailPrice: 45000,
      shelfLife: 90,
      available: true,
      hot: false,
    },
    {
      // hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml
      name: 'Hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Hilo 180ml',
      category: new Types.ObjectId('64087f60248e58a08bdc3e1b'),
      description:
        'Sữa tươi thơm ngon, bổ dưỡng của thương hiệu sữa tươi TH true Milk là sự lựa chọn an toàn cho bạn. Lốc 4 hộp sữa tươi tiệt trùng vị tự nhiên TH true MILK Hilo 180ml giúp hỗ trợ xương chắc khỏe, cung cấp các dưỡng chất cần thiết cho cơ thể. Thành phần an toàn, đã được kiểm nghiệm nghiêm ngặt.',
      imageUrls: [
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/1.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/2.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/3.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/4.jpg',
      ],
      wholesalePrice: 20000,
      retailPrice: 30000,
      shelfLife: 30,
      available: true,
      hot: true,
    },
    {
      // sua-hat-oc-cho-th-true-nut-hop-1-lit
      name: 'Sữa hạt óc chó TH True Nut hộp 1 lít',
      category: new Types.ObjectId('64087f60248e58a08bdc3e1b'),
      description:
        'Kết hợp 2 giữa đào xay nhuyễn & nước ép táo chứa nhiều khoáng chất như kali, canxi, phốt pho, sắt, silicon, magie, giảm các bệnh viêm khớp và thấp khớp. Ngoài ra thành phần chứa nhiều chất chống ô xy hóa, vitamin C nên giảm thiểu nếp nhăn, xóa dấu hiệu tuổi tác trên làn da',
      imageUrls: [
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/sua-hat-oc-cho-th-true-nut-hop-1-lit/1.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/sua-hat-oc-cho-th-true-nut-hop-1-lit/2.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/sua-hat-oc-cho-th-true-nut-hop-1-lit/3.jpg',
      ],
      wholesalePrice: 45000,
      retailPrice: 70000,
      shelfLife: 60,
      available: true,
      hot: false,
    },
    {
      // sua-chua-uong-tiet-trung-vi-cam-susu-tui-110ml
      name: 'Sữa chua uống tiệt trùng vị cam SuSu túi 110ml',
      category: new Types.ObjectId('64087f60248e58a08bdc3e1b'),
      description:
        'Sữa chua uống Susu với vị ngon sảng khoái, bổ sung thêm vitamin A cho mắt sáng. Sữa chua giàu canxi và vitamin D3 cho xương chắc khoẻ, vintamin B6, B12, chất xơ cho bé khoẻ mạnh và năng động. Sữa chua uống tiệt trùng vị cam SuSu túi 110ml hương cam thơm lừng, dễ uống, bé nào cũng mê',
      imageUrls: [
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/sua-chua-uong-tiet-trung-vi-cam-susu-tui-110ml/1.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/sua-chua-uong-tiet-trung-vi-cam-susu-tui-110ml/2.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/sua-chua-uong-tiet-trung-vi-cam-susu-tui-110ml/3.jpg',
      ],
      wholesalePrice: 5000,
      retailPrice: 8000,
      shelfLife: 90,
      available: true,
      hot: true,
    },
    {
      // hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml
      name: 'Hộp thức uống ngũ cốc dinh dưỡng Việt Ngũ Cốc 180ml',
      category: new Types.ObjectId('64087f60248e58a08bdc3e1b'),
      description:
        'Sữa hạt Việt Ngũ Cốc là sản phẩm sữa từ hạt có nguyên liệu hoàn toàn từ tự nhiên với những hạt thiên nhiên kết hợp với sữa tươi sạch thơm ngon, được mọi người tin dùng và sử dụng. Lốc 4 hộp thức uống ngũ cốc dinh dưỡng Việt Ngũ Cốc 180ml lạ miệng, kích thích vị giác',
      imageUrls: [
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/1.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/2.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/3.jpg',
        'https://ik.imagekit.io/NutriboxCDN/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/4.jpg',
      ],
      wholesalePrice: 15000,
      retailPrice: 25000,
      shelfLife: 70,
      available: true,
      hot: true,
    },
  ];
  dataArray.forEach(async (data) => {
    const productDoc = new Product(data);
    try {
      await productDoc.save();
    } catch (error) {
      const categoryDoc = await ProductCategory.findById(productDoc.category);
      revertUpdateDependentDoc(productDoc._id, categoryDoc, 'products');
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end('Goodbye World!');
    }
  });
  const categoryDoc = await ProductCategory.findById(
    '64087f60248e58a08bdc3e1b',
  );

  res.status(StatusCodes.OK).end(categoryDoc.slug);
});

export default handler;
