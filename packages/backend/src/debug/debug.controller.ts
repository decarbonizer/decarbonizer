import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DbSeedingService } from './db-seeding.service';

@Controller('api/v1/debug')
@ApiTags('Debug')
export class DebugController {
  constructor(private readonly dbSeedingService: DbSeedingService) {}

  @Post('seedDb')
  @ApiResponse({ status: HttpStatus.OK })
  async create() {
    return await this.dbSeedingService.seedDb();
  }
}
