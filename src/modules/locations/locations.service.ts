import { HttpStatus, Injectable } from '@nestjs/common';
import { AssetTypes, HttpResponse } from '@src/utils';
import { LocationTypes } from '@src/utils/types';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocationsService {
   private locations: LocationTypes[];
   constructor() {
      this.loadData();
   }

   private loadData() {
      const filePath = path.join('src/database/db.json');

      const rawData = fs.readFileSync(filePath, 'utf-8');
      this.locations = JSON.parse(rawData).locations;
   }

   public async getLocations(): Promise<HttpResponse<LocationTypes[]>> {
      try {
         this.loadData();
         return new HttpResponse<LocationTypes[]>(
            HttpStatus.OK,
            'Get locations successfully',
            this.locations,
         );
      } catch (error) {
         return new HttpResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Get locations failed',
            undefined,
            error.message,
         );
      }
   }
}
