import { Role } from '../models/role.enum';

export const hasRole = (accessRole: Role, roles: string[]) =>
	roles.some(role => role === accessRole);
