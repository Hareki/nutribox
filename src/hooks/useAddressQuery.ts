import { useQuery } from '@tanstack/react-query';

import type { AddressAPI } from 'api-callers/profile/addresses';
import addressCaller from 'api-callers/profile/addresses';

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
    queryFn: () => addressCaller.getProvinces(),
  });

  const { data: districts, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ['districts', values.province?.code],
    queryFn: () => addressCaller.getDistricts(values.province.code),
    enabled: hasProvince,
  });

  const { data: wards, isLoading: isLoadingWards } = useQuery({
    queryKey: ['wards', values.district?.code],
    queryFn: () => addressCaller.getWards(values.district.code),
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
