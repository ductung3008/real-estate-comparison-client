import { Place } from './place.type';
import { Price } from './price.type';
import { PropertyType } from './property-type.type';

export interface Project {
  id: string;
  code: string;
  name: string;
  address: string;
  developerName: string;
  masterPlanUrl: string;
  infrastructureMapUrl?: string;
  constructionStartDateFrom?: string;
  handoverDate?: string;
  rank?: string;
  totalArea: number;
  ctsnDens?: number;
  totalProperty: number;
  minSellingPrice: number;
  maxSellingPrice: number;
  minUnitPrice?: number;
  maxUnitPrice?: number;
  blocks?: number;
  numberEle?: number;
  numberLivingFloor?: number;
  numberBasement?: number;
  minPropPerFloor?: number;
  maxPropPerFloor?: number;
  bikeParkingMonthly?: number;
  carParkingMonthly?: number;
  latitude: number;
  longitude: number;
  createdBy?: string;
  createdAt?: string;
  updateAt?: string;
  properties?: PropertyType[];
  places?: Place[];
  prices?: Price[];
}
