// @ts-ignore
import axios from 'axios';
import { addMinutes } from 'date-fns';

import { PREPARATION_TIME } from 'constants/delivery.constant';

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

// export async function getEstimatedDeliveryInfo(
//   address1: string,
//   address2: string,
// ): Promise<EstimatedDeliveryInfo> {
//   try {
//     const [response1, response2] = await Promise.all([
//       GOOGLE_MAPS_CLIENT.geocode({ address: address1 }).asPromise(),
//       GOOGLE_MAPS_CLIENT.geocode({ address: address2 }).asPromise(),
//     ]);

//     if (
//       response1.status === 200 &&
//       response1.json.results.length > 0 &&
//       response2.status === 200 &&
//       response2.json.results.length > 0
//     ) {
//       const location1 = response1.json.results[0].geometry.location;
//       const location2 = response2.json.results[0].geometry.location;

//       const response: ClientResponse<any> =
//         await GOOGLE_MAPS_CLIENT.distanceMatrix({
//           origins: [location1],
//           destinations: [location2],
//           units: 'metric',
//           departure_time: 'now',
//         }).asPromise();

//       if (
//         response.status === 200 &&
//         response.json.rows.length > 0 &&
//         response.json.rows[0].elements.length > 0
//       ) {
//         const element = response.json.rows[0].elements[0];
//         const distance = element.distance.value / 1000; // Convert meters to kilometers
//         const duration = element.duration.value / 60; // Convert seconds to minutes
//         const durationInTraffic = element.duration_in_traffic.value / 60; // Convert seconds to minutes

//         const heavyTraffic = durationInTraffic > duration * 1.5;
//         const deliveryTime = addMinutes(
//           new Date(),
//           durationInTraffic + PREPARATION_TIME,
//         );

//         return { distance, durationInTraffic, heavyTraffic, deliveryTime };
//       }
//     }

//     console.log('ERROR FETCHING 1');
//     throw new Error('Error fetching distance and estimated time');
//   } catch (error) {
//     console.log('ERROR FETCHING 2');
//     console.error('Error fetching distance and estimated time:', error);
//     throw error;
//   }
// }

// export async function getEstimatedDeliveryInfo(
//   fromAddress: string,
//   toAddress: string,
// ): Promise<EstimatedDeliveryInfo> {
//   const endpoint = 'https://maps.googleapis.com/maps/api/directions/json';
//   const params = {
//     origin: fromAddress,
//     destination: toAddress,
//     mode: 'driving',
//     departure_time: 'now', // To get duration in traffic
//     traffic_model: 'best_guess', // Best guess based on historical data
//     key: process.env.GOOGLE_API_KEY,
//   };

//   try {
//     const response = await axios.get(endpoint, { params });

//     if (response.data && response.data.routes[0]) {
//       const route = response.data.routes[0].legs[0];

//       const distance = parseFloat(route.distance.value) / 1000;
//       const duration = parseInt(route.duration.value) / 60;
//       const durationInTraffic = parseInt(route.duration_in_traffic.value) / 60;

//       const heavyTraffic = durationInTraffic > duration * 1.5; // Check if the traffic increases the usual duration by 50%

//       const deliveryTime = addMinutes(
//         new Date(),
//         durationInTraffic + PREPARATION_TIME,
//       );

//       return {
//         distance,
//         durationInTraffic,
//         heavyTraffic,
//         deliveryTime,
//       };
//     } else {
//       console.log('response error:', response);
//       throw new Error('Unable to retrieve route details.');
//     }
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     throw error;
//   }
// }

export async function getEstimatedDeliveryInfo(
  fromAddress: string,
  toAddress: string,
): Promise<EstimatedDeliveryInfo> {
  // Mapbox requires coordinates (longitude, latitude). So, first, we'll geocode the addresses to get these coordinates.
  const [fromCoords, toCoords] = await Promise.all([
    geocodeAddress(fromAddress),
    geocodeAddress(toAddress),
  ]);

  const endpoint = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoords};${toCoords}`;
  const params = {
    geometries: 'geojson',
    access_token: process.env.MAPBOX_SECRET_KEY,
  };

  try {
    const response = await axios.get(endpoint, { params });

    if (response.data && response.data.routes[0]) {
      const route = response.data.routes[0];

      const distance = parseFloat(route.distance) / 1000; // Convert distance from meters to kilometers
      const durationInTraffic = parseFloat(route.duration) / 60; // Convert duration from seconds to minutes

      const deliveryTime = addMinutes(
        new Date(),
        durationInTraffic + PREPARATION_TIME,
      );

      return {
        distance: parseFloat(distance.toFixed(2)),
        durationInTraffic,
        deliveryTime,
        heavyTraffic: false,
      };
    } else {
      throw new Error('Unable to retrieve route details.');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

async function geocodeAddress(address: string): Promise<string> {
  const endpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  const params = {
    access_token: process.env.MAPBOX_SECRET_KEY,
    limit: 1,
  };

  try {
    const response = await axios.get(
      `${endpoint}${encodeURIComponent(address)}.json`,
      { params },
    );
    if (response.data && response.data.features && response.data.features[0]) {
      const [longitude, latitude] = response.data.features[0].center;
      return `${longitude},${latitude}`;
    } else {
      throw new Error('Unable to geocode address.');
    }
  } catch (error) {
    console.error(`Geocoding Error: ${error.message}`);
    return '';
  }
}
