import { Controller, Get, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Bulb } from './bulb.schema';
import { BulbService } from './bulb.service';

@Controller('api/v1/bulbs')
@ApiTags('Bulb')
export class BulbController {
  constructor(private readonly messageService: BulbService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [Bulb] })
  async getAll() {
    return await this.messageService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: Bulb })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.messageService.get(id);
  }
}
