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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RealEstate, RealEstateCreate, RealEstateUpdate } from './real-estate.schema';
import { RealEstateService } from './real-estate.service';

@Controller('api/v1/realEstates')
@ApiTags('RealEstate')
@UseGuards(JwtAuthGuard)
export class RealEstateController {
  constructor(private readonly realEstateService: RealEstateService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [RealEstate] })
  async getAll() {
    return await this.realEstateService.getAllForCurrentCompany();
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: RealEstate })
  async create(@Body() realEstate: RealEstateCreate) {
    return await this.realEstateService.create(realEstate);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: RealEstate })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.realEstateService.get(id);
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, type: RealEstate })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: RealEstateUpdate) {
    return await this.realEstateService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.realEstateService.delete(id);
  }
}
