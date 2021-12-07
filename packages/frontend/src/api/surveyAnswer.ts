import { IlluminationSurveyAnswerValue } from '../data/surveys/illumination/illuminationSurveyAnswerValue';
import { KnownSurveyId, SurveyToSurveyAnswerMap } from '../data/surveys/survey';
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
  realEstateName: string;
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
    newObject.value = { ...answer.value, avgIlluminationPerDay: 24 };
    return newObject;
  } else {
    return answer;
  }
}

/**
 * Evaluates carbon footprint of one real estate
 * @param answers All survey answers.
 * @param bulbs All bulbs.
 * @returns overall carbon footprint.
 */
export function calculateOverallFootprint(
  answers: Array<SurveyAnswer>,
  bulbs: Array<Bulb>,
  years: number,
): Array<Calculation> {
  const calculations: Array<Calculation> = [];
  for (let i = 1; i < years + 1; i++) {
    const calculationForSpecificYear = answers.reduce<Calculation>(
      (acc, answer) => {
        const calculation = calculateFootprintDependingOnType(answer, bulbs, i);
        acc.costs += calculation.costs;
        acc.footprint += calculation.footprint;
        return acc;
      },
      { costs: 0, footprint: 0, year: i },
    );
    calculations.push(calculationForSpecificYear);
  }

  return calculations;
}

export function calculateFootprintPerRealEstate(
  answers: Array<SurveyAnswer>,
  bulbs: Array<Bulb>,
  realEstates: Array<RealEstate>,
): Array<RealEstateFootprintCalculation> {
  const result: Array<RealEstateFootprintCalculation> = [];
  for (let i = 0; i < realEstates.length; i++) {
    const realEstateAnswers = answers.filter((answer) => answer.realEstateId == realEstates[i]._id);
    const footprintValue = calculateOverallFootprint(realEstateAnswers, bulbs, 1); //footprint for one year
    result.push({ realEstateName: realEstates[i].cityName, footprint: +footprintValue[0].footprint.toFixed(1) });
  }

  return result;
}

function calculateIlluminationFootprint(
  answer: SurveyAnswer<IlluminationSurveyAnswerValue>,
  bulbs: Array<Bulb>,
  year: number,
): Calculation {
  const germanyEF = 0.624; //standard emission factor for Germany
  const usedBulb = bulbs.find((bulb) => bulb._id == answer.value.bulbType);
  const formattedAnswer = formatIlluminationSurveyAnswer(answer);

  if (usedBulb !== null) {
    //calculate how many times bulbs need to be changed
    const illuminationPerYear =
      formattedAnswer.value.avgIlluminationPerDay * 24 * formattedAnswer.value.avgIlluminationPerYear;
    const footprint =
      usedBulb!.productionKwh * illuminationPerYear * germanyEF + formattedAnswer.value.lampCount * year;
    const costs = usedBulb!.name.includes('LED')
      ? calculateCostsForLED(usedBulb!.costInEuro, formattedAnswer.value.lampCount, year)
      : calculateCostsForBulb(usedBulb!.costInEuro, formattedAnswer.value.lampCount, year);
    return { costs: costs, footprint: footprint, year: year };
  } else {
    return { costs: 0, footprint: 0, year: year };
  }
}

export function changeBulbs(
  answers: SurveyAnswer<object>[],
  bulbs: Bulb[],
  bulbId: string,
): { newIllumination: IlluminationCalculation; oldCalculation: Calculation[]; newCalculation: Calculation[] } {
  const allAnswers: SurveyAnswer<object>[] = [];

  const updatedAnswers = answers.filter((answer) => {
    if (isSurveyAnswerType('illumination', answer)) {
      if (answer.value.isIlluminantExchangeable) {
        //update only those bulbs that can be changed
        if (answer.value.bulbType != bulbId) {
          //update only those bulbs that need to be changed
          const newObject = Object.assign({}, answer);
          newObject.value = { ...answer.value, bulbType: bulbId }; //change bulbId
          allAnswers.push(newObject);
          return newObject;
        } else {
          allAnswers.push(answer);
        }
      } else {
        allAnswers.push(answer);
      }
    }
  });
  const costAndFootprintBeforeChange: Calculation[] = calculateOverallFootprint(answers, bulbs, 10);
  const newIllumination: IlluminationCalculation = calculateIllumitationData(updatedAnswers, bulbs, bulbId);
  const costAndFootprintAfterChange: Calculation[] = calculateOverallFootprint(allAnswers, bulbs, 10);

  return {
    newIllumination: newIllumination,
    oldCalculation: costAndFootprintBeforeChange,
    newCalculation: costAndFootprintAfterChange,
  };
}

function calculateFootprintDependingOnType(answer: SurveyAnswer, bulbs: Array<Bulb>, year: number): Calculation {
  if (isSurveyAnswerType('illumination', answer)) {
    return calculateIlluminationFootprint(answer, bulbs, year);
  } else {
    //TODO define cases for other survey types
    return { costs: 0, footprint: 0, year: year };
  }
}

export function calculateIllumitationData(
  answers: Array<SurveyAnswer>,
  bulbs: Array<Bulb>,
  bulbId: string,
): IlluminationCalculation {
  const germanyEF = 0.624;
  const usedBulb = bulbs.find((bulb) => bulb._id == bulbId);
  if (usedBulb) {
    const bulbName = usedBulb.name;
    const costPerBulb = usedBulb.costInEuro;
    return answers.reduce<IlluminationCalculation>(
      (acc, answer) => {
        if (isSurveyAnswerType('illumination', answer)) {
          const illuminationPerYear = answer.value.avgIlluminationPerDay * 24 * answer.value.avgIlluminationPerYear;
          const timesToChange = Math.ceil(illuminationPerYear / usedBulb!.lifetimeInHours);
          const footprint =
            usedBulb!.productionKwh * answer.value.avgIlluminationPerYear * germanyEF + answer.value.lampCount;
          const costs = costPerBulb * answer.value.lampCount * timesToChange;
          acc.amountOfIlluminants += answer.value.lampCount;
          acc.costs += costs;
          acc.overallFootprint += footprint;
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

function calculateCostsForLED(costPerBulb: number, lampCount: number, year: number) {
  return costPerBulb * lampCount * (Math.floor(year / 4) + 1);
}
function calculateCostsForBulb(costPerBulb: number, lampCount: number, year: number) {
  return costPerBulb * lampCount * 4 * year;
}
