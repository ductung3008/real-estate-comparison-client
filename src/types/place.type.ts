export interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  rating: number;
  category: PlaceCategories;
  project_id?: string;
  created_at?: string;
  updated_at?: string;
}

export enum PlaceCategories {
  SCHOOL = 'SCHOOL',
  HOSPITAL = 'HOSPITAL',
  RESTAURANT = 'RESTAURANT',
  HOTEL = 'HOTEL',
  STORE = 'STORE',
  BANK = 'BANK',
  SPORT = 'SPORT',
  PETRO = 'PETRO',
  OTHER = 'OTHER',
}

export const place_categories = [
  {
    value: 'SCHOOL',
    label: 'Trường học',
  },
  {
    value: 'HOSPITAL',
    label: 'Bệnh viện',
  },
  {
    value: 'RESTAURANT',
    label: 'Nhà hàng',
  },
  {
    value: 'HOTEL',
    label: 'Khách sạn',
  },
  {
    value: 'STORE',
    label: 'Cửa hàng',
  },
  {
    value: 'BANK',
    label: 'Ngân hàng',
  },
  {
    value: 'SPORT',
    label: 'Sân thể thao',
  },
  {
    value: 'PETRO',
    label: 'Trạm xăng',
  },
  {
    value: 'OTHER',
    label: 'Khác',
  },
];
