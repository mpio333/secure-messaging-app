import { IsString } from 'class-validator';

export class CreateThreadDto {
  @IsString()
  public user: string;
}

export class CreateMessageDto {
  @IsString()
  public body: string;
}
