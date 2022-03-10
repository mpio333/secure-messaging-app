import { IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsOptional()
  public roles?: string[];
}
