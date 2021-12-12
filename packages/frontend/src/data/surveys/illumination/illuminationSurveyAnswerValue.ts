export interface IlluminationSurveyAnswerValue {
  realEstateName: string;
  isInitialSurvey: boolean;
  lampCount: number;
  bulbType: string;
  isIlluminantExchangeable: boolean;
  switchOnMode: 'always' | 'manually' | 'motionTriggered' | 'timeTriggered' | 'brightnessTriggered';
  motionTriggerTimeout?: number;
  motionTriggerAvgTriggersPerDay?: number;
  avgRuntimePerDay?: number;
  avgRuntimePerYear?: number;
}
