import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AssetsController } from '@src/modules/assets/assets.controller';
import { AssetsService } from '@src/modules/assets/assets.service';
import { LocationsController } from '@src/modules/locations/locations.controller';
import { LocationsService } from '@src/modules/locations/locations.service';

@Module({
   imports: [ScheduleModule.forRoot()],
   controllers: [AssetsController],
   providers: [AssetsService],
})
export class AssetsModule {}
