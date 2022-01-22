import { Document, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { RealEstateDashboardPageParams } from '../../routes';
import {
  useGetActionPlanQuery,
  useGetAllSurveyAnswersForRealEstateQuery,
  useGetRealEstateQuery,
} from '../../store/api';
import { ActionAnswerBase } from '../../api/actionAnswer';
import { useFormEngineChoiceOptionProviders } from '../../form-engine/useFormEngineChoiceProviders';
import { knownActionCategories, knownActions } from '../../data/actions/action';
import { useActionSchema } from '../../data/actions/useActionSchema';
import FormEngine from '../../form-engine/FormEngine';
import { RawBudgetTable, useBudgetTableData } from '../budget/components/BudgetTable';
import { DataFrame } from 'data-forge';

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    paddingTop: 65,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default function ActionPlanFileExportPage() {
  const { realEstateId, actionPlanId } = useParams<RealEstateDashboardPageParams>();
  const { data: realEstate } = useGetRealEstateQuery({ id: realEstateId });
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { data: actionPlan, isFetching: isFetchingActionPlan } = useGetActionPlanQuery({ id: actionPlanId! });
  const { providers } = useFormEngineChoiceOptionProviders(realEstateId);

  const filledActionAnswers =
    actionPlan?.actionAnswers.reduce((acc, actionAnswer) => ({ ...acc, [actionAnswer.actionId]: actionAnswer }), {}) ??
    {};
  const filledAnswersDf = new DataFrame(Object.values(filledActionAnswers).filter(Boolean));
  const { data: budgetTableData, isLoading: isLoadingBudgetTableData } = useBudgetTableData(filledAnswersDf);

  if (isFetchingActionPlan || !actionPlan || isLoadingBudgetTableData || !budgetTableData || !realEstate) {
    return null;
  }

  return (
    <Box flexGrow={1} display={'flex'}>
      <PDFViewer width={'100%'}>
        <Document>
          <Page size="A4" style={styles.page}>
            <View>
              <View style={{ textAlign: 'center', marginBottom: '45px' }}>
                <Text style={{ fontSize: '25px' }}>{actionPlan.name}</Text>
              </View>

              <Text style={{ marginVertical: 3 }}>
                Location: {realEstate.cityName}
                <Text style={{ fontFamily: 'Times-Italic', fontSize: 16 }}>
                  {realEstate.description ? ` (${realEstate.description})` : null}
                </Text>
              </Text>
              <Text style={{ marginVertical: 3 }}>
                Planned duration: {new Date(actionPlan.startDate).toLocaleDateString()} -{' '}
                {new Date(actionPlan.endDate).toLocaleDateString()}{' '}
              </Text>
              <Text style={{ marginVertical: 3 }}>Status: {actionPlan.status}</Text>

              {actionPlan.actionAnswers.map((actionAnswer) => (
                <ActionAnswer
                  key={actionAnswer.actionId}
                  actionId={actionAnswer.actionId}
                  actionAnswer={actionAnswer}
                  surveyAnswers={surveyAnswers}
                  providers={providers}
                />
              ))}

              <View
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                }}
                wrap={false}>
                <Text style={{ color: '#094D13', fontFamily: 'Times-Bold' }}>Budget table</Text>
                <RawBudgetTable data={budgetTableData} isPdfView />
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </Box>
  );
}

interface ActionAnswerProps {
  actionId: string;
  actionAnswer: ActionAnswerBase;
  surveyAnswers: any;
  providers: any;
}

function ActionAnswer({ actionId, actionAnswer, surveyAnswers, providers }: ActionAnswerProps) {
  const currentAction = knownActions.find((action) => actionId === action.id);
  const actionCategory = knownActionCategories.find((category) =>
    category.actions.some((action) => action === currentAction),
  );
  const schema = useActionSchema(currentAction, surveyAnswers);

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ color: '#094D13', fontFamily: 'Times-Bold' }}>
        {`${actionCategory?.name}: ${currentAction?.name}` ?? actionId}
      </Text>
      <FormEngine
        value={actionAnswer.values.value}
        isPdfView
        isViewOnly
        schema={schema}
        page={1}
        choiceOptionProviders={providers}
        ruleEvaluationResults={{}}
        validationErrors={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onValueChanged={() => {}}
      />
      {actionAnswer.values.detailsValue && (
        <FormEngine
          value={actionAnswer.values.detailsValue}
          isPdfView
          isViewOnly
          schema={currentAction?.detailsSchema ?? { pages: [] }}
          page={1}
          choiceOptionProviders={providers}
          ruleEvaluationResults={{}}
          validationErrors={{}}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onValueChanged={() => {}}
        />
      )}
    </View>
  );
}
