export interface PropertyType {
  id: string;
  number_of_bedroom: number;
  min_area: number;
  max_area: number;
  min_price: number;
  max_price: number;
  project_id: string;
  created_at?: Date;
  updated_at?: Date;
}
