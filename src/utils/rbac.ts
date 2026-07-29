export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

/**
 * Role hierarchy definition.
 * Higher index means greater privileges.
 */
const ROLE_HIERARCHY: UserRole[] = ['viewer', 'editor', 'admin', 'owner'];

/**
 * Check if the user's role meets the minimum required role.
 */
export const hasPermission = (userRole: UserRole | string | null | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  const userIndex = ROLE_HIERARCHY.indexOf(userRole as UserRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  if (userIndex === -1 || requiredIndex === -1) return false;
  
  return userIndex >= requiredIndex;
};
