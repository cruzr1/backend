import { ConfigService } from '@nestjs/config';
import { BullModuleOptions } from '@nestjs/bull';

export async function getBullOptions(
  configService: ConfigService,
): Promise<BullModuleOptions> {
  return {
    redis: {
      host: configService.get('QUEUE_HOST'),
      port: configService.get('QUEUE_PORT'),
    },
  };
}
