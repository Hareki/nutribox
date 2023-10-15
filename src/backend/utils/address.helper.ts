import type { ClientResponse } from '@google/maps';
import axios from 'axios';

import { assertNever } from '../../helpers/assertion.helper';

import { GOOGLE_MAPS_CLIENT } from 'constants/google.constants';

type AddressType = 'province' | 'district' | 'ward';

export type ProvinceApiElement<T extends AddressType> = {
  name: string;
  code: number;
  codename: string;
  division_type: T extends 'province'
    ? 'thành phố trung ương' | 'tỉnh'
    : T extends 'district'
    ? 'thành phố' | 'quận' | 'huyện'
    : 'phường' | 'xã';
} & (T extends 'province'
  ? { phone_code: string }
  : T extends 'district'
  ? { province_code: number }
  : { district_code: number }) &
  (T extends 'province'
    ? { districts: ProvinceApiElement<'district'>[] }
    : T extends 'district'
    ? { wards: ProvinceApiElement<'ward'>[] }
    : never);

export interface EstimatedDeliveryInfo {
  distance: number;
  durationInTraffic: number;
  heavyTraffic: boolean;
}

export async function getEstimatedDeliveryInfo(
  address1: string,
  address2: string,
): Promise<EstimatedDeliveryInfo> {
  try {
    const [response1, response2] = await Promise.all([
      GOOGLE_MAPS_CLIENT.geocode({ address: address1 }).asPromise(),
      GOOGLE_MAPS_CLIENT.geocode({ address: address2 }).asPromise(),
    ]);

    if (
      response1.status === 200 &&
      response1.json.results.length > 0 &&
      response2.status === 200 &&
      response2.json.results.length > 0
    ) {
      const location1 = response1.json.results[0].geometry.location;
      const location2 = response2.json.results[0].geometry.location;

      const response: ClientResponse<any> =
        await GOOGLE_MAPS_CLIENT.distanceMatrix({
          origins: [location1],
          destinations: [location2],
          units: 'metric',
          departure_time: 'now',
        }).asPromise();

      if (
        response.status === 200 &&
        response.json.rows.length > 0 &&
        response.json.rows[0].elements.length > 0
      ) {
        const element = response.json.rows[0].elements[0];
        const distance = element.distance.value / 1000; // Convert meters to kilometers
        const duration = element.duration.value / 60; // Convert seconds to minutes
        const durationInTraffic = element.duration_in_traffic.value / 60; // Convert seconds to minutes

        const heavyTraffic = durationInTraffic > duration * 1.5;

        return { distance, durationInTraffic, heavyTraffic };
      }
    }

    throw new Error('Error fetching distance and estimated time');
  } catch (error) {
    console.error('Error fetching distance and estimated time:', error);
    throw error;
  }
}

export const getAddressName = async <U extends AddressType>(
  addressType: U,
  code: string,
) => {
  let prefix: 'p' | 'd' | 'w' = 'p';
  switch (addressType) {
    case 'province':
      prefix = 'p';
      break;
    case 'district':
      prefix = 'd';
      break;
    case 'ward':
      prefix = 'w';
      break;
    default: {
      assertNever(addressType);
    }
  }

  const url = `${process.env.PROVINCE_API_URL}/${prefix}/${code}`;

  const { data } = await axios.get<ProvinceApiElement<U>>(url);
  return data.name;
};

export type GetFullAddressInputs = {
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  streetAddress: string;
};

export const getFullAddress = async ({
  provinceCode,
  districtCode,
  wardCode,
  streetAddress,
}: GetFullAddressInputs) => {
  const provinceName = await getAddressName('province', provinceCode);
  const districtName = await getAddressName('district', districtCode);
  const wardName = await getAddressName('ward', wardCode);
  return `${streetAddress}, ${wardName}, ${districtName}, ${provinceName}, Việt Nam`;
};
