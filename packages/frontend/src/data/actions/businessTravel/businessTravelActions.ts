import { ActionCategory } from '../action';
import { GiCommercialAirplane } from 'react-icons/gi';
import { reduceAirTravelAction } from './reduceAirTravelAction';

export const businessTravelActions: ActionCategory = {
  id: 'businessTravel',
  name: 'Business Travel',
  icon: GiCommercialAirplane,
  actions: [reduceAirTravelAction],
};
