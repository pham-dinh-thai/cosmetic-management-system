import axios from "axios";

const LOCATIONS_API_URL = "https://provinces.open-api.vn/api/v1";

export type VietnamLocation = {
  code: number;
  name: string;
};

type ProvinceResponse = VietnamLocation & {
  districts?: VietnamLocation[];
};

type DistrictResponse = VietnamLocation & {
  wards?: VietnamLocation[];
};

export const locationsService = {
  async getProvinces(): Promise<VietnamLocation[]> {
    const { data } = await axios.get<VietnamLocation[]>(`${LOCATIONS_API_URL}/`);
    return data;
  },

  async getDistricts(provinceCode: number): Promise<VietnamLocation[]> {
    const { data } = await axios.get<ProvinceResponse>(
      `${LOCATIONS_API_URL}/p/${provinceCode}?depth=2`,
    );
    return data.districts ?? [];
  },

  async getWards(districtCode: number): Promise<VietnamLocation[]> {
    const { data } = await axios.get<DistrictResponse>(
      `${LOCATIONS_API_URL}/d/${districtCode}?depth=2`,
    );
    return data.wards ?? [];
  },
};
