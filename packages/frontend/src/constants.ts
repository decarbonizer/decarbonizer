import { generatePath } from 'react-router';

export const routes = {
  root: createRouteFactory('/'),
  home: createRouteFactory('/home'),
  surveys: createRouteFactory<SurveysPageParams>('/realEstates/:realEstateId/surveys/:surveyId?'),
};

export interface SurveysPageParams {
  realEstateId: string;
  surveyId?: string;
}

function createRouteFactory<T = void>(route: string) {
  const factory = (params: T) => generatePath(route, params);
  factory.route = route;
  return factory;
}
