import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';

import { AbstractEntity } from './abstract.entity';

import { getAddressName } from 'helpers/address.helper';

export abstract class AddressAbstractEntity extends AbstractEntity {
  @Column('int')
  provinceCode: number;

  @Column('int')
  districtCode: number;

  @Column('int')
  wardCode: number;

  @Column('text')
  provinceName: string;

  @Column('text')
  districtName: string;

  @Column('text')
  wardName: string;

  @Column()
  streetAddress: string;

  @BeforeInsert()
  @BeforeUpdate()
  async updateAddressNames() {
    if (this.provinceCode) {
      this.provinceName = await getAddressName('province', this.provinceCode);
    }
    if (this.districtCode) {
      this.districtName = await getAddressName('district', this.districtCode);
    }
    if (this.wardCode) {
      this.wardName = await getAddressName('ward', this.wardCode);
    }
  }
}
