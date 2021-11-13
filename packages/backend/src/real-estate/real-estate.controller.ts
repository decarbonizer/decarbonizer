import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RealEstate } from './real-estate.schema';
import { RealEstateService } from './real-estate.service';

@Controller('api/v1/realEstates')
@ApiTags('RealEstate')
export class RealEstateController {
  constructor(private readonly realEstateService: RealEstateService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [RealEstate] })
  async getAll() {
    return await this.realEstateService.getAll();
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK })
  async create(@Body() realEstate: RealEstate) {
    return await this.realEstateService.create(realEstate);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: RealEstate })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.realEstateService.get(id);
  }
}
