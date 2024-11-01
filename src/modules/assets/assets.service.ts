import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpResponse } from '@src/utils';
import { AssetTypes, LocationTypes } from '@src/utils/types';
import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AssetsService {
   private data: { assets: AssetTypes[]; locations: LocationTypes[] };
   private filePath = path.join('src/database/db.json');
   private readonly logger = new Logger(AssetsService.name);
   constructor() {
      this.loadData();
   }

   private loadData() {
      const rawData = fs.readFileSync(this.filePath, 'utf-8');
      this.data = rawData ? JSON.parse(rawData) : {};
   }

   private writeData(data: any): void {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
   }

   @Cron('47 22 * * *')
   private async asyncAssets(): Promise<any> {
      this.loadData();

      try {
         const originalAssets: AxiosResponse<AssetTypes[]> = await axios.get(
            'https://669ce22d15704bb0e304842d.mockapi.io/assets',
         );

         let syncedAssets: AssetTypes[] = [];
         const existedLocationIds = this.data.locations.map((l) => l.id);
         const onceADayAgoTimestamp = Math.floor(Date.now() / 1000) - 24 * 60 * 60 * 100;
         const existedAssetIds = this.data.assets.map((a) => a.id);

         if (Array.isArray(originalAssets?.data) && originalAssets?.data?.length > 0) {
            for (const asset of originalAssets?.data) {
               const updatedTimestamp = Math.floor(new Date(asset.updated_at).getTime() / 1000);

               //Check location already exists in db and location's status is active and assets updated once a day ago.
               if (
                  existedLocationIds.includes(asset.location_id) &&
                  updatedTimestamp >= onceADayAgoTimestamp &&
                  this.data.locations.find((l) => l.id === asset.location_id)?.status === 'actived'
               ) {
                  //Check existed if asset is updated, the old asset will be deleted in db
                  if (existedAssetIds.includes(asset.id)) {
                     this.data.assets.filter((a) => a.id !== asset.id);
                  }

                  syncedAssets.push(asset as AssetTypes);
               }
            }
         }

         this.writeData({ ...this.data, assets: [...this.data.assets, ...syncedAssets] });
         this.logger.log('Assets synced successfully');
      } catch (error) {
         const errorMessage = ' Assets synced failed';

         this.logger.log(errorMessage);

         return new HttpResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            errorMessage,
            undefined,
            error.message,
         );
      }
   }

   public async getAssets(): Promise<HttpResponse<AssetTypes[]>> {
      try {
         this.loadData();
         return new HttpResponse<AssetTypes[]>(
            HttpStatus.OK,
            'Get assets successfully',
            this.data.assets,
         );
      } catch (error) {
         return new HttpResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Get assets failed',
            undefined,
            error.message,
         );
      }
   }
}
