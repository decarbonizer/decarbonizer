import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbItemProps,
  BreadcrumbLink,
  BreadcrumbProps,
  Center,
  Icon,
} from '@chakra-ui/react';
import { FiChevronRight } from 'react-icons/fi';
import { Route, Switch, useParams } from 'react-router';
import { RealEstatePageParams, routes } from '../routes';
import { useGetRealEstateQuery } from '../store/api';
import { Link } from 'react-router-dom';
import NavigationMenu, { PageDisplayTypes } from '../components/NavigationMenu';

export default function NavBarBreadcrumbs() {
  const breadcrumbProps: BreadcrumbProps = {
    separator: (
      <Center>
        <Icon as={FiChevronRight} color="gray.500" />
      </Center>
    ),
  };

  return (
    <Switch>
      <Route exact path={routes.home()}>
        <Breadcrumb {...breadcrumbProps}>
          <HomeItem isCurrentPage />
        </Breadcrumb>
      </Route>
      <Route exact path={routes.realEstateDashboard.route}>
        <Breadcrumb {...breadcrumbProps}>
          <HomeItem />
          <RealEstateItem isCurrentPage marginRight="-3" />
        </Breadcrumb>
        <RealEstateLocationPicker currentPage="New Action Plan" />
      </Route>
      <Route exact path={routes.surveys.route}>
        <Breadcrumb {...breadcrumbProps}>
          <HomeItem />
          <RealEstateItem />
          <SurveyItem isCurrentPage marginRight="-3" />
        </Breadcrumb>
        <RealEstateLocationPicker currentPage="Survey Overview" />
      </Route>
      <Route exact path={routes.actionPlans.route}>
        <Breadcrumb {...breadcrumbProps}>
          <HomeItem />
          <RealEstateItem />
          <ActionPlanItem isCurrentPage marginRight="-3" />
        </Breadcrumb>
        <RealEstateLocationPicker currentPage="Action Plan Overview" />
      </Route>
      <Route exact path={routes.actionPlansBudgetOverview.route}>
        <Breadcrumb {...breadcrumbProps}>
          <HomeItem />
          <RealEstateItem />
          <ActionPlanBudgetOverviewItem isCurrentPage marginRight="-3" />
        </Breadcrumb>
        <RealEstateLocationPicker currentPage="Budget Management" />
      </Route>
      <Route exact path={routes.actionPlanFileExport.route}>
        <Breadcrumb {...breadcrumbProps}>
          <HomeItem />
          <RealEstateItem />
          <ActionPlanItem isCurrentPage marginRight="-3" />
        </Breadcrumb>
        <RealEstateLocationPicker currentPage="Action Plan Overview" />
      </Route>
    </Switch>
  );
}

function HomeItem(props: BreadcrumbItemProps) {
  return (
    <BreadcrumbItem {...props}>
      <BreadcrumbLink as={Link} to={routes.home()}>
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}

function RealEstateItem(props: BreadcrumbItemProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  const { data } = useGetRealEstateQuery({ id: realEstateId });

  return (
    <BreadcrumbItem {...props}>
      <BreadcrumbLink as={Link} to={routes.realEstateDashboard({ realEstateId })}>
        {data?.cityName ?? 'Real Estate'}
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}

function SurveyItem(props: BreadcrumbItemProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();

  return (
    <BreadcrumbItem {...props}>
      <BreadcrumbLink as={Link} to={routes.surveys({ realEstateId })}>
        Surveys
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}

function ActionPlanItem(props: BreadcrumbItemProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();

  return (
    <BreadcrumbItem {...props}>
      <BreadcrumbLink as={Link} to={routes.actionPlans({ realEstateId })} isCurrentPage>
        Action Plans
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}

function ActionPlanBudgetOverviewItem(props: BreadcrumbItemProps) {
  const { realEstateId } = useParams<RealEstatePageParams>();

  return (
    <BreadcrumbItem {...props}>
      <BreadcrumbLink as={Link} to={routes.actionPlansBudgetOverview({ realEstateId })} isCurrentPage>
        Budget Overview
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}

function RealEstateLocationPicker(props: { currentPage: PageDisplayTypes }) {
  const { realEstateId } = useParams<RealEstatePageParams>();
  return <NavigationMenu currentPage={props.currentPage} realEstateId={realEstateId} />;
}
