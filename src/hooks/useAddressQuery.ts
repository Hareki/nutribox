import { useQuery } from '@tanstack/react-query';

import type { AddressAPI } from 'utils/apiCallers/address';
import apiCaller from 'utils/apiCallers/address';

export function useAddressQuery(
  values: any,
  hasProvince: boolean,
  hasDistrict: boolean,
) {
  const { data: provinces, isLoading: isLoadingProvince } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => apiCaller.getProvinces(),
  });

  const { data: districts, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ['districts', (values.province as AddressAPI)?.code],
    queryFn: () => apiCaller.getDistricts(values.province.code),
    enabled: hasProvince,
  });

  const { data: wards, isLoading: isLoadingWards } = useQuery({
    queryKey: ['wards', (values.district as AddressAPI)?.code],
    queryFn: () => apiCaller.getWards(values.district.code),
    enabled: hasDistrict,
  });

  return {
    provinces,
    isLoadingProvince,
    districts,
    isLoadingDistricts,
    wards,
    isLoadingWards,
  };
}
