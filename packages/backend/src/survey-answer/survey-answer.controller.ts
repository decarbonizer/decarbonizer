import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SurveyAnswer, SurveyAnswerCreate, SurveyAnswerUpdate } from './survey-answer.schema';
import { SurveyAnswerService } from './survey-answer.service';

@Controller('api/v1')
@ApiTags('SurveyAnswer')
export class SurveyAnswerController {
  constructor(private readonly surveyAnswerService: SurveyAnswerService) {}

  @Get('surveyAnswers')
  @ApiResponse({ status: HttpStatus.OK, type: [SurveyAnswer] })
  async getAll() {
    return await this.surveyAnswerService.getAll();
  }

  @Get('realEstates/:realEstateId/surveys/:surveyId/surveyAnswers')
  @ApiResponse({ status: HttpStatus.OK, type: [SurveyAnswer] })
  async getAllForSurveyAndRealEstate(
    @Param('realEstateId', ParseUUIDPipe) realEstateId: string,
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
  ) {
    return await this.surveyAnswerService.getAllForSurveyAndRealEstate(realEstateId, surveyId);
  }

  @Get('realEstates/:realEstateId/surveyAnswers')
  @ApiResponse({ status: HttpStatus.OK, type: [SurveyAnswer] })
  async getAllForRealEstate(@Param('realEstateId', ParseUUIDPipe) realEstateId: string) {
    return await this.surveyAnswerService.getAllForRealEstate(realEstateId);
  }

  @Get('surveyAnswers/:id')
  @ApiResponse({ status: HttpStatus.OK, type: SurveyAnswer })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.surveyAnswerService.get(id);
  }

  @Post('realEstates/:realEstateId/surveys/:surveyId/surveyAnswers')
  @ApiResponse({ status: HttpStatus.CREATED, type: SurveyAnswer })
  async create(
    @Param('realEstateId', ParseUUIDPipe) realEstateId: string,
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
    @Body() body: SurveyAnswerCreate,
  ) {
    return await this.surveyAnswerService.create({ ...body, surveyId, realEstateId });
  }

  @Patch('surveyAnswers/:id')
  @ApiResponse({ status: HttpStatus.OK, type: SurveyAnswer })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: SurveyAnswerUpdate) {
    return await this.surveyAnswerService.update(id, body);
  }

  @Delete('surveyAnswers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.surveyAnswerService.delete(id);
  }
}
