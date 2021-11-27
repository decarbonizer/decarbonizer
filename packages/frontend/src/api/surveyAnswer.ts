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

const surveyTypesToIdsMap: Record<keyof SurveyTypesWithAnswers, string> = {
  illumination: '00000000-0000-0000-0000-000000000000',
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
  return answer.surveyId === surveyTypesToIdsMap[surveyType];
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

export interface GeneralCalculation {
  costs: number;
  overallFootprint: number;
}

/**
 * Evaluates carbon footprint of one real estate
 * @param answers All survey answers.
 * @param bulbs All bulbs.
 * @returns overall carbon footprint.
 */
export function calculateOverallFootprint(answers: Array<SurveyAnswer>, bulbs: Array<Bulb>): GeneralCalculation {
  return answers.reduce<GeneralCalculation>(
    (acc, answer) => {
      const calculation = calculateFootprintDependingOnType(answer, bulbs);
      acc.costs += calculation.costs;
      acc.overallFootprint += calculation.overallFootprint;
      return acc;
    },
    { costs: 0, overallFootprint: 0 },
  );
}

export function calculateFootprintPerRealEstate(
  answers: Array<SurveyAnswer>,
  bulbs: Array<Bulb>,
  realEstates: Array<RealEstate>,
): Array<RealEstateFootprintCalculation> {
  const result: Array<RealEstateFootprintCalculation> = [];
  for (let i = 0; i < realEstates.length; i++) {
    const realEstateAnswers = answers.filter((answer) => answer.realEstateId == realEstates[i]._id);
    const footprintValue = calculateOverallFootprint(realEstateAnswers, bulbs);
    result.push({ realEstateName: realEstates[i].cityName, footprint: +footprintValue.overallFootprint.toFixed(1) });
  }

  return result;
}

function calculateIlluminationFootprint(
  answer: SurveyAnswer<IlluminationSurveyAnswer>,
  bulbs: Array<Bulb>,
): GeneralCalculation {
  const germanyEF = 0.624; //standard emission factor for Germany
  const usedBulb = bulbs.find((bulb) => bulb._id == answer.value.bulbType);

  if (usedBulb !== null) {
    //calculate how many times bulbs need to be changed
    const illuminationPerYear = answer.value.avgIlluminationPerDay * 24 * 365;
    const timesToChange = Math.ceil(illuminationPerYear / usedBulb!.lifetimeInHours); //8760 hours in a year
    const footprint = usedBulb!.productionKwh * 24 * 365 * germanyEF + answer.value.lampCount;
    const costs = usedBulb!.costInEuro * answer.value.lampCount * timesToChange;
    return { costs: costs, overallFootprint: footprint };
  } else {
    return { costs: 0, overallFootprint: 0 };
  }
}

export function changeBulbs(answers: SurveyAnswer<object>[], bulbs: Bulb[], bulbId: string): IlluminationCalculation {
  const updatedAnswers = answers.map((answer) => {
    if (isSurveyAnswerType('illumination', answer)) {
      const newObject = Object.assign({}, answer);
      newObject.value = { ...answer.value, bulbType: bulbId }; //change bulbId
      return newObject;
    } else {
      return answer;
    }
  });

  return calculateIllumitationData(updatedAnswers, bulbs, bulbId);
}

function calculateFootprintDependingOnType(answer: SurveyAnswer, bulbs: Array<Bulb>): GeneralCalculation {
  if (isSurveyAnswerType('illumination', answer)) {
    return calculateIlluminationFootprint(answer, bulbs);
  } else {
    //TODO define cases for other survey types
    return { costs: 0, overallFootprint: 0 };
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
          const illuminationPerYear = answer.value.avgIlluminationPerDay * 24 * 365;
          const timesToChange = Math.ceil(illuminationPerYear / usedBulb!.lifetimeInHours);
          const footprint = usedBulb!.productionKwh * 24 * 365 * germanyEF + answer.value.lampCount;
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
