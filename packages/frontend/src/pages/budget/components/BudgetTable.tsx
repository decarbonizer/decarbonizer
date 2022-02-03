import { Box, Table, TableCellProps, Tbody, Td, Text, Tfoot, Th, Thead, Tr, VStack, Heading } from '@chakra-ui/react';
import { useCalculation } from '../../../calculations/useCalculation';
import InlineErrorDisplay from '../../../components/InlineErrorDisplay';
import { SkeletonText } from '@chakra-ui/skeleton';
import { ExternalCalculationData } from '../../../calculations/useExternalCalculationData';
import { DataFrame, IDataFrame } from 'data-forge';
import { SurveyToSurveyAnswerMap } from '../../../data/surveys/survey';
import { SurveyAnswer } from '../../../api/surveyAnswer';
import { ActionAnswerBase } from '../../../api/actionAnswer';
import { ReactNode } from 'react';
import * as Pdf from '@react-pdf/renderer';
import { illuminationCoreCalculations } from '../../../calculations/core/illuminationCoreCalculations';
import { heatingCoreCalculations } from '../../../calculations/core/heatingCoreCalculations';
import { electricityCoreCalculations } from '../../../calculations/core/electricityCoreCalculations';
import { itCoreCalculations } from '../../../calculations/core/itCoreCalculations';
import { businessTravelCoreCalculations } from '../../../calculations/core/businessTravelCoreCalculations';
import { ActionPlan } from '../../../api/actionPlan';

interface Category<T extends keyof SurveyToSurveyAnswerMap = any> {
  surveyId: T;
  label: string;
  getFootprint: (
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
  ) => number;
  getCost: (
    externalCalculationData: ExternalCalculationData,
    surveyAnswers: IDataFrame<number, SurveyAnswer>,
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
    getFootprint: illuminationCoreCalculations.getSummedYearlyFootprint.bind(illuminationCoreCalculations),
    getCost: illuminationCoreCalculations.getTotalSummedYearlyConstantCosts.bind(illuminationCoreCalculations),
    getTransformedFootprint: illuminationCoreCalculations.getSummedYearlyFootprint.bind(illuminationCoreCalculations),
    getTransformedCost:
      illuminationCoreCalculations.getTotalSummedYearlyConstantCosts.bind(illuminationCoreCalculations),
  },
  {
    surveyId: 'heating',
    label: 'Heating',
    getFootprint: heatingCoreCalculations.getSummedYearlyFootprint.bind(heatingCoreCalculations),
    getCost: heatingCoreCalculations.getTotalSummedYearlyConstantCosts.bind(heatingCoreCalculations),
    getTransformedFootprint: heatingCoreCalculations.getSummedYearlyFootprint.bind(heatingCoreCalculations),
    getTransformedCost: heatingCoreCalculations.getTotalSummedYearlyConstantCosts.bind(heatingCoreCalculations),
  },
  {
    surveyId: 'electricity',
    label: 'Electricity',
    getFootprint: electricityCoreCalculations.getSummedYearlyFootprint.bind(electricityCoreCalculations),
    getCost: electricityCoreCalculations.getTotalSummedYearlyConstantCosts.bind(electricityCoreCalculations),
    getTransformedFootprint: electricityCoreCalculations.getSummedYearlyFootprint.bind(electricityCoreCalculations),
    getTransformedCost: electricityCoreCalculations.getTotalSummedYearlyConstantCosts.bind(electricityCoreCalculations),
  },
  {
    surveyId: 'it',
    label: 'IT',
    getFootprint: itCoreCalculations.getSummedYearlyFootprint.bind(itCoreCalculations),
    getCost: itCoreCalculations.getTotalSummedYearlyConstantCosts.bind(itCoreCalculations),
    getTransformedFootprint: itCoreCalculations.getSummedYearlyFootprint.bind(itCoreCalculations),
    getTransformedCost: itCoreCalculations.getTotalSummedYearlyConstantCosts.bind(itCoreCalculations),
  },
  {
    surveyId: 'businessTravel',
    label: 'Business Travel',
    getFootprint: businessTravelCoreCalculations.getSummedYearlyFootprint.bind(businessTravelCoreCalculations),
    getCost: businessTravelCoreCalculations.getTotalSummedYearlyConstantCosts.bind(businessTravelCoreCalculations),
    getTransformedFootprint:
      businessTravelCoreCalculations.getSummedYearlyFootprint.bind(businessTravelCoreCalculations),
    getTransformedCost:
      businessTravelCoreCalculations.getTotalSummedYearlyConstantCosts.bind(businessTravelCoreCalculations),
  },
];

export function useBudgetTableData(filledActionAnswersDf: IDataFrame<number, ActionAnswerBase>) {
  return useCalculation(
    (externalCalculationData) => {
      return categories.map((category) => {
        const { surveyId, label, getFootprint, getCost, getTransformedFootprint, getTransformedCost } = category;

        const footprint = getFootprint(externalCalculationData, externalCalculationData.surveyAnswers);
        const cost = getCost(externalCalculationData, externalCalculationData.surveyAnswers);
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
}

export default function BudgetTable(props: { actionPlan: ActionPlan }) {
  const { data, isLoading, error } = useBudgetTableData(new DataFrame(props.actionPlan.actionAnswers));

  return (
    <InlineErrorDisplay error={error}>
      {isLoading && <SkeletonText />}
      {data && <RawBudgetTable data={data} />}
      <Heading size="xs" pt="8">
        Legend
      </Heading>
      <Text pl="5" pt="2" fontSize="sm">
        Grayed out rows: No actions applied in this category.
      </Text>
    </InlineErrorDisplay>
  );
}

export function RawBudgetTable({
  data,
  isPdfView,
}: {
  data: {
    surveyId: string;
    label: string;
    footprint: number;
    cost: number;
    transformedFootprint: number;
    transformedCost: number;
  }[];
  isPdfView?: boolean;
}) {
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

  if (isPdfView) {
    return (
      <Pdf.View
        style={{
          flexDirection: 'column',
          width: '100%',
          marginVertical: 5,
        }}>
        <Pdf.View
          style={{
            flexDirection: 'row',
            width: '100%',
            fontWeight: 'bold',
            color: '#094D13',
            paddingVertical: 2,
          }}>
          <Pdf.View
            style={{
              flex: 1,
            }}>
            <Pdf.Text>Category</Pdf.Text>
          </Pdf.View>
          <Pdf.View
            style={{
              flex: 1,
              textAlign: 'right',
            }}>
            <Pdf.View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <Pdf.Text
                style={{
                  paddingBottom: 1,
                }}>
                CO
              </Pdf.Text>
              <Pdf.Text
                style={{
                  fontSize: 8,
                }}>
                2
              </Pdf.Text>
              <Pdf.Text
                style={{
                  paddingLeft: 5,
                  paddingBottom: 1,
                }}>
                / yr
              </Pdf.Text>
            </Pdf.View>
            <Pdf.Text
              style={{
                fontSize: 10,
                color: '#696969',
              }}>
              before actions
            </Pdf.Text>
          </Pdf.View>
          <Pdf.View
            style={{
              flex: 1,
              textAlign: 'right',
            }}>
            <Pdf.View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <Pdf.Text
                style={{
                  paddingBottom: 1,
                }}>
                CO
              </Pdf.Text>
              <Pdf.Text
                style={{
                  fontSize: 8,
                }}>
                2
              </Pdf.Text>
              <Pdf.Text
                style={{
                  paddingLeft: 5,
                  paddingBottom: 1,
                }}>
                / yr
              </Pdf.Text>
            </Pdf.View>
            <Pdf.Text
              style={{
                fontSize: 10,
                color: '#696969',
              }}>
              after actions
            </Pdf.Text>
          </Pdf.View>
          <Pdf.View
            style={{
              flex: 1,
              textAlign: 'right',
            }}>
            <Pdf.Text>Cost / yr</Pdf.Text>
            <Pdf.Text
              style={{
                fontSize: 10,
                color: '#696969',
              }}>
              before actions
            </Pdf.Text>
          </Pdf.View>
          <Pdf.View
            style={{
              flex: 1,
              textAlign: 'right',
            }}>
            <Pdf.Text>Cost / yr</Pdf.Text>
            <Pdf.Text
              style={{
                fontSize: 10,
                color: '#696969',
              }}>
              after actions
            </Pdf.Text>
          </Pdf.View>
        </Pdf.View>
        {data.map((category) => {
          const footprintDelta = category.footprint - category.transformedFootprint;
          const costDelta = category.cost - category.transformedCost;

          return (
            <Pdf.View
              key={category.surveyId}
              style={{
                borderTop: '1px solid #eee',
                flexDirection: 'row',
                width: '100%',
                paddingVertical: 2,
                opacity: footprintDelta === 0 && costDelta === 0 ? 0.6 : 1,
              }}>
              <Pdf.View
                style={{
                  flex: 1,
                }}>
                <Pdf.Text>{category.label}</Pdf.Text>
              </Pdf.View>
              <Pdf.View
                style={{
                  flex: 1,
                  textAlign: 'right',
                }}>
                <Pdf.Text>{formatFootprint(category.footprint)}</Pdf.Text>
              </Pdf.View>
              <Pdf.View
                style={{
                  flex: 1,
                  textAlign: 'right',
                }}>
                <Pdf.Text>{formatFootprint(category.transformedFootprint)}</Pdf.Text>
                <Pdf.Text
                  style={{
                    fontSize: 10,
                    color: '#696969',
                  }}>
                  {footprintDelta !== 0 ? (
                    <>
                      {formatFootprint(Math.abs(footprintDelta))} {footprintDelta > 0 ? 'saved' : 'wasted'}
                    </>
                  ) : null}
                </Pdf.Text>
              </Pdf.View>
              <Pdf.View
                style={{
                  flex: 1,
                  textAlign: 'right',
                }}>
                <Pdf.Text>{category.cost.toFixed(2)} €</Pdf.Text>
              </Pdf.View>
              <Pdf.View
                style={{
                  flex: 1,
                  textAlign: 'right',
                }}>
                <Pdf.Text>{category.transformedCost.toFixed(2)} €</Pdf.Text>
                <Pdf.Text
                  style={{
                    fontSize: 10,
                    color: '#696969',
                  }}>
                  {costDelta !== 0 ? (
                    <>
                      {Math.abs(costDelta).toFixed(2)} € {costDelta > 0 ? 'saved' : 'wasted'}
                    </>
                  ) : null}
                </Pdf.Text>
              </Pdf.View>
            </Pdf.View>
          );
        })}
        <Pdf.View
          style={{
            flexDirection: 'row',
            width: '100%',
            fontWeight: 'bold',
            borderTop: '1px solid #eee',
            color: '#094D13',
            paddingVertical: 2,
          }}>
          <Pdf.View
            style={{
              flex: 1,
            }}>
            <Pdf.Text>Total</Pdf.Text>
          </Pdf.View>
          <Pdf.View
            style={{
              flex: 1,
              textAlign: 'right',
            }}>
            <Pdf.Text>{formatFootprint(totalFootprint)}</Pdf.Text>
          </Pdf.View>
          <Pdf.View
            style={{
              flex: 1,
              textAlign: 'right',
            }}>
            <Pdf.Text>{formatFootprint(totalTransformedFootprint)}</Pdf.Text>
            <Pdf.Text
              style={{
                fontSize: 10,
                color: '#696969',
              }}>
              {totalFootprintDelta !== 0 ? (
                <>
                  {formatFootprint(Math.abs(totalFootprintDelta))} {totalFootprintDelta > 0 ? 'saved' : 'wasted'}
                </>
              ) : null}
            </Pdf.Text>
          </Pdf.View>
          <Pdf.View
            style={{
              flex: 1,
              textAlign: 'right',
            }}>
            <Pdf.Text>{totalCost.toFixed(2)} €</Pdf.Text>
          </Pdf.View>
          <Pdf.View
            style={{
              flex: 1,
              textAlign: 'right',
            }}>
            <Pdf.Text>{totalTransformedCost.toFixed(2)} €</Pdf.Text>
            <Pdf.Text
              style={{
                fontSize: 10,
                color: '#696969',
              }}>
              {totalCostDelta !== 0 ? (
                <>
                  {Math.abs(totalCostDelta).toFixed(2)} € {totalCostDelta > 0 ? 'saved' : 'wasted'}
                </>
              ) : null}
            </Pdf.Text>
          </Pdf.View>
        </Pdf.View>
      </Pdf.View>
    );
  }

  return (
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
                      {Math.abs(costDelta).toFixed(2)} € {costDelta > 0 ? 'saved' : 'wasted'}
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
  );
}

function TdWithHelpText({ children, helpText, ...props }: TableCellProps & { helpText?: ReactNode }) {
  return (
    <Td {...props}>
      <VStack align={props.isNumeric ? 'flex-end' : undefined} spacing="0">
        <Box minH="20px">{children}</Box>
        <Box minH="20px">
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
        <Box minH="20px">{children}</Box>
        <Box minH="20px">
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
