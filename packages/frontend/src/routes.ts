import { generatePath } from 'react-router';

export const routes = {
  root: createRouteFactory('/'),
  home: createRouteFactory('/home'),
  surveys: createRouteFactory<SurveysPageParams>('/realEstates/:realEstateId/surveys/:surveyId?'),
  realEstateDashboard: createRouteFactory<RealEstatePageParams>('/realEstates/:realEstateId'),
};

export interface RealEstatePageParams {
  realEstateId: string;
}

export interface SurveysPageParams extends RealEstatePageParams {
  surveyId?: string;
}

export interface ActionPlansPageParams {
  realEstateId: string;
}

function createRouteFactory<T = void>(route: string) {
  const factory = (params: T) => generatePath(route, params);
  factory.route = route;
  return factory;
}
