import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadedFileRdo {
  @Expose()
  @ApiProperty({
    description: 'Unique Id of the file',
    example: '12345678910sdfds',
  })
  id?: string;

  @Expose()
  @ApiProperty({
    description: 'Original filename',
    example: 'photo-1',
  })
  originalName: string;

  @Expose()
  @ApiProperty({
    description: 'Generated hash name',
    example: 'slkjfsldfjsw2ljsdlwj03fwo03jnw030f03fj30fj30',
  })
  hashName: string;

  @Expose()
  @ApiProperty({
    description: 'Sub directory where file stored',
    example: '/static/slkjfsldfjsw2ljsdlwj03fwo03jnw030f03fj30fj30.jpg',
  })
  subdirectory: string;

  @Expose()
  @ApiProperty({
    description: 'Size of the file in kilobytes',
    example: '1385234',
  })
  size: number;

  @Expose()
  @ApiProperty({
    description: 'Mime type of the file',
    example: 'jpeg/picture',
  })
  mimetype: string;
}
