import HrDashboard from "@/pages/private/HR_Components/HrDashboard";
import ManagerDashboard from "@/pages/private/Manager_Components/ManagerDashboard";
import ProfilePage from "@/pages/private/Profile/ProfilePage";

// roleConfig.ts
export const Roles = {
  ROLE_HR: "ROLE_HR",
  ROLE_EMPLOYEE: "ROLE_EMPLOYEE",
  ROLE_MANAGER: "ROLE_MANAGER",
  ROLE_VIEWER: "ROLE_VIEWER",
  SUPER_ADMIN: "SUPER_ADMIN",
  ROLE_RECRUITER: "ROLE_RECRUITER",
} as const;

export type RoleType = keyof typeof Roles;

export const defaultRedirectPerRole: Record<RoleType, string> = {
  ROLE_HR: "/hr/dashboard",
  ROLE_EMPLOYEE: "/employee/dashboard",
  ROLE_MANAGER: "/manager/dashboard",
  ROLE_VIEWER: "/viewer/Viewerdashboard",
  SUPER_ADMIN: "/superadmin/dashboard",
  ROLE_RECRUITER: "/recruiter/dashboard",
};

// You might also want to add route configurations
export const routeConfig = {
  hr: {
    basePath: "/hr",
    allowedRoles: [Roles.ROLE_HR],
    routes: [
      { path: "dashboard", element: HrDashboard },
      { path: "profile", element: ProfilePage },
    ],
  },
  manager: {
    basePath: "/manager",
    allowedRoles: [Roles.ROLE_MANAGER],
    routes: [
      { path: "dashboard", element: ManagerDashboard },
      { path: "profile", element: ProfilePage },
    ],
  },
  // Add similar configurations for other roles
};
