import { IlluminationSurveyAnswerValue } from '../../data/surveys/illumination/illuminationSurveyAnswerValue';
import { assert } from '../../utils/assert';

export function getIlluminationRuntimePerYear(
  {
    switchOnMode,
    avgRuntimePerDay,
    avgRuntimePerYear = 365,
    motionTriggerTimeout,
    motionTriggerAvgTriggersPerDay,
  }: IlluminationSurveyAnswerValue,
  fallback = 6,
) {
  if (switchOnMode === 'always') {
    // Using avgRuntimePerDay with fallback because it may be set by transformations.
    return (avgRuntimePerDay ?? 24) * avgRuntimePerYear;
  }

  if (switchOnMode === 'manually' || switchOnMode === 'timeTriggered' || switchOnMode === 'brightnessTriggered') {
    assert(avgRuntimePerDay !== undefined);
    assert(avgRuntimePerYear !== undefined);
    return avgRuntimePerDay * avgRuntimePerYear;
  }

  if (switchOnMode === 'motionTriggered') {
    assert(motionTriggerTimeout !== undefined);
    assert(motionTriggerAvgTriggersPerDay !== undefined);
    return motionTriggerTimeout * motionTriggerAvgTriggersPerDay;
  }

  console.warn('Could not determine daily runtime for illumination survey answer. Using fallback value.');
  return fallback;
}
