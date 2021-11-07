import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnergyForm, EnergyFormSchema } from './energy-form.schema';
import { EnergyFormController } from './energy-form.controller';
import { EnergyFormService } from './energy-form.service';
import { EnergyFormRepository } from './energy-form.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EnergyForm.name,
        schema: EnergyFormSchema,
      },
    ]),
  ],
  controllers: [EnergyFormController],
  providers: [EnergyFormService, EnergyFormRepository],
})
export class EnergyFormModule {}
