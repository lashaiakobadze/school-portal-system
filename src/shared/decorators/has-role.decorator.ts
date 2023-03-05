import { Role } from '../../auth/models/role.enum';

export const hasRole = (accessRole: Role, roles: string[]) =>
	roles.some(role => role === accessRole);
