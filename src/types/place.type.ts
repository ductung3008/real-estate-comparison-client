import CategoryIcon from '@/assets/images/categoryIcons';
import MapPinIcon from '@/assets/images/mapPins';

export interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  rating: number;
  category: PlaceCategories;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
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
    icon: CategoryIcon.School,
    mapPin: MapPinIcon.School,
  },
  {
    value: 'HOSPITAL',
    label: 'Bệnh viện',
    icon: CategoryIcon.Hospital,
    mapPin: MapPinIcon.Hospital,
  },
  {
    value: 'RESTAURANT',
    label: 'Nhà hàng',
    icon: CategoryIcon.Restaurant,
    mapPin: MapPinIcon.Restaurant,
  },
  {
    value: 'HOTEL',
    label: 'Khách sạn',
    icon: CategoryIcon.Hotel,
    mapPin: MapPinIcon.Hotel,
  },
  {
    value: 'STORE',
    label: 'Cửa hàng',
    icon: CategoryIcon.Store,
    mapPin: MapPinIcon.Store,
  },
  {
    value: 'BANK',
    label: 'Ngân hàng',
    icon: CategoryIcon.Bank,
    mapPin: MapPinIcon.Bank,
  },
  {
    value: 'SPORT',
    label: 'Sân thể thao',
    icon: CategoryIcon.Sport,
    mapPin: MapPinIcon.Sport,
  },
  {
    value: 'PETRO',
    label: 'Trạm xăng',
    icon: CategoryIcon.Petrol,
    mapPin: MapPinIcon.Petrol,
  },
  {
    value: 'OTHER',
    label: 'Khác',
    icon: CategoryIcon.Building,
    mapPin: MapPinIcon.Building,
  },
];
