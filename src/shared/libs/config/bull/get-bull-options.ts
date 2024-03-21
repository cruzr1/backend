import { ConfigService } from '@nestjs/config';
import { BullModuleOptions } from '@nestjs/bull';

const DEFAULT_QUEUE_PORT = '6379';

export async function getBullOptions(
  configService: ConfigService,
): Promise<BullModuleOptions> {
  return {
    redis: {
      host: configService.get('QUEUE_HOST'),
      port: parseInt(configService.get('QUEUE_PORT') || DEFAULT_QUEUE_PORT, 10),
    },
  };
}
