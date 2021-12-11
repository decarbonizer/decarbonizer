export interface ElectricitySurveyAnswerValue {
  realEstateName: string;
  radiatorKind: 'windPower' | 'hydroPower' | 'conSolarPower' | 'solarPV' | 'geothermal' | 'biomass' | 'gas' | 'coal';
}
