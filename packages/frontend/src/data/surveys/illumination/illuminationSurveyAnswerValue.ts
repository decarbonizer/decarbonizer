export interface IlluminationSurveyAnswerValue {
  realEstateName: string;
  lampCount: number;
  bulbType: string;
  isIlluminantExchangeable: boolean;
  illuminationTriggerMode: 'automatically' | 'manually';
  illuminationTriggerEvent?: 'brightness' | 'timeTriggered' | 'motionTriggered';
  illuminationSwitchOffMode?: 'automaticTimeout' | 'manuallySwitchedOff';
  illuminationSwitchOnMode: 'always' | 'onDemand';
  avgIlluminationPerDay: number;
}
