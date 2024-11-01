import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AssetsService } from '@src/modules/assets/assets.service';
import { HttpResponse } from '@src/utils';
import { AssetTypes, LocationTypes } from '@src/utils/types';

@ApiTags('Assets')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('assets')
export class AssetsController {
   constructor(private readonly assetsService: AssetsService) {}
   @ApiOkResponse({ description: 'Get assets successful' })
   @Get()
   getAssets(): Promise<HttpResponse<AssetTypes[]>> {
      return this.assetsService.getAssets();
   }
}
