import { useQuery } from '@tanstack/react-query';

import type { AddressAPI } from 'utils/apiCallers/profile/address';
import apiCaller from 'utils/apiCallers/profile/address';

type AddressValues = {
  province: AddressAPI | null;
  district: AddressAPI | null;
  ward: AddressAPI | null;
};

export function useAddressQuery(values: AddressValues) {
  const hasProvince = values.province !== null;
  const hasDistrict = values.district !== null;

  const { data: provinces, isLoading: isLoadingProvince } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => apiCaller.getProvinces(),
  });

  const { data: districts, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ['districts', values.province?.code],
    queryFn: () => apiCaller.getDistricts(values.province.code),
    enabled: hasProvince,
  });

  const { data: wards, isLoading: isLoadingWards } = useQuery({
    queryKey: ['wards', values.district?.code],
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
    hasProvince,
    hasDistrict,
  };
}
