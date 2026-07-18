export const USER_ROLES = ["Admin", "Yogi", "Volunteer", "User"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const FEATURE_ACCESS_ROLES = ["Admin", "Yogi", "Volunteer"] as const satisfies readonly UserRole[];

export function isUserRole(value: unknown): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}

export function normalizeRole(value: unknown): UserRole | null {
  const role = USER_ROLES.find((item) => item.toLowerCase() === String(value || "").trim().toLowerCase());
  return role || null;
}

export function hasFeatureAccess(role?: string | null) {
  const normalizedRole = normalizeRole(role);
  return !!normalizedRole && FEATURE_ACCESS_ROLES.includes(normalizedRole as (typeof FEATURE_ACCESS_ROLES)[number]);
}
