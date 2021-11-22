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


/**
 * Evaluates carbon footprint of one real estate
 * @param answers All survey answers.
 * @param bulbs All bulbs.
 * @returns overall carbon footprint.
 */
export function caclucateOverallFootprintForRealEstate(answers: Array<SurveyAnswer>, bulbs: Array<Bulb>): number {

  return answers.reduce<number>((acc, survey) => acc + calculateFootprint(survey, bulbs), 0);
}

export function caclucateFootprintPerRealEstate(answers: Array<SurveyAnswer>, bulbs: Array<Bulb>, realEstates: Array<RealEstate>): Array<RealEstateFootprintCalculation>{
  var result: Array<RealEstateFootprintCalculation> = [];
  for(var i = 0; i < realEstates.length; i++) {
    const realEstateAnswers = answers.filter(answer => answer.realEstateId == realEstates[i]._id);
    const footprintValue = +caclucateOverallFootprintForRealEstate(realEstateAnswers, bulbs).toFixed(1);
    result.push({"realEstateName": realEstates[i].cityName, "footprint" : footprintValue});
  }
  
  return result;
}

function caclucateIlluminationFootprint(answer: SurveyAnswer<IlluminationSurveyAnswer>, bulbs: Array<Bulb>): number {
  const germanyEF = 0.624; //standard emission factor for Germany
  const usedBulb = bulbs.find(bulb => bulb._id == answer.value.bulbType);

  if(usedBulb !== null) {
    return  answer.value.lampCount * usedBulb!.productionKwh * answer.value.avgIlluminationPerDay * germanyEF;
  } else {
    return 0;
  }
}

function calculateFootprint(answer: SurveyAnswer, bulbs: Array<Bulb>): number {
  if(isSurveyAnswerType("illumination", answer)) {
    return caclucateIlluminationFootprint(answer, bulbs);
  } else { //TODO define cases for other survey types
    return 0;
  }
}



