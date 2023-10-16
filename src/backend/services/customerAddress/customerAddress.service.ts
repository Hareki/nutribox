import { Not } from 'typeorm';

import { CommonService } from '../common/common.service';

import type { NewCustomerAddressDto } from 'backend/dtos/profile/addresses/newCustomerAddress.dto';
import { CustomerAddressEntity } from 'backend/entities/customerAddress.entity';
import { isEntityNotFoundError } from 'backend/helpers/validation.helper';
import type { CustomerAddressModel } from 'models/customerAddress.model';

export class CustomerAddressService {
  private static async _setFirstAddressAsDefault(
    id: string,
    customerId: string,
  ) {
    try {
      const firstAddress = await CommonService.getRecord({
        entity: CustomerAddressEntity,
        filter: {
          id: Not(id),
          customer: { id: customerId },
        },
      });

      await CommonService.updateRecord(CustomerAddressEntity, firstAddress.id, {
        isDefault: true,
      });
    } catch (error) {
      if (!isEntityNotFoundError(error)) {
        throw error;
      }
    }
  }

  private static async _setOtherAddressesAsNotDefault(
    id: string,
    customerId: string,
  ) {
    const [addresses] = await CommonService.getRecords({
      entity: CustomerAddressEntity,
      filter: {
        customer: { id: customerId },
      },
    });

    const addressNeedUpdate = addresses.find(
      (address) => address.id !== id && address.isDefault,
    );
    if (addressNeedUpdate) {
      await CommonService.updateRecord(
        CustomerAddressEntity,
        addressNeedUpdate.id,
        {
          isDefault: false,
        },
      );
    }
  }

  public static async getAddresses(
    id: string,
  ): Promise<CustomerAddressModel[]> {
    const [customerAddresses] = await CommonService.getRecords({
      entity: CustomerAddressEntity,
      filter: {
        customer: { id },
      },
    });

    return customerAddresses as CustomerAddressModel[];
  }

  public static async addAddress(
    customerId: string,
    dto: NewCustomerAddressDto,
  ): Promise<CustomerAddressModel> {
    const address = (await CommonService.createRecord(CustomerAddressEntity, {
      ...dto,
      customer: { id: customerId },
    })) as CustomerAddressModel;

    if (address.isDefault) {
      this._setOtherAddressesAsNotDefault(address.id, customerId);
    }

    return address;
  }

  public static async updateAddress(
    id: string,
    customerId: string,
    dto: NewCustomerAddressDto,
  ): Promise<CustomerAddressModel> {
    const wasDefault = await CommonService.getRecord({
      entity: CustomerAddressEntity,
      filter: { id },
    }).then((address) => address.isDefault);

    const address = (await CommonService.updateRecord(
      CustomerAddressEntity,
      id,
      dto,
    )) as CustomerAddressModel;

    if (wasDefault && !address.isDefault) {
      this._setFirstAddressAsDefault(id, customerId);
    } else if (!wasDefault && address.isDefault) {
      this._setOtherAddressesAsNotDefault(id, customerId);
    }

    return address;
  }

  public static async deleteAddress(
    id: string,
    customerId: string,
  ): Promise<void> {
    const address = await CommonService.getRecord({
      entity: CustomerAddressEntity,
      filter: { id },
    });

    if (address.isDefault) {
      this._setFirstAddressAsDefault(id, customerId);
    }

    await CommonService.deleteRecord(CustomerAddressEntity, id);
  }
}
