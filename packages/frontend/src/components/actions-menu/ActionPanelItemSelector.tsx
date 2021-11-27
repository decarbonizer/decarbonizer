import { SurveyAnswer } from '../../api/surveyAnswer';
import ActionPanelIlluminationItem from './ActionPanelIlluminationItem';

export interface ActionPanelItemSelectorProps {
  surveyId: string;
  elements: Array<SurveyAnswer>;
  description?: string;
}

export default function ActionPanelItemSelector({ surveyId, elements, description }: ActionPanelItemSelectorProps) {
  switch (surveyId) {
    case 'illumination':
      return <ActionPanelIlluminationItem elements={elements.map((e) => e.value) as any} description={description} />;
    default:
      throw new Error('Unkown SurveyId');
  }
}
