/* eslint-disable @typescript-eslint/no-empty-interface */
import { generatePath } from 'react-router';

export const routes = {
  root: createRouteFactory('/'),
  home: createRouteFactory('/home'),
  surveys: createRouteFactory<SurveysPageParams>('/realEstates/:realEstateId/surveys/:surveyId?'),
  realEstateDashboard: createRouteFactory<RealEstateDashboardPageParams>(
    '/realEstates/:realEstateId/actionPlan/:actionPlanId?',
  ),
  actionPlans: createRouteFactory<ActionPlansPageParams>('/realEstates/:realEstateId/actionPlans'),
  actionPlanFileExport: createRouteFactory<ActionPlanFileExportPageParams>(
    '/realEstates/:realEstateId/actionPlan/:actionPlanId/export',
  ),
};

export interface RealEstatePageParams {
  realEstateId: string;
}

export interface SurveysPageParams extends RealEstatePageParams {
  surveyId?: string;
}

export interface RealEstateDashboardPageParams extends RealEstatePageParams {
  actionPlanId?: string;
}

export interface ActionPlansPageParams extends RealEstatePageParams {}

export interface ActionPlanFileExportPageParams extends RealEstatePageParams {
  actionPlanId: string;
}

function createRouteFactory<T = void>(route: string) {
  const factory = (params: T) => generatePath(route, params);
  factory.route = route;
  return factory;
}
