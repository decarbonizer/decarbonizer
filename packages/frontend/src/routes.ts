import { generatePath } from 'react-router';

export const routes = {
  root: createRouteFactory('/'),
  home: createRouteFactory('/home'),
  surveys: createRouteFactory<SurveysPageParams>('/realEstates/:realEstateId/surveys/:surveyId?'),
  realEstateDashboard: createRouteFactory<DashboardPageParams>('/realEstates/:realEstateId/dashboard'),
  actionPlans: createRouteFactory<ActionPlansPageParams>('/realEstates/:realEstateId/actionPlans'),
};

export interface SurveysPageParams {
  realEstateId: string;
  surveyId?: string;
}

export interface DashboardPageParams {
  realEstateId: string;
}

export interface ActionPlansPageParams {
  realEstateId: string;
}

function createRouteFactory<T = void>(route: string) {
  const factory = (params: T) => generatePath(route, params);
  factory.route = route;
  return factory;
}
