import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { UserStatus } from '../models/user-status.enum';

export class ChangeUserStatusDto {
  @IsMongoId()
  userId: ObjectId;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;
}
