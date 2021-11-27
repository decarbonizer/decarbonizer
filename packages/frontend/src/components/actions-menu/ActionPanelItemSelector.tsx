import { SurveyAnswer } from '../../api/surveyAnswer';
import ActionPanelIlluminationItem from './ActionPanelIlluminationItem';

export interface ActionPanelItemSelectorProps {
  surveyId: string;
  elements: Array<SurveyAnswer>;
  description?: string;
  chosenAction: string;
  onChangeChosenAction: (value: string) => void;
}

export default function ActionPanelItemSelector({
  surveyId,
  elements,
  description,
  chosenAction,
  onChangeChosenAction,
}: ActionPanelItemSelectorProps) {
  switch (surveyId) {
    case '00000000-0000-0000-0000-000000000000':
      return (
        <ActionPanelIlluminationItem
          elements={elements.map((e) => e.value) as any}
          description={description}
          chosenAction={chosenAction}
          onChangeChosenAction={onChangeChosenAction}
        />
      );
    default:
      throw new Error('Unkown SurveyId');
  }
}
