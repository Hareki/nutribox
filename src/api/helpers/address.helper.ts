import type { ClientResponse } from '@google/maps';
import { createClient } from '@google/maps';


export interface DeliveryInfo {
  distance: number;
  durationInTraffic: number;
  heavyTraffic: boolean;
}

const googleMapsClient = createClient({
  key: process.env.GOOGLE_API_KEY,
  Promise: Promise,
});

export async function getDeliveryInfo(
  address1: string,
  address2: string,
): Promise<DeliveryInfo | null> {
  try {
    const [response1, response2] = await Promise.all([
      googleMapsClient.geocode({ address: address1 }).asPromise(),
      googleMapsClient.geocode({ address: address2 }).asPromise(),
    ]);

    if (
      response1.status === 200 &&
      response1.json.results.length > 0 &&
      response2.status === 200 &&
      response2.json.results.length > 0
    ) {
      const location1 = response1.json.results[0].geometry.location;
      const location2 = response2.json.results[0].geometry.location;

      const response: ClientResponse<any> = await googleMapsClient
        .distanceMatrix({
          origins: [location1],
          destinations: [location2],
          units: 'metric',
          departure_time: 'now',
        })
        .asPromise();

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

    return null;
  } catch (error) {
    console.error('Error fetching distance and estimated time:', error);
    return null;
  }
}
