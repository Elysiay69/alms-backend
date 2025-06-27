export interface ServiceResponse<T> {
    statusCode: number;
    data?: T;
    message?: string;
}

export interface Permission {
    id: number;
    code: string;
    name: string;
    category: string;
}

export interface Role {
    id: number;
    code: string;
    name: string;
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    roleId: number;
    role: Role;
    permissions: Permission[];
}

export interface GetUserProfileResponse {
    success: boolean;
    data?: UserProfile;
    message?: string;
}

export interface JwtPayload {
    userId: number;
    username: string;
    role: number;
    iat?: number;
    exp?: number;
}

export interface RolePermission {
    permission: Permission;
}

export interface ExtractTokenFromHeader {
    (authHeader: string | undefined): string | null;
}
