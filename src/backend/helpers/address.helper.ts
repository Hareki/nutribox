// @ts-ignore
import type { ClientResponse } from '@google/maps';
import { addMinutes } from 'date-fns';

import { PREPARATION_TIME } from 'constants/delivery.constant';
import { GOOGLE_MAPS_CLIENT } from 'constants/google.constant';

export type AddressType = 'province' | 'district' | 'ward';

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
    : {});

export interface EstimatedDeliveryInfo {
  distance: number;
  durationInTraffic: number;
  heavyTraffic: boolean;
  deliveryTime: Date;
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
        const deliveryTime = addMinutes(
          new Date(),
          durationInTraffic + PREPARATION_TIME,
        );

        return { distance, durationInTraffic, heavyTraffic, deliveryTime };
      }
    }

    throw new Error('Error fetching distance and estimated time');
  } catch (error) {
    console.error('Error fetching distance and estimated time:', error);
    throw error;
  }
}
