import React, { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  HrRoutes,
  ManagerRoutes,
  RecruiterRoutes,
  SuperAdminRoutes,
  UserRoutes,
  ViewerRoutes,
} from "@/routes/Routes";
import { Button } from "@/components/ui/button";
import { Roles } from "@/utils/Roles";
import LoginPage from "@/pages/public/LoginPage";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import NotFound from "@/pages/public/NotFoundPage";
import ForgotPasswordPage from "@/pages/public/ForgotPasswordPage";
import { LayoutPage } from "@/layout/LayoutPage";

export function GlobalRouter() {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("authToken");

  const defaultRedirect = () => {
    switch (userRole) {
      case Roles.ROLE_HR:
        return "/hr/dashboard";
      case Roles.SUPER_ADMIN:
        return "/superadmin/dashboard";
      case Roles.ROLE_EMPLOYEE:
        return "/employee/dashboard";
      case Roles.ROLE_MANAGER:
        return "/manager/dashboard";
      case Roles.ROLE_VIEWER:
        return "/viewer/dashboard";
      case Roles.ROLE_RECRUITER:
        return "/recruiter/dashboard";
      default:
        return "/login";
    }
  };

  const getElementWithAccess = (
    element: ReactNode,
    roles: string | string[],
    path: string
  ) => {
    const hasRole = () => {
      if (token === null) {
        return false;
      }

      if (!userRole) {
        return false;
      }

      if (roles === "*") {
        return true;
      } else if (Array.isArray(roles)) {
        return roles.includes(userRole);
      } else {
        return userRole === roles;
      }
    };

    if (!userRole || !token) {
      return <Navigate to="/login" />;
    } else {
      return hasRole() ? element : <Navigate to="/login" />;
    }
  };

  return (
    <Routes>
      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center">
            <NotFound />
          </div>
        }
      />

      <Route
        element={
          userRole &&
          [
            "ROLE_HR",
            "ROLE_EMPLOYEE",
            "ROLE_MANAGER",
            "ROLE_VIEWER",
            "SUPER_ADMIN",
            "ROLE_RECRUITER",
          ].includes(userRole) ? (
            <LayoutPage role={userRole} />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        {HrRoutes.map(({ path, element, roles }) => (
          <Route
            path={path}
            element={getElementWithAccess(element, roles, path)}
            key={path}
          />
        ))}
        {ManagerRoutes.map(({ path, element, roles }) => (
          <Route
            path={path}
            element={getElementWithAccess(element, roles, path)}
            key={path}
          />
        ))}
        {UserRoutes.map(({ path, element, roles }) => (
          <Route
            path={path}
            element={getElementWithAccess(element, roles, path)}
            key={path}
          />
        ))}
        {ViewerRoutes.map(({ path, element, roles }) => (
          <Route
            path={path}
            element={getElementWithAccess(element, roles, path)}
            key={path}
          />
        ))}
        {SuperAdminRoutes.map(({ path, element, roles }) => (
          <Route
            path={path}
            element={getElementWithAccess(element, roles, path)}
            key={path}
          />
        ))}
        {RecruiterRoutes.map(({ path, element, roles }) => (
          <Route
            path={path}
            element={getElementWithAccess(element, roles, path)}
            key={path}
          />
        ))}
      </Route>
      <Route path="/" element={<Navigate to={defaultRedirect()} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/layout" element={<LayoutPage />} />
    </Routes>
  );
}
