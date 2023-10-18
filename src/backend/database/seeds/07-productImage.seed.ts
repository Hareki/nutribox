import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { ProductImageEntity } from 'backend/entities/productImage.entity';
import type { ProductImageModel } from 'models/productImage.model';

type ProductImageSeed = Omit<ProductImageModel, 'createdAt' | 'product'> & {
  product: {
    id: string;
  };
};

const productSeeds: ProductImageSeed[] = [
  {
    id: '8546866c-289e-5819-92c2-98cc0edf91cc',
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-chua-bi-hop-300g/1.jpg',
    product: {
      id: '2a3ccc96-4f4e-5062-986a-1bcbd711e66c',
    },
  },
  {
    id: '758087a4-2e58-5b6b-bf14-25d3becac7f9',
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-chua-bi-hop-300g/2.jpg',
    product: {
      id: '2a3ccc96-4f4e-5062-986a-1bcbd711e66c',
    },
  },
  {
    id: '9bd228e1-0dba-50f0-a47b-0914568c3735',
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-chua-bi-hop-300g/3.jpg',
    product: {
      id: '2a3ccc96-4f4e-5062-986a-1bcbd711e66c',
    },
  },
  //   {
  //     id: '32c85d1c-6087-56cc-8c86-fe9a1406dc93',
  //     imageUrl:
  //       'https://ik.imagekit.io/NutriboxCDN/products/rau-cu-64087d75248e58a08bdc3e16/ca-chua-bi-hop-250g-640990a80009112a7a900b94/istockphoto-923614008-612x612_llOiaw3jF.jpg?updatedAt=1681021859729',
  //     product: {
  //       id: '2a3ccc96-4f4e-5062-986a-1bcbd711e66c',
  //     },
  //   },
  //   {
  //     id: '5482d2ec-bb66-5143-ac04-64031bc9f334',
  //     imageUrl:
  //       'https://ik.imagekit.io/NutriboxCDN/products/rau-cu-64087d75248e58a08bdc3e16/ca-chua-bi-hop-250g-640990a80009112a7a900b94/istockphoto-1324017792-612x612_N0jTiF6St.jpg?updatedAt=1681021859729',
  //     product: {
  //       id: '2a3ccc96-4f4e-5062-986a-1bcbd711e66c',
  //     },
  //   },

  {
    id: 'a3a31a2a-5cf3-5bb6-9d3d-ef0bb67e7bdb',
    product: {
      id: 'afa69721-8a38-5dde-9028-062551493e38',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-phao-khay-200g/1.jpg',
  },
  {
    id: '7c6d73c8-1992-5b82-87e0-44e0e717bbab',
    product: {
      id: 'afa69721-8a38-5dde-9028-062551493e38',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-phao-khay-200g/2.jpg',
  },
  {
    id: 'a946d6d4-b439-560b-8e25-64944d9c140c',
    product: {
      id: 'afa69721-8a38-5dde-9028-062551493e38',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/ca-phao-khay-200g/3.jpg',
  },

  {
    id: '3b388173-6688-5495-8d2d-57d26eb1eaa0',
    product: {
      id: 'fd748349-11c0-5339-9875-5965bd385750',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/rau-mong-toi-4kfarm-goi-500g_/1.jpg',
  },
  {
    id: '96445fa4-cec6-5394-b801-a0f074093f8d',
    product: {
      id: 'fd748349-11c0-5339-9875-5965bd385750',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/rau-mong-toi-4kfarm-goi-500g_/2.jpg',
  },
  {
    id: '3c9cc65e-7586-5e4f-809b-f4ba819749d7',
    product: {
      id: 'fd748349-11c0-5339-9875-5965bd385750',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/rau-mong-toi-4kfarm-goi-500g_/3.jpg',
  },

  {
    id: 'b5c82257-22b2-56e9-8ab5-f0e85557c8a4',
    product: {
      id: 'fa4e01b6-cfd2-593f-a69d-3118735207fd',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/kho-qua-khay-500g/1.jpg',
  },
  {
    id: 'f99e29bf-2de2-5eaf-8c8c-eba92d7bbe93',
    product: {
      id: 'fa4e01b6-cfd2-593f-a69d-3118735207fd',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/kho-qua-khay-500g/2.jpg',
  },
  {
    id: '4fc10a60-face-5bc4-aa94-d56f4a2145cf',
    product: {
      id: 'fa4e01b6-cfd2-593f-a69d-3118735207fd',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/kho-qua-khay-500g/3.jpg',
  },

  {
    id: 'c440b3fa-b73a-53ba-8675-67cc9dfcd89d',
    product: {
      id: '759f59ec-3028-573b-a4e9-16bcd339c029',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/bap-cai-trang-500g/1.jpg',
  },
  {
    id: 'ebd4fd9d-3b22-5bc1-94d2-5945a3c3aa3e',
    product: {
      id: '759f59ec-3028-573b-a4e9-16bcd339c029',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/bap-cai-trang-500g/2.jpg',
  },
  {
    id: 'c2db5245-14d3-506b-ae07-029ea6dd8554',
    product: {
      id: '759f59ec-3028-573b-a4e9-16bcd339c029',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/rau-cu/bap-cai-trang-500g/3.jpg',
  },

  {
    id: 'eb27c5fc-3bf3-5d98-b46c-bf85910b7265',
    product: {
      id: 'e156e1cd-d375-56f9-a1a7-7bb233ca1999',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-khoai-tay-cung-dinh-lau-tom-chua-cay-goi-80g/1.jpg',
  },
  {
    id: 'a4236233-390e-501e-9e2e-719a532c85da',
    product: {
      id: 'e156e1cd-d375-56f9-a1a7-7bb233ca1999',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-khoai-tay-cung-dinh-lau-tom-chua-cay-goi-80g/2.jpg',
  },
  {
    id: '6415ffe8-ed35-5627-9e18-565642ed7841',
    product: {
      id: 'e156e1cd-d375-56f9-a1a7-7bb233ca1999',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-khoai-tay-cung-dinh-lau-tom-chua-cay-goi-80g/3.jpg',
  },

  {
    id: '244dc829-0450-5fee-8b71-13dbbbf72e80',
    product: {
      id: '50487616-450d-572b-a8ab-f0e8f204b4d0',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-3-mien-gold-bo-ham-rau-thom-goi-75g/1.jpg',
  },
  {
    id: '4808c112-bdb3-5ce9-afe7-22de3e3735d3',
    product: {
      id: '50487616-450d-572b-a8ab-f0e8f204b4d0',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-3-mien-gold-bo-ham-rau-thom-goi-75g/2.jpg',
  },
  {
    id: '9960fa57-23a4-5e3b-b023-1a333d25da52',
    product: {
      id: '50487616-450d-572b-a8ab-f0e8f204b4d0',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-3-mien-gold-bo-ham-rau-thom-goi-75g/3.jpg',
  },
  {
    id: '6c7d85c8-f456-5f89-8cfb-7488550bcdb1',
    product: {
      id: '50487616-450d-572b-a8ab-f0e8f204b4d0',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-3-mien-gold-bo-ham-rau-thom-goi-75g/4.jpg',
  },

  {
    id: 'ffb25a10-9bc7-5fb0-a131-5a050adc765e',
    product: {
      id: '556efb35-c5e5-5bdd-b665-df64ade4b479',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-sa-te-hanh-tim-goi-75g/1.jpg',
  },
  {
    id: 'c22abab0-9779-565e-8fd5-2bec62778623',
    product: {
      id: '556efb35-c5e5-5bdd-b665-df64ade4b479',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-sa-te-hanh-tim-goi-75g/2.jpg',
  },
  {
    id: '6f2c4c38-0835-58db-a164-40e3227f43c9',
    product: {
      id: '556efb35-c5e5-5bdd-b665-df64ade4b479',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-sa-te-hanh-tim-goi-75g/3.jpg',
  },

  {
    id: '8e63398a-b333-5799-9613-69496c0dc3c8',
    product: {
      id: 'a873f0a4-956d-5a78-9e15-45861634303e',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-suon-heo-toi-phi-goi-73g/1.jpg',
  },
  {
    id: '31e0b016-5858-5ce6-92ed-7d10afdf4fd5',
    product: {
      id: 'a873f0a4-956d-5a78-9e15-45861634303e',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-suon-heo-toi-phi-goi-73g/2.jpg',
  },
  {
    id: 'b3756c0c-fc27-5d75-bb9d-624f0527c92f',
    product: {
      id: 'a873f0a4-956d-5a78-9e15-45861634303e',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-hao-hao-suon-heo-toi-phi-goi-73g/3.jpg',
  },

  {
    id: 'd914dd92-3fe6-546b-a492-95c0f820aa96',
    product: {
      id: '2e86969c-7355-5830-9360-984da104b9c4',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-gau-do-tom-chua-cay-goi-63g/1.jpg',
  },
  {
    id: '5350a9b0-1744-528e-a98e-84d690cee60a',
    product: {
      id: '2e86969c-7355-5830-9360-984da104b9c4',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-gau-do-tom-chua-cay-goi-63g/2.jpg',
  },
  {
    id: '04f2de9d-0077-5325-944d-ab3f7d7be414',
    product: {
      id: '2e86969c-7355-5830-9360-984da104b9c4',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-gau-do-tom-chua-cay-goi-63g/3.jpg',
  },
  {
    id: '11f2de6d-f3eb-558b-bb36-d70991b62c15',
    product: {
      id: '2e86969c-7355-5830-9360-984da104b9c4',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/mi-mien-chao-pho/mi-gau-do-tom-chua-cay-goi-63g/4.jpg',
  },

  {
    id: 'b91d8589-754c-5bde-90f8-734749347c29',
    product: {
      id: 'a1072f23-ef07-564b-83fa-fa55e0f7c68d',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-coca-cola-chai-600ml/1.jpg',
  },
  {
    id: '1cfcce9f-63da-5b97-89f0-d6961757ccb7',
    product: {
      id: 'a1072f23-ef07-564b-83fa-fa55e0f7c68d',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-coca-cola-chai-600ml/2.jpg',
  },
  {
    id: 'da7c70b8-a77d-5616-91f4-e203ea5dc811',
    product: {
      id: 'a1072f23-ef07-564b-83fa-fa55e0f7c68d',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-coca-cola-chai-600ml/3.jpg',
  },
  {
    id: 'e47916c0-8228-53e7-9c1c-26a8af15de1c',
    product: {
      id: 'a1072f23-ef07-564b-83fa-fa55e0f7c68d',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-coca-cola-chai-600ml/4.jpg',
  },

  {
    id: '960c8027-5ecd-55f7-9654-5c7e2b7c8e93',
    product: {
      id: 'f559bd81-4fc9-5d01-90a9-47dd3e1188bc',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-fanta-huong-xa-xi-chai-1_5-lit/1.jpg',
  },
  {
    id: '8611131b-bbf4-5423-be5a-78102878f2b8',
    product: {
      id: 'f559bd81-4fc9-5d01-90a9-47dd3e1188bc',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-fanta-huong-xa-xi-chai-1_5-lit/2.jpg',
  },
  {
    id: '777b5a27-9fa9-5ef4-9497-9c83b0f3e767',
    product: {
      id: 'f559bd81-4fc9-5d01-90a9-47dd3e1188bc',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ngot-fanta-huong-xa-xi-chai-1_5-lit/3.jpg',
  },

  {
    id: '67a2d568-cdc3-5e37-a7f8-5f213723b76d',
    product: {
      id: '1c25dbab-24af-5f4e-b08c-680dbccaa7f8',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-gao-han-quoc-okf-1_5-lit/1.jpg',
  },
  {
    id: '47c622bf-a015-5765-89c8-cdf81fd21f30',
    product: {
      id: '1c25dbab-24af-5f4e-b08c-680dbccaa7f8',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-gao-han-quoc-okf-1_5-lit/2.jpg',
  },
  {
    id: '8d419b82-b5e0-5101-bb40-6d6411700e8d',
    product: {
      id: '1c25dbab-24af-5f4e-b08c-680dbccaa7f8',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-gao-han-quoc-okf-1_5-lit/3.jpg',
  },
  {
    id: '28b4f57e-0866-52ba-8fd1-5b3641cfdb68',
    product: {
      id: '1c25dbab-24af-5f4e-b08c-680dbccaa7f8',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-gao-han-quoc-okf-1_5-lit/4.jpg',
  },

  {
    id: 'c132f6f6-235e-57fd-8b83-08dbe7f291ea',
    product: {
      id: '59fbc74f-4da9-5b4b-915d-42304eb34a42',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ep-dao-va-tao-fontana-1-lit/1.jpg',
  },
  {
    id: '7d3570cd-2d38-56db-8898-f594d867178a',
    product: {
      id: '59fbc74f-4da9-5b4b-915d-42304eb34a42',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ep-dao-va-tao-fontana-1-lit/2.jpg',
  },
  {
    id: 'ef875457-9b12-5ada-9ee3-c5735f527c0a',
    product: {
      id: '59fbc74f-4da9-5b4b-915d-42304eb34a42',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/nuoc-ep-dao-va-tao-fontana-1-lit/3.jpg',
  },

  {
    id: '2aa35402-6be2-5768-af5d-1a6d4aca1b51',
    product: {
      id: 'b73df440-eb34-5640-b201-52c82f761d74',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/tra-den-lipton-vi-chanh-455ml/1.jpg',
  },
  {
    id: 'd371ead1-0624-54f1-89e1-db7405784274',
    product: {
      id: 'b73df440-eb34-5640-b201-52c82f761d74',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/tra-den-lipton-vi-chanh-455ml/2.jpg',
  },
  {
    id: 'd5b8f20f-d410-5f2e-bdcc-b04c5ba418f3',
    product: {
      id: 'b73df440-eb34-5640-b201-52c82f761d74',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/tra-den-lipton-vi-chanh-455ml/3.jpg',
  },
  {
    id: '1afe229c-e6d2-50d6-8d75-c64457f23f8c',
    product: {
      id: 'b73df440-eb34-5640-b201-52c82f761d74',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/nuoc-giai-khat/tra-den-lipton-vi-chanh-455ml/4.jpg',
  },

  {
    id: '1f2e4c75-334c-5499-8a68-8a8b2ba433d3',
    product: {
      id: 'd1b3ce4d-6a49-5991-b330-8eaf371c6efd',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/1.jpg',
  },
  {
    id: 'c93bba20-d4f7-5a8e-a30f-2d6b029d3103',
    product: {
      id: 'd1b3ce4d-6a49-5991-b330-8eaf371c6efd',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/2.jpg',
  },
  {
    id: 'ca17870d-7333-5dae-a436-93cbe59d1ff0',
    product: {
      id: 'd1b3ce4d-6a49-5991-b330-8eaf371c6efd',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/3.jpg',
  },
  {
    id: '50d26d6d-42bf-5e1e-a0a7-e2a36a4ad10c',
    product: {
      id: 'd1b3ce4d-6a49-5991-b330-8eaf371c6efd',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml/4.jpg',
  },
  {
    id: 'bd142e92-b817-5993-a667-db272263276e',
    product: {
      id: 'd1b3ce4d-6a49-5991-b330-8eaf371c6efd',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai-64087f60248e58a08bdc3e1b/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml-6409ad450009112a7a900bd2/228041579_582629626484621_4144510921843425676_n_hdx0DS0VU.jpg?updatedAt=1691416893251',
  },
  {
    id: 'dd5c9ec6-949f-57e0-b583-75d4a5fad392',
    product: {
      id: 'd1b3ce4d-6a49-5991-b330-8eaf371c6efd',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai-64087f60248e58a08bdc3e1b/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-gold-180ml-6409ad450009112a7a900bd2/los-angles-minimalism-city-4k_RxLykSFXc.jpg?updatedAt=1696136248966',
  },

  {
    id: '7f3c8ff1-ba23-586e-b29d-7f2b8fb80d22',
    product: {
      id: 'f264fb59-12be-55b5-83cc-0ce6dbbbe6e7',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/1.jpg',
  },
  {
    id: '34968e53-b8ba-57c8-affa-15cb6859d075',
    product: {
      id: 'f264fb59-12be-55b5-83cc-0ce6dbbbe6e7',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/2.jpg',
  },
  {
    id: 'b4b4cb1d-14c4-59ee-be39-ea29ab0ff90c',
    product: {
      id: 'f264fb59-12be-55b5-83cc-0ce6dbbbe6e7',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/3.jpg',
  },
  {
    id: 'fca28c98-d3b6-5a4f-bf0b-c26bbffeb2c9',
    product: {
      id: 'f264fb59-12be-55b5-83cc-0ce6dbbbe6e7',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-thuc-uong-ngu-coc-dinh-duong-viet-ngu-coc-180ml/4.jpg',
  },

  {
    id: '852d9ba7-63c4-5588-a408-be9a65eaaf63',
    product: {
      id: '9f363036-fda4-5974-bb7f-0e5fcdfd8ba1',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-hat-oc-cho-th-true-nut-hop-1-lit/1.jpg',
  },
  {
    id: '848a0b6a-4918-5226-8f0d-930ef96f6fe4',
    product: {
      id: '9f363036-fda4-5974-bb7f-0e5fcdfd8ba1',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-hat-oc-cho-th-true-nut-hop-1-lit/2.jpg',
  },
  {
    id: '2347c95d-7994-5dff-871f-6a3299559217',
    product: {
      id: '9f363036-fda4-5974-bb7f-0e5fcdfd8ba1',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-hat-oc-cho-th-true-nut-hop-1-lit/3.jpg',
  },

  {
    id: '073beeef-281d-56cd-a282-1706d67e36d6',
    product: {
      id: '6985e68f-c353-5126-ac9c-530467bd7627',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/1.jpg',
  },
  {
    id: '5ac180dc-ecca-50e6-843b-03b2b88d52fc',
    product: {
      id: '6985e68f-c353-5126-ac9c-530467bd7627',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/2.jpg',
  },
  {
    id: 'b01f381a-493e-54d0-b83d-7ed327119f1c',
    product: {
      id: '6985e68f-c353-5126-ac9c-530467bd7627',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/3.jpg',
  },
  {
    id: 'b84ac9d2-09d3-506c-912d-a22948d89676',
    product: {
      id: '6985e68f-c353-5126-ac9c-530467bd7627',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/hop-sua-tuoi-tiet-trung-vi-tu-nhien-th-true-milk-hilo-180ml/4.jpg',
  },

  {
    id: '5a923fe3-0ad8-52a9-afe5-19937e311e6f',
    product: {
      id: 'cff0032d-0751-5587-9be4-3630cd68b007',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-chua-uong-tiet-trung-vi-cam-susu-tui-110ml/1.jpg',
  },
  {
    id: 'c0b035c4-67fd-565f-b2f8-1fbbfaf04b62',
    product: {
      id: 'cff0032d-0751-5587-9be4-3630cd68b007',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-chua-uong-tiet-trung-vi-cam-susu-tui-110ml/2.jpg',
  },
  {
    id: '29c2e24d-910f-5064-b751-52e92514448d',
    product: {
      id: 'cff0032d-0751-5587-9be4-3630cd68b007',
    },
    imageUrl:
      'https://ik.imagekit.io/NutriboxCDN/products/sua-cac-loai/sua-chua-uong-tiet-trung-vi-cam-susu-tui-110ml/3.jpg',
  },
];

export default class createProducts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const productImageRepo = connection.getRepository(ProductImageEntity);
    const res = productImageRepo.create(productSeeds);
    await productImageRepo.save(res);
  }
}
