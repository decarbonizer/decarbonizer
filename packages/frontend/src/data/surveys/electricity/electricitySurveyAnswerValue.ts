export interface ElectricitySurveyAnswerValue {
  realEstateName: string;
  electricityKind: 'windPower' | 'hydroPower' | 'conSolarPower' | 'solarPV' | 'geothermal' | 'biomass' | 'gas' | 'coal';
}
