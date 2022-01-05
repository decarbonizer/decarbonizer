import { Controller, Get, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Company } from './company.schema';
import { CompanyService } from './company.service';

@Controller('api/v1/companies')
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [Company] })
  async getAll() {
    return await this.companyService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: Company })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.companyService.get(id);
  }
}
