import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LocationsService } from '@src/modules/locations/locations.service';
import { HttpResponse } from '@src/utils';
import { LocationTypes } from '@src/utils/types';

@ApiTags('Locations')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('locations')
export class LocationsController {
   constructor(private readonly locationsService: LocationsService) {}
   @ApiOkResponse({ description: 'Get locations successful' })
   @Get()
   getLocations(): Promise<HttpResponse<LocationTypes[]>> {
      return this.locationsService.getLocations();
   }
}
