import Bank from './bank.svg';
import Building from './building.svg';
import Hospital from './hospital.svg';
import Hotel from './hotel.svg';
import Petrol from './petrol.svg';
import Pin from './pin.svg';
import Restaurant from './restaurant.svg';
import School from './school.svg';
import Sport from './sport.svg';
import Store from './store.svg';

const icons = {
  Bank,
  Building,
  Hospital,
  Hotel,
  Petrol,
  Pin,
  Restaurant,
  School,
  Sport,
  Store,
};

export default icons;

export type IconType = keyof typeof icons;
