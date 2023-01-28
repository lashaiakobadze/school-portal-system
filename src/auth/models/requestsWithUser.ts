
import { Request } from 'express';
import { User } from '../user.schema';
 
interface RequestWithUser extends Request {
  user: User;
}
 
export default RequestWithUser;