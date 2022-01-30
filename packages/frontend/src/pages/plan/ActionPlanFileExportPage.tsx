import { Document, Font, Page, PDFViewer, Text, View } from '@react-pdf/renderer';
import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { ActionPlanFileExportPageParams } from '../../routes';
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

// curl https://fonts.googleapis.com/css2\?family\=EB+Garamond:ital,wght@0,400\;0,700\;1,400
Font.register({
  family: 'Font',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/ebgaramond/v19/~ChoKC0VCIEdhcmFtb25kOgsI9NCduwcVAADIQyAA.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/ebgaramond/v19/~ChwKC0VCIEdhcmFtb25kEAI6Cwj00J27BxUAAMhDIAA=.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    {
      src: 'https://fonts.gstatic.com/s/ebgaramond/v19/~ChoKC0VCIEdhcmFtb25kOgsI9NCduwcVAAAvRCAA.ttf',
      fontWeight: 'bold',
    },
  ],
});

export default function ActionPlanFileExportPage() {
  const { realEstateId, actionPlanId } = useParams<ActionPlanFileExportPageParams>();
  const { data: realEstate } = useGetRealEstateQuery({ id: realEstateId });
  const { data: surveyAnswers } = useGetAllSurveyAnswersForRealEstateQuery({ realEstateId: realEstateId });
  const { data: actionPlan, isFetching: isFetchingActionPlan } = useGetActionPlanQuery({ id: actionPlanId });
  const { providers } = useFormEngineChoiceOptionProviders(realEstateId);

  const { data: budgetTableData, isLoading: isLoadingBudgetTableData } = useBudgetTableData(
    new DataFrame(actionPlan?.actionAnswers ?? []),
  );

  if (isFetchingActionPlan || !actionPlan || isLoadingBudgetTableData || !budgetTableData || !realEstate) {
    return null;
  }

  return (
    <Box flexGrow={1} display="flex">
      <PDFViewer width="100%">
        <Document>
          <Page
            size="A4"
            style={{
              fontFamily: 'Font',
              fontSize: 16,
              paddingTop: 65,
              paddingBottom: 65,
              paddingHorizontal: 35,
            }}>
            <View>
              <View style={{ textAlign: 'center', marginBottom: '45px' }}>
                <Text style={{ fontSize: '25px' }}>{actionPlan.name}</Text>
              </View>

              <Text style={{ marginVertical: 3 }}>
                Location: {realEstate.cityName}
                <Text style={{ fontStyle: 'italic', fontSize: 14 }}>
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
                <Text style={{ color: '#094D13', fontWeight: 'bold' }}>Budget table</Text>
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
      <Text style={{ color: '#094D13', fontWeight: 'bold' }}>
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
