import { Controller, Get, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnergyForm } from './energy-form.schema';
import { EnergyFormService } from './energy-form.service';

@Controller('api/v1/energyForms')
@ApiTags('EnergyForm')
export class EnergyFormController {
  constructor(private readonly messageService: EnergyFormService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [EnergyForm] })
  async getAll() {
    return await this.messageService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: EnergyForm })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageService.get(id);
  }
}
