import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { Status } from '../models/user-status.enum';

export class ChangeUserStatusDto {
  @IsMongoId()
  userId: ObjectId;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
