export interface HeatingSurveyAnswerValue {
  realEstateName: string;
  radiatorKind:
    | 'solarThermal'
    | 'groundSourceHeatPump'
    | 'airSourceHeatPump'
    | 'directElectricHeating'
    | 'gasBoiler'
    | 'oilBoiler';
  roomTemperature: number;
  smartThermostats: boolean;
}
