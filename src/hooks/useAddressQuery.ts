import { useQuery } from '@tanstack/react-query';

import addressCaller from 'api-callers/profile/addresses';
import type { AddressAPI } from 'backend/dtos/checkout.dto';

type AddressValues = {
  province: AddressAPI;
  district: AddressAPI;
  ward: AddressAPI;
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

  const convertedProvinces: AddressAPI[] =
    provinces?.map((province) => ({
      code: province.code,
      name: province.name,
    })) || ([] as AddressAPI[]);

  const convertedDistricts: AddressAPI[] =
    districts?.map((district) => ({
      code: district.code,
      name: district.name,
    })) || ([] as AddressAPI[]);

  const convertedWards: AddressAPI[] =
    wards?.map((ward) => ({
      code: ward.code,
      name: ward.name,
    })) || ([] as AddressAPI[]);

  return {
    provinces: convertedProvinces,
    isLoadingProvince,
    districts: convertedDistricts,
    isLoadingDistricts,
    wards: convertedWards,
    isLoadingWards,
    hasProvince,
    hasDistrict,
  };
}
