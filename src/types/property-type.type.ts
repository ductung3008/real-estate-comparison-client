export interface PropertyType {
  id: string;
  numberOfBedroom: number;
  minArea: number;
  maxArea: number;
  minPrice: number;
  maxPrice: number;
  projectId: string;
  createdAt?: Date;
  updateAt?: Date;
}
