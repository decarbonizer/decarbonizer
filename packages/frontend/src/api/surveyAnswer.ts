import { ApiObject, ApiObjectCreate, ApiObjectUpdate } from './apiObject';
import { Bulb } from './bulb';
import { RealEstate } from './realEstate';

export interface SurveyAnswer<T = object> extends ApiObject {
  realEstateId: string;
  surveyId: string;
  value: T;
}

export interface SurveyAnswerCreate extends ApiObjectCreate {
  value: object;
}

export interface SurveyAnswerUpdate extends ApiObjectUpdate {
  value?: object;
}

//
// Possible manifestations of survey answer values.
//

export interface IlluminationSurveyAnswer {
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

//
// Utils for matching/testing the untyped value of a survey answer.
//

type SurveyTypesWithAnswers = {
  illumination: IlluminationSurveyAnswer;
};

/**
 * Defines the different types of known surveys.
 */
export type SurveyType = keyof SurveyTypesWithAnswers;

/**
 * Evaluates whether the given survey answer relates to a known survey.
 * @param surveyType The type of survey to check for.
 * @param answer The survey answer.
 * @returns `true` if the survey answer's value has the shape of the known survey; `false` if not.
 */
export function isSurveyAnswerType<Type extends SurveyType>(
  surveyType: SurveyType,
  answer: SurveyAnswer,
): answer is SurveyAnswer<SurveyTypesWithAnswers[Type]> {
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
  powerConsumption: number;
  costs: number;
  overallFootprint: number;
}

/**
 * Evaluates carbon footprint of one real estate
 * @param answers All survey answers.
 * @param bulbs All bulbs.
 * @returns overall carbon footprint.
 */
export function caclucateOverallFootprint(answers: Array<SurveyAnswer>, bulbs: Array<Bulb>): number {
  return answers.reduce<number>((acc, answer) => acc + calculateFootprintDependingOnType(answer, bulbs), 0);
}

export function caclucateFootprintPerRealEstate(
  answers: Array<SurveyAnswer>,
  bulbs: Array<Bulb>,
  realEstates: Array<RealEstate>,
): Array<RealEstateFootprintCalculation> {
  const result: Array<RealEstateFootprintCalculation> = [];
  for (let i = 0; i < realEstates.length; i++) {
    const realEstateAnswers = answers.filter((answer) => answer.realEstateId == realEstates[i]._id);
    const footprintValue = +caclucateOverallFootprint(realEstateAnswers, bulbs).toFixed(1);
    result.push({ realEstateName: realEstates[i].cityName, footprint: footprintValue });
  }

  return result;
}

function caclucateIlluminationFootprint(answer: SurveyAnswer<IlluminationSurveyAnswer>, bulbs: Array<Bulb>): number {
  const germanyEF = 0.624; //standard emission factor for Germany
  const usedBulb = bulbs.find((bulb) => bulb._id == answer.value.bulbType);

  if (usedBulb !== null) {
    return answer.value.lampCount * usedBulb!.productionKwh * answer.value.avgIlluminationPerDay * germanyEF;
  } else {
    return 0;
  }
}

function calculateFootprintDependingOnType(answer: SurveyAnswer, bulbs: Array<Bulb>): number {
  if (isSurveyAnswerType('illumination', answer)) {
    return caclucateIlluminationFootprint(answer, bulbs);
  } else {
    //TODO define cases for other survey types
    return 0;
  }
}

export function calculateIllumitationData(
  answers: Array<SurveyAnswer>,
  bulbs: Array<Bulb>,
): Array<IlluminationCalculation> {
  const result: Array<IlluminationCalculation> = [];
  const germanyEF = 0.624;

  for (let i = 0; i < bulbs.length; i++) {
    const bulbName = bulbs[i].name;
    const productionKwh = bulbs[i].productionKwh;
    const costPerBulb = bulbs[i].costInEuro;
    const answersWithSpecificBulbs = answers.filter((answer) =>
      isSurveyAnswerType('illumination', answer) ? answer.value.bulbType == bulbs[i]._id : false,
    );
    if (answersWithSpecificBulbs.length > 0) {
      const amountOfIlluminants = answersWithSpecificBulbs.reduce<number>(
        (acc, answer) => (isSurveyAnswerType('illumination', answer) ? acc + answer.value.lampCount : acc),
        0,
      );
      const costs = +(costPerBulb * amountOfIlluminants).toFixed(1);
      const powerConsumption = answersWithSpecificBulbs.reduce<number>(
        (acc, answer) =>
          isSurveyAnswerType('illumination', answer)
            ? acc + answer.value.avgIlluminationPerDay * productionKwh * answer.value.lampCount
            : acc,
        0,
      );
      const overallFootprint = +(powerConsumption * germanyEF).toFixed(1);
      result.push({
        typeOfBulb: bulbName,
        amountOfIlluminants: amountOfIlluminants,
        costs: costs,
        powerConsumption: +powerConsumption.toFixed(1),
        overallFootprint: overallFootprint,
      });
    }
  }
  return result;
}
