import { Controller, Get, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HeatingType } from './heating-type.schema';
import { HeatingTypeService } from './heating-type.service';

@Controller('api/v1/heatingtypes')
@ApiTags('HeatingType')
export class HeatingTypeController {
  constructor(private readonly heatingTypeService: HeatingTypeService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [HeatingType] })
  async getAll() {
    return await this.heatingTypeService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: HeatingType })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.heatingTypeService.get(id);
  }
}
