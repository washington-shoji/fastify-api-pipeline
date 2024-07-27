export interface UserEntityModel {
	user_id: string;
	username: string;
	email: string;
	password: string;
	user_role: UserRole;
	created_at: Date;
	updated_at: Date;
}

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
