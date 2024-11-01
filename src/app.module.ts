import { Module } from '@nestjs/common';
import { AssetsModule } from '@src/modules/assets/assets.module';
import { LocationsModule } from '@src/modules/locations/locations.module';

@Module({
   imports: [LocationsModule, AssetsModule],
})
export class AppModule {}
