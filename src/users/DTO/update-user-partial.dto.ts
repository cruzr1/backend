import { OmitType, PartialType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateIf, IsArray, IsMongoId } from 'class-validator';
import { UserRole } from 'src/shared/libs/types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserPartialDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password', 'role'] as const),
) {
  @ApiProperty({
    description: 'User friends',
    example: ['1234-5678-1234', '1234-5678-2345'],
  })
  @IsOptional()
  public friends?: string[];

  @ApiProperty({
    description: 'User subscribed for trainer',
    example: '1234-5678-1234',
  })
  @IsOptional()
  @ValidateIf((obj) => obj.role === UserRole.User)
  @IsArray()
  @IsMongoId({ each: true })
  public subscribedFor?: string[];
}
