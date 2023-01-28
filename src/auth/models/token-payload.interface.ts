import { ObjectId } from "mongoose";

export interface TokenPayload {
  id: ObjectId;
  username: string;
  roles: string[];
}
