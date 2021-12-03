import { ComponentType } from 'react';
import { FormSchema } from '../../form-engine/formSchema';
import { KnownSurveyId } from '../surveys/survey';
import { illuminationActionsCategory } from './illumination/illuminationActions';

export interface ActionCategory {
  name: string;
  icon?: ComponentType;
  forSurvey: KnownSurveyId;
  actions: Array<Action>;
}

export interface Action {
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
  inlineSchema: FormSchema;
  /**
   * If available, declares a form schema which can be used for collecting additional information
   * for the action.
   * (This form schema is typically displayed in a "Fill Details") dialog.
   */
  optionalValuesSchema?: FormSchema;
}

export const knownActionCategories = [illuminationActionsCategory];
