import { IlluminationSurveyAnswerValue } from '../data/surveys/illumination/illuminationSurveyAnswerValue';
import { KnownSurveyId, SurveyToSurveyAnswerMap } from '../data/surveys/survey';
import { FilledActionAnswers } from '../pages/dashboard/action-panel/actionPanelContext';
import { ApiObject, ApiObjectCreate, ApiObjectUpdate } from './apiObject';
import { Bulb } from './bulb';
import { RealEstate } from './realEstate';

export interface SurveyAnswer<T = object> extends ApiObject {
  realEstateId: string;
  surveyId: KnownSurveyId;
  value: T;
}

export interface SurveyAnswerCreate extends ApiObjectCreate {
  value: object;
}

export interface SurveyAnswerUpdate extends ApiObjectUpdate {
  value?: object;
}

/**
 * Evaluates whether the given survey answer relates to a known survey.
 * @param surveyType The type of survey to check for.
 * @param answer The survey answer.
 * @returns `true` if the survey answer's value has the shape of the known survey; `false` if not.
 */
export function isSurveyAnswerType<SurveyId extends KnownSurveyId>(
  surveyType: KnownSurveyId,
  answer: SurveyAnswer,
): answer is SurveyAnswer<SurveyToSurveyAnswerMap[SurveyId]> {
  return answer.surveyId === surveyType;
}

//Footprint of a real estate
export interface RealEstateFootprintCalculation {
  name: string;
  footprint: number;
}

export interface IlluminationCalculation {
  typeOfBulb: string;
  amountOfIlluminants: number;
  costs: number;
  overallFootprint: number;
}

export interface Calculation {
  costs: number;
  footprint: number;
  year: number;
}

export interface MaintenanceCosts {
  costsForBulbsReplacement: number;
  costsForBulbs: number;
  year: number;
}

export interface ComparisonOfCalculations {
  year: number;
  oldCosts: number;
  oldFootprint: number;
  newCosts: number;
  newFootprint: number;
}

/**
 * Prevents using wrong value for average illumination per day in further calculations.
 * @param answer illumination survey answer.
 * @returns formatted illumination survey answer.
 */
function formatIlluminationSurveyAnswer(
  answer: SurveyAnswer<IlluminationSurveyAnswerValue>,
): SurveyAnswer<IlluminationSurveyAnswerValue> {
  if (answer.value.illuminationSwitchOnMode == 'always') {
    const newObject = Object.assign({}, answer);
    newObject.value = { ...answer.value, avgIlluminationPerDay: 1 };
    return newObject;
  } else {
    return answer;
  }
}

function applyActions(answers: Array<SurveyAnswer>, actions: FilledActionAnswers): Array<SurveyAnswer> {
  return answers.map((answer) => {
    if (isSurveyAnswerType('illumination', answer)) {
      if (actions.changeBulbs || actions.changeRuntime) {
        return changeIllumination(answer, actions);
      } else {
        return answer;
      }
    } else {
      return answer;
    }
  });
}

/**
 * Evaluates carbon footprint of one real estate
 * @param answers All survey answers.
 * @param bulbs All bulbs.
 * @param years Timeframe to calculate footprint.
 * @returns overall carbon footprint.
 */
export function calculateOverallFootprintAndMaintenance(
  answers: Array<SurveyAnswer>,
  bulbs: Array<Bulb>,
  years: number,
): { calculations: Array<Calculation>; maintenance: Array<MaintenanceCosts> } {
  const calculations: Array<Calculation> = [];
  const maintenance: Array<MaintenanceCosts> = [];
  for (let i = 1; i < years + 1; i++) {
    const calculationForSpecificYear = answers.reduce<{ calculation: Calculation; maintenance: MaintenanceCosts }>(
      (acc, answer) => {
        const result = calculateFootprintDependingOnType(answer, bulbs, i);
        acc.calculation.costs += result.calculation.costs;
        acc.calculation.footprint += result.calculation.footprint;
        acc.maintenance.costsForBulbs += result.maintenance.costsForBulbs;
        acc.maintenance.costsForBulbsReplacement += result.maintenance.costsForBulbsReplacement;
        return acc;
      },
      {
        calculation: { costs: 0, footprint: 0, year: i },
        maintenance: { costsForBulbsReplacement: 0, costsForBulbs: 0, year: i },
      },
    );
    calculations.push(calculationForSpecificYear.calculation);
    maintenance.push(calculationForSpecificYear.maintenance);
  }

  return { calculations: calculations, maintenance: maintenance };
}

export function calculateFootprintPerRealEstate(
  answers: Array<SurveyAnswer>,
  bulbs: Array<Bulb>,
  realEstates: Array<RealEstate>,
): Array<RealEstateFootprintCalculation> {
  return realEstates.map((realEstate) => {
    const realEstateAnswers = answers.filter((answer) => answer.realEstateId == realEstate._id);
    const calculation = calculateOverallFootprintAndMaintenance(realEstateAnswers, bulbs, 1).calculations; //footprint for one year
    return { name: realEstate.cityName, footprint: +calculation[0].footprint.toFixed(1) };
  });
}

function calculateIlluminationFootprint(
  answer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  bulbs: Array<Bulb>,
  year: number,
): { calculation: Calculation; maintenance: MaintenanceCosts } {
  const germanyEF = 0.624; //standard emission factor for Germany
  const electricityCostPerKWH = 0.32; // electricity cost per kWh in Germany
  const usedBulb = bulbs.find((bulb) => bulb._id == answer.value.bulbType);
  const formattedAnswer = formatIlluminationSurveyAnswer(answer);

  if (usedBulb !== null) {
    //calculate how many times bulbs need to be changed
    const illuminationPerYear =
      formattedAnswer.value.avgIlluminationPerDay * 24 * formattedAnswer.value.avgIlluminationPerYear;
    const footprint =
      usedBulb!.productionKwh * illuminationPerYear * germanyEF * formattedAnswer.value.lampCount * year;

    const costs = usedBulb!.name.includes('LED')
      ? calculateCostsForLED(usedBulb!.costInEuro, formattedAnswer.value.lampCount, year)
      : calculateCostsForBulb(usedBulb!.costInEuro, formattedAnswer.value.lampCount, year);
    const totalElectricityCosts = usedBulb!.productionKwh * illuminationPerYear * electricityCostPerKWH;
    return {
      calculation: { costs: costs.costs + totalElectricityCosts, footprint: footprint, year: year },
      maintenance: costs.maintenance,
    };
  } else {
    return {
      calculation: { costs: 0, footprint: 0, year: year },
      maintenance: { costsForBulbs: 0, costsForBulbsReplacement: 0, year: year },
    };
  }
}
export function changeIllumination(
  answer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  actions: FilledActionAnswers,
): SurveyAnswer<IlluminationSurveyAnswerValue> {
  let updatedSurvey = answer;
  if (actions.changeBulbs) {
    const newBulb = actions.changeBulbs!.values.value.newBulb;
    updatedSurvey = changeBulb(updatedSurvey, newBulb);
  }
  if (actions.changeRuntime && actions.changeRuntime.values.value.newRuntime != undefined) {
    const newRuntime = actions.changeRuntime!.values.value.newRuntime;
    updatedSurvey = changeRuntime(updatedSurvey, newRuntime);
  }
  return updatedSurvey;
}

function changeBulb(
  answer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  bulbId: string,
): SurveyAnswer<IlluminationSurveyAnswerValue> {
  if (answer.value.isIlluminantExchangeable && answer.value.bulbType != bulbId) {
    const newObject = Object.assign({}, answer);
    //update only those bulbs that can be changed & need to be changed
    newObject.value = { ...answer.value, bulbType: bulbId }; //change bulbId
    return newObject;
  } else {
    return answer;
  }
}

function changeRuntime(
  answer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  newRuntime: number,
): SurveyAnswer<IlluminationSurveyAnswerValue> {
  const newObject = Object.assign({}, answer);
  newObject.value = { ...answer.value, avgIlluminationPerDay: newRuntime, illuminationSwitchOnMode: 'onDemand' };
  return newObject;
}

/**
 * Change bulbs for illumination surveys where illumination is exchangable and bulb is not already of a needed type
 * @param answers All survey answers.
 * @param bulbs All bulbs.
 * @param bulbId Bulb to exchange illuminaion with.
 * @returns overall carbon footprint.
 */

export function recalculateFootprintAndMaintenance(
  answers: SurveyAnswer<object>[],
  actions: FilledActionAnswers,
  bulbs: Bulb[],
): {
  newIllumination: IlluminationCalculation | undefined;
  oldCalculation: { calculations: Calculation[]; maintenance: MaintenanceCosts[] };
  newCalculation: { calculations: Calculation[]; maintenance: MaintenanceCosts[] };
} {
  const updatedAnswers: Array<SurveyAnswer> = applyActions(answers, actions); //update answers if there are any selected actions

  const costAndFootprintBeforeChange: { calculations: Calculation[]; maintenance: MaintenanceCosts[] } =
    calculateOverallFootprintAndMaintenance(answers, bulbs, 10);
  const newIllumination: IlluminationCalculation | undefined = actions.changeBulbs
    ? calculateIllumitationData(updatedAnswers, bulbs, actions.changeBulbs.values.value.newBulb)
    : undefined;
  const costAndFootprintAfterChange: { calculations: Calculation[]; maintenance: MaintenanceCosts[] } =
    calculateOverallFootprintAndMaintenance(updatedAnswers, bulbs, 10);

  return {
    newIllumination: newIllumination,
    oldCalculation: costAndFootprintBeforeChange,
    newCalculation: costAndFootprintAfterChange,
  };
}

function calculateFootprintDependingOnType(
  answer: SurveyAnswer,
  bulbs: Array<Bulb>,
  year: number,
): { calculation: Calculation; maintenance: MaintenanceCosts } {
  if (isSurveyAnswerType('illumination', answer)) {
    return calculateIlluminationFootprint(answer, bulbs, year);
  } else {
    //TODO define cases for other survey types
    return {
      calculation: { costs: 0, footprint: 0, year: year },
      maintenance: { costsForBulbs: 0, costsForBulbsReplacement: 0, year: year },
    };
  }
}

export function calculateIllumitationData(
  answers: Array<SurveyAnswer>,
  bulbs: Array<Bulb>,
  bulbId: string,
): IlluminationCalculation {
  const usedBulb = bulbs.find((bulb) => bulb._id == bulbId);
  if (usedBulb) {
    const bulbName = usedBulb.name;
    return answers.reduce<IlluminationCalculation>(
      (acc, answer) => {
        if (isSurveyAnswerType('illumination', answer)) {
          const generalCalculation = calculateIlluminationFootprint(answer, bulbs, 1);
          acc.amountOfIlluminants += answer.value.lampCount;
          acc.costs += generalCalculation.calculation.costs;
          acc.overallFootprint += generalCalculation.calculation.footprint;
          return acc;
        }
        return acc;
      },
      { typeOfBulb: bulbName, amountOfIlluminants: 0, costs: 0, overallFootprint: 0 },
    );
  } else {
    return { typeOfBulb: bulbId, amountOfIlluminants: 0, costs: 0, overallFootprint: 0 };
  }
}

function calculateCostsForLED(
  costInEuro: number,
  lampCount: number,
  year: number,
): { costs: number; maintenance: MaintenanceCosts } {
  const avgElectritianWagePerHour = 12.4; //average electrician wage per hour
  const avgElectritianWagePerBulb = avgElectritianWagePerHour / 6; // assume that it takes 10 min to change a bulb

  //calculate maintenance costs only when LED need to be changed
  const costForNewBulbs = year % 4 == 0 || year == 1 ? costInEuro * lampCount : 0;
  const costForBulbReplacement = year % 4 == 0 || year == 1 ? avgElectritianWagePerBulb * lampCount : 0;
  const maintenance: MaintenanceCosts = {
    costsForBulbsReplacement: costForBulbReplacement,
    costsForBulbs: costForNewBulbs,
    year: year,
  };

  const overallCosts = (costInEuro * lampCount + maintenance.costsForBulbsReplacement) * (Math.floor(year / 4) + 1);

  return { costs: overallCosts, maintenance: maintenance };
}
function calculateCostsForBulb(costInEuro: number, lampCount: number, year: number) {
  const avgElectritianWagePerHour = 12.4; //average electrician wage per hour
  const avgElectritianWagePerBulb = avgElectritianWagePerHour / 6; // assume that it takes 10 min to change a bulb
  const maintenance: MaintenanceCosts = {
    costsForBulbsReplacement: avgElectritianWagePerBulb * lampCount * 4,
    costsForBulbs: costInEuro * lampCount * 4 * year,
    year: year,
  };
  const overallCosts = maintenance.costsForBulbs + maintenance.costsForBulbsReplacement;

  return { costs: overallCosts, maintenance: maintenance };
}
