import { ChoiceOption, FormSchemaElementRuleEffect } from './formSchema';

/**
 * Allows users of the form engine to register external choice options under a specific key
 * (which can be referenced by a form schema).
 *
 * Example:
 * ```ts
 * // Form schemas can reference the below provider via the 'myProvider' key.
 * const providers: FormEngineChoiceOptionProviders = {
 *   myProvider: [
 *     {
 *       value: 'foo',
 *       display: 'Bar',
 *     },
 *   ]
 * };
 * ```
 */
export type FormEngineChoiceOptionProviders = Record<string, Array<ChoiceOption>>;

/**
 * The result of evaluating a form schema element's rules.
 * A record which describes, for each possible rule effect, whether that effect applies.
 */
export type FormEngineRuleEvaluationResult = Record<FormSchemaElementRuleEffect, boolean>;

/**
 * The value that the form engine produces.
 * The record's keys are the form schema element's IDs.
 * The corresponding values are the values entered by the user.
 */
export type FormEngineValue = Record<string, any>;

/**
 * The current rule evaluations which apply to certain form schema elements.
 * The record's keys are the form schema element's IDs.
 * The corresponding values are the evaluated rule results.
 */
export type FormEngineRuleEvaluationResults = Record<string, FormEngineRuleEvaluationResult>;

/**
 * The current validation errors which apply to certain form schema elements.
 * The record's keys are the form schema element's IDs.
 * The corresponding values are the validation errors.
 */
export type FormEngineValidationErrors = Record<string, Array<string>>;
