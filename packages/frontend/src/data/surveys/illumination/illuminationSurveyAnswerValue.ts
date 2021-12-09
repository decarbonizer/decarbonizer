export interface IlluminationSurveyAnswerValue {
  realEstateName: string;
  initialSurvey: boolean;
  lampCount: number;
  bulbType: string;
  isIlluminantExchangeable: boolean;
  illuminationTriggerMode: 'automatically' | 'manually';
  illuminationTriggerEvent?: 'brightness' | 'timeTriggered' | 'motionTriggered';
  illuminationSwitchOffMode?: 'automaticTimeout' | 'manuallySwitchedOff';
  illuminationSwitchOnMode: 'always' | 'onDemand';
  avgIlluminationPerDay: number;
  avgIlluminationPerYear: number;
}
