import { Controller, Get, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Survey } from './survey.schema';
import { SurveyService } from './survey.service';

@Controller('api/v1/surveys')
@ApiTags('Survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [Survey] })
  async getAll() {
    return await this.surveyService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: Survey })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.surveyService.get(id);
  }
}
