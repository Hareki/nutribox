// import schemasWithNames from 'api/models';
import mongoose from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { accountSchema } from 'api/models/Account.model/schema';
import { customerOrderSchema } from 'api/models/CustomerOrder.model/schema';
import { expirationSchema } from 'api/models/Expiration.model/schema';
import { orderStatusSchema } from 'api/models/OrderStatus.model/schema';
import { passwordResetSchema } from 'api/models/PasswordReset.model/schema';
import { productSchema } from 'api/models/Product.model/schema';
import { productCategorySchema } from 'api/models/ProductCategory.model/schema';
import { productOrderSchema } from 'api/models/ProductOrder.model/schema';
import { storeSchema } from 'api/models/Store.model/schema';
import { supplierSchema } from 'api/models/Supplier.model/schema';

const schemasWithNames = [
  { name: 'Account', schema: accountSchema },
  { name: 'CustomerOrder', schema: customerOrderSchema },
  { name: 'Expiration', schema: expirationSchema },
  { name: 'OrderStatus', schema: orderStatusSchema },
  { name: 'PasswordReset', schema: passwordResetSchema },
  { name: 'Product', schema: productSchema },
  { name: 'ProductCategory', schema: productCategorySchema },
  { name: 'ProductOrder', schema: productOrderSchema },
  { name: 'Store', schema: storeSchema },
  { name: 'Supplier', schema: supplierSchema },
];

const globalSchemaOptions = {
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
};

function registerModels() {
  //   console.log('run register models');
  for (const { name, schema } of schemasWithNames) {
    if (!mongoose.models[name]) {
      mongoose.model(name, schema);
    }
  }
}

// console.log('run outsider');
mongoose.set('toJSON', globalSchemaOptions.toJSON);
mongoose.set('toObject', globalSchemaOptions.toObject);
// mongoose.plugin(mongooseLeanVirtuals);
registerModels();
