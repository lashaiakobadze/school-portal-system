import {
  IsEnum,
  IsNotEmpty,
  IsUUID
} from 'class-validator';
import { Status } from '../models/user-status.enum';

export class ChangeUserStatusDto {
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
