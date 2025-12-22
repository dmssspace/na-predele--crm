export type UserRole = "admin" | "moderator" | "trainer" | "customer";

export interface User {
    id: string;
    email: string;
    phone_number?: string;
    role: UserRole;
}
