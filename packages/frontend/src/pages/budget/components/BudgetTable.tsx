import { Box, Table, TableCellProps, Tbody, Td, Text, Tfoot, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useCalculation } from '../../../calculations/useCalculation';
import { getSurveyAnswersForSurvey } from '../../../calculations/surveyAnswers/getSurveyAnswersForSurvey';
import {
  getIlluminationFootprintPerYear,
  getTransformedIlluminationFootprintPerYear,
} from '../../../calculations/illumination/footprint';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { SkeletonText } from '@chakra-ui/skeleton';
import {
  getIlluminationElectricityCostPerYear,
  getTransformedIlluminationElectricityCostPerYear,
} from '../../../calculations/illumination/electricityCost';
import { useFilledActionAnswersDataFrame } from '../../dashboard/dashboardContext';
import {
  getHeatingFootprintPerYear,
  getTransformedHeatingFootprintPerYear,
} from '../../../calculations/heating/footprint';
import { getHeatingCostPerYear, getTransformedHeatingCostPerYear } from '../../../calculations/heating/cost';
import {
  getElectricityFootprintPerYear,
  getTransformedElectricityFootprintPerYear,
} from '../../../calculations/electricity/footprint';
import {
  getElectricityCostPerYear,
  getTransformedElectricityCostPerYear,
} from '../../../calculations/electricity/cost';
import { getItFootprintPerYear, getTransformedItFootprintPerYear } from '../../../calculations/it/footprint';
import {
  getBusinessTravelFootprintPerYear,
  getTransformedBusinessTravelFootprintPerYear,
} from '../../../calculations/businessTravel/footprint';
import { ExternalCalculationData } from '../../../calculations/externalData';
import { IDataFrame } from 'data-forge';
import { SurveyToSurveyAnswerMap } from '../../../data/surveys/survey';
import { SurveyAnswer } from '../../../api/surveyAnswer';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import { ReactNode } from 'react';

interface Category<T extends keyof SurveyToSurveyAnswerMap = any> {
  surveyId: T;
  label: string;
  getFootprint: (
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyToSurveyAnswerMap[T]>,
  ) => number;
  getCost: (
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyToSurveyAnswerMap[T]>,
  ) => number;
  getTransformedFootprint: (
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
    actionAnswers: IDataFrame<number, ActionAnswerBase>,
  ) => number;
  getTransformedCost: (
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
    actionAnswers: IDataFrame<number, ActionAnswerBase>,
  ) => number;
}

const categories: Category[] = [
  {
    surveyId: 'illumination',
    label: 'Illumination',
    getFootprint: getIlluminationFootprintPerYear,
    getCost: getIlluminationElectricityCostPerYear,
    getTransformedFootprint: getTransformedIlluminationFootprintPerYear,
    getTransformedCost: getTransformedIlluminationElectricityCostPerYear,
  },
  {
    surveyId: 'heating',
    label: 'Heating',
    getFootprint: getHeatingFootprintPerYear,
    getCost: getHeatingCostPerYear,
    getTransformedFootprint: getTransformedHeatingFootprintPerYear,
    getTransformedCost: getTransformedHeatingCostPerYear,
  },
  {
    surveyId: 'electricity',
    label: 'Electricity',
    getFootprint: getElectricityFootprintPerYear,
    getCost: getElectricityCostPerYear,
    getTransformedFootprint: getTransformedElectricityFootprintPerYear,
    getTransformedCost: getTransformedElectricityCostPerYear,
  },
  {
    surveyId: 'it',
    label: 'IT',
    getFootprint: getItFootprintPerYear,
    getCost: () => 0,
    getTransformedFootprint: getTransformedItFootprintPerYear,
    getTransformedCost: () => 0,
  },
  {
    surveyId: 'businessTravel',
    label: 'Business Travel',
    getFootprint: getBusinessTravelFootprintPerYear,
    getCost: () => 0,
    getTransformedFootprint: getTransformedBusinessTravelFootprintPerYear,
    getTransformedCost: () => 0,
  },
];

export default function BudgetTable() {
  const filledActionAnswersDf = useFilledActionAnswersDataFrame();
  const { data, isLoading, error } = useCalculation(
    (externalCalculationData) => {
      return categories.map((category) => {
        const { surveyId, label, getFootprint, getCost, getTransformedFootprint, getTransformedCost } = category;
        const surveyAnswers = getSurveyAnswersForSurvey(externalCalculationData.surveyAnswers, surveyId);

        const footprint = getFootprint(
          externalCalculationData,
          surveyAnswers.map((answer) => answer.value),
        );
        const cost = getCost(
          externalCalculationData,
          surveyAnswers.map((answer) => answer.value),
        );
        const transformedFootprint = getTransformedFootprint(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        );
        const transformedCost = getTransformedCost(
          externalCalculationData,
          externalCalculationData.surveyAnswers,
          filledActionAnswersDf,
        );

        return {
          surveyId,
          label,
          footprint,
          cost,
          transformedFootprint,
          transformedCost,
        };
      });
    },
    [filledActionAnswersDf],
  );

  const totalFootprint = sum(data?.map((category) => category.footprint));
  const totalTransformedFootprint = sum(data?.map((category) => category.transformedFootprint));
  const totalFootprintDelta = totalFootprint - totalTransformedFootprint;

  const totalCost = sum(data?.map((category) => category.cost));
  const totalTransformedCost = sum(data?.map((category) => category.transformedCost));
  const totalCostDelta = totalCost - totalTransformedCost;

  function formatFootprint(value: number) {
    const unitSymbol = totalFootprint >= 1000 ? 't' : 'kg';
    const adjustedFootprint = totalFootprint >= 1000 ? value / 1000 : value;

    return `${adjustedFootprint.toFixed(2)} ${unitSymbol}`;
  }

  return (
    <InlineErrorDisplay error={error}>
      {isLoading && <SkeletonText />}
      {data && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <ThWithHelpText>Category</ThWithHelpText>
              <ThWithHelpText isNumeric helpText="before actions">
                CO<sub>2</sub> footprint / yr
              </ThWithHelpText>
              <ThWithHelpText isNumeric helpText="after actions">
                CO<sub>2</sub> footprint / yr
              </ThWithHelpText>
              <ThWithHelpText isNumeric helpText="before actions">
                Cost / yr
              </ThWithHelpText>
              <ThWithHelpText isNumeric helpText="after actions">
                Cost / yr
              </ThWithHelpText>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((category) => {
              const footprintDelta = category.footprint - category.transformedFootprint;
              const costDelta = category.cost - category.transformedCost;

              return (
                <Tr
                  key={category.surveyId}
                  style={{
                    opacity: footprintDelta === 0 && costDelta === 0 ? 0.6 : 1,
                  }}>
                  <TdWithHelpText>{category.label}</TdWithHelpText>
                  <TdWithHelpText isNumeric>{formatFootprint(category.footprint)}</TdWithHelpText>
                  <TdWithHelpText
                    isNumeric
                    helpText={
                      footprintDelta !== 0 ? (
                        <>
                          {formatFootprint(Math.abs(footprintDelta))} {footprintDelta > 0 ? 'saved' : 'wasted'}
                        </>
                      ) : null
                    }>
                    {formatFootprint(category.transformedFootprint)}
                  </TdWithHelpText>
                  <TdWithHelpText isNumeric>{category.cost.toFixed(2)} €</TdWithHelpText>
                  <TdWithHelpText
                    isNumeric
                    helpText={
                      costDelta !== 0 ? (
                        <>
                          {Math.abs(costDelta).toFixed(2)} {costDelta > 0 ? 'saved' : 'wasted'}
                        </>
                      ) : null
                    }>
                    {category.transformedCost.toFixed(2)} €
                  </TdWithHelpText>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <ThWithHelpText>Total</ThWithHelpText>
              <ThWithHelpText isNumeric>{formatFootprint(totalFootprint)}</ThWithHelpText>
              <ThWithHelpText
                isNumeric
                helpText={
                  totalFootprintDelta !== 0 ? (
                    <>
                      {formatFootprint(Math.abs(totalFootprintDelta))} {totalFootprintDelta > 0 ? 'saved' : 'wasted'}
                    </>
                  ) : null
                }>
                {formatFootprint(totalTransformedFootprint)} €
              </ThWithHelpText>
              <ThWithHelpText isNumeric>{sum(data.map((category) => category.cost)).toFixed(2)} €</ThWithHelpText>
              <ThWithHelpText
                isNumeric
                helpText={
                  totalCostDelta !== 0 ? (
                    <>
                      {Math.abs(totalCostDelta).toFixed(2)} € {totalCostDelta > 0 ? 'saved' : 'wasted'}
                    </>
                  ) : null
                }>
                {totalTransformedCost.toFixed(2)} €
              </ThWithHelpText>
            </Tr>
          </Tfoot>
        </Table>
      )}
    </InlineErrorDisplay>
  );
}

function TdWithHelpText({ children, helpText, ...props }: TableCellProps & { helpText?: ReactNode }) {
  return (
    <Td {...props}>
      <VStack align={props.isNumeric ? 'flex-end' : undefined} spacing="0">
        <Box h="20px">{children}</Box>
        <Box h="20px">
          <Text fontSize="xs" color="gray.500">
            {helpText}
          </Text>
        </Box>
      </VStack>
    </Td>
  );
}

function ThWithHelpText({ children, helpText, ...props }: TableCellProps & { helpText?: ReactNode }) {
  return (
    <Th {...props}>
      <VStack align={props.isNumeric ? 'flex-end' : undefined} spacing="0">
        <Box h="20px">{children}</Box>
        <Box h="20px">
          <Text
            fontSize="xs"
            color="gray.500"
            style={{
              fontSize: '0.6rem',
            }}>
            {helpText}
          </Text>
        </Box>
      </VStack>
    </Th>
  );
}

function sum(values: number[] = []): number {
  return values.reduce((acc, value) => {
    return acc + value;
  }, 0);
}
