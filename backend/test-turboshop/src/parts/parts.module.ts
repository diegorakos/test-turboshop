import { Module } from '@nestjs/common';
import { PartsController } from './parts.controller';
import { PartsService } from './services/parts.service';
import { ProvidersService } from './services/providers.service';

@Module({
  controllers: [PartsController],
  providers: [PartsService, ProvidersService],
})
export class PartsModule {}
