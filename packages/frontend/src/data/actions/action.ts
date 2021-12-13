import { ComponentType } from 'react';
import { FormSchema } from '../../form-engine/formSchema';
import { KnownSurveyId } from '../surveys/survey';
import { ChangeBulbsActionAnswerValue, ChangeBulbsActionDetailsAnswerValue } from './illumination/changeBulbsAction';
import {
  ChangeRuntimeActionAnswerValue,
  ChangeRuntimeActionDetailsAnswerValue,
} from './illumination/changeRuntimeAction';
import { illuminationActionsCategory } from './illumination/illuminationActions';
import { heatingActionsCategory } from './heating/heatingActions';
import { electricityActionsCategory } from './electricity/electricityActions';
import { itActions } from './it/itActions';
import { businessTravelActions } from './businessTravel/businessTravelActions';
import { SurveyAnswer } from '../../api/surveyAnswer';

/**
 * An action category essentially is a group of various actions, enhanced with additional
 * properties which are used by the UI to render components.
 */
export interface ActionCategory<T extends object = any> {
  /**
   * A unique identifier of the action category.
   * Should be human-readable.
   */
  id: string;
  /**
   * The name of the category.
   */
  name: string;
  /**
   * An optional icon.
   */
  icon?: ComponentType;
  /**
   * The encapsulated actions.
   */
  actions: Array<Action<T>>;
}

/**
 * Defines an action as it is rendered by the frontend.
 * Actions generally are used to render two forms:
 * 1) A short inline form for quickly changing between dashboard views (e.g. switching between bulbs).
 * 2) An optional longer form which can, for example, be rendered in a popup.
 *
 * The two forms produce answers (-> an "action answer") which can be processed by the frontend
 * and sent to the backend.
 */
export interface Action<T extends object = any> {
  /**
   * A unique identifier of the action.
   * Should be human readable.
   */
  id: string;
  /**
   * A name/title for the action. Should be short, e.g. "Change bulbs".
   */
  name: string;
  /**
   * An optional description of the action, giving details about what it does
   */
  description?: string;
  /**
   * An optional icon.
   */
  icon?: ComponentType;
  /**
   * The kind of surveys that this action can be applied for.
   */
  forSurvey: KnownSurveyId;
  /**
   * A form schema for fields which are required by the action.
   * Typically displayed inline.
   */
  // schema: FormSchema;
  getSchema: (surveyAnswer?: SurveyAnswer<T>) => FormSchema;

  /**
   * If available, declares a form schema which can be used for collecting additional information
   * for the action.
   * (This form schema is typically displayed in a "Fill Details") dialog.
   */
  detailsSchema?: FormSchema;
}

/**
 * Groups the answers of an action inside of a single object.
 * Basically meant as a container type which contains the different form engine results.
 */
export interface ActionAnswerValues<
  TValue extends object = object,
  TDetailsValue extends object | undefined = object | undefined,
> {
  value: TValue;
  detailsValue?: TDetailsValue;
}

export const knownActionCategories = [
  illuminationActionsCategory,
  heatingActionsCategory,
  electricityActionsCategory,
  itActions,
  businessTravelActions,
];

export const knownActions = knownActionCategories.flatMap<Action>((category) => category.actions);

export type ActionsToActionAnswerMap = {
  changeBulbs: ActionAnswerValues<ChangeBulbsActionAnswerValue, ChangeBulbsActionDetailsAnswerValue>;
  changeRuntime: ActionAnswerValues<ChangeRuntimeActionAnswerValue, ChangeRuntimeActionDetailsAnswerValue>;
};

export type KnownActionId = keyof ActionsToActionAnswerMap;
