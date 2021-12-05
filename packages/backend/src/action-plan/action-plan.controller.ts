import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActionPlan, ActionPlanCreate, ActionPlanUpdate } from './action-plan.schema';
import { ActionPlanService } from './action-plan.service';

@Controller('api/v1')
@ApiTags('ActionPlan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ActionPlanController {
  constructor(private readonly actionPlanService: ActionPlanService) {}

  @Get('actionPlans')
  @ApiResponse({ status: HttpStatus.OK, type: [ActionPlan] })
  async getAll() {
    return await this.actionPlanService.getAll();
  }

  @Get('realEstates/:realEstateId/actionPlans')
  @ApiResponse({ status: HttpStatus.OK, type: [ActionPlan] })
  async getAllForRealEstate(@Param('realEstateId', ParseUUIDPipe) realEstateId: string) {
    return await this.actionPlanService.getAllForRealEstate(realEstateId);
  }

  @Get('actionPlans/:id')
  @ApiResponse({ status: HttpStatus.OK, type: ActionPlan })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.actionPlanService.get(id);
  }

  @Post('realEstates/:realEstateId/actionPlans')
  @ApiResponse({ status: HttpStatus.CREATED, type: ActionPlan })
  async create(@Param('realEstateId', ParseUUIDPipe) realEstateId: string, @Body() body: ActionPlanCreate) {
    return await this.actionPlanService.create({ ...body, realEstateId });
  }

  @Patch('actionPlans/:id')
  @ApiResponse({ status: HttpStatus.OK, type: ActionPlan })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: ActionPlanUpdate) {
    return await this.actionPlanService.update(id, body);
  }

  @Delete('actionPlans/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.actionPlanService.delete(id);
  }
}
