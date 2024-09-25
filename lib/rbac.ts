// lib/rbac.ts
type Permission = "read" | "write" | "delete";

const rolePermissions: Record<string, Permission[]> = {
  admin: ["read", "write", "delete"],
  b2b: ["read", "write"],
  customer: ["read"],
};

export function hasPermission(
  userType: string,
  permission: Permission
): boolean {
  return rolePermissions[userType]?.includes(permission) || false;
}
