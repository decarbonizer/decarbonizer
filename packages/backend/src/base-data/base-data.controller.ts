import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BaseData, BaseDataUpsert } from './base-data.schema';
import { BaseDataService } from './base-data.service';

@Controller('api/v1')
@ApiTags('BaseData')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BaseDataController {
  constructor(private readonly baseDataService: BaseDataService) {}

  @Get('baseData')
  @ApiResponse({ status: HttpStatus.OK, type: [BaseData] })
  async getAll() {
    return await this.baseDataService.getAllForCurrentCompany();
  }

  @Get('realEstates/:realEstateId/baseData')
  @ApiResponse({ status: HttpStatus.OK, type: [BaseData] })
  async getAllForRealEstate(@Param('realEstateId', ParseUUIDPipe) realEstateId: string) {
    return await this.baseDataService.getForRealEstate(realEstateId);
  }

  @Patch('realEstates/:realEstateId/baseData')
  @ApiResponse({ status: HttpStatus.OK, type: BaseData })
  async updateForRealEstate(@Param('realEstateId', ParseUUIDPipe) realEstateId: string, @Body() body: BaseDataUpsert) {
    return await this.baseDataService.updateForRealEstate({ ...body, _id: realEstateId, realEstateId });
  }
}
