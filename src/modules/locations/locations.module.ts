import { Module } from '@nestjs/common';
import { LocationsController } from '@src/modules/locations/locations.controller';
import { LocationsService } from '@src/modules/locations/locations.service';

@Module({
   imports: [],
   controllers: [LocationsController],
   providers: [LocationsService],
})
export class LocationsModule {}
