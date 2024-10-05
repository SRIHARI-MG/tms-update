// App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthMiddleware } from "@/AuthMiddleware";
import { Roles, defaultRedirectPerRole } from "@/utils/roleConfig";
import { LayoutPage } from "@/layout/LayoutPage";
import LoginPage from "@/pages/public/LoginPage";
import ForgotPasswordPage from "@/pages/public/ForgotPasswordPage";
import HrDashboard from "@/pages/private/HR_Components/HrDashboard";
import ProfilePage from "@/pages/private/Profile/ProfilePage";
import ManagerDashboard from "@/pages/private/Manager_Components/ManagerDashboard";
import NotFoundPage from "@/pages/public/NotFoundPage";
import EmployeeDashboard from "@/pages/private/Employee_Components/EmployeeDashboard";
import LogoutHandler from "./components/LogoutHandler";

function App() {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("authToken");

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes wrapper */}
      <Route
        element={
          token ? (
            <LayoutPage role={userRole!} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* Employee Routes */}
        <Route path="/employee">
          <Route
            path="dashboard"
            element={
              <AuthMiddleware allowedRoles={[Roles.ROLE_EMPLOYEE]}>
                <EmployeeDashboard />
              </AuthMiddleware>
            }
          />
          <Route
            path="profile"
            element={
              <AuthMiddleware allowedRoles={[Roles.ROLE_EMPLOYEE]}>
                <ProfilePage />
              </AuthMiddleware>
            }
          />
        </Route>

        {/* HR Routes */}
        <Route path="/hr">
          <Route
            path="dashboard"
            element={
              <AuthMiddleware allowedRoles={[Roles.ROLE_HR]}>
                <HrDashboard />
              </AuthMiddleware>
            }
          />
          <Route
            path="profile"
            element={
              <AuthMiddleware allowedRoles={[Roles.ROLE_HR]}>
                <ProfilePage />
              </AuthMiddleware>
            }
          />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager">
          <Route
            path="dashboard"
            element={
              <AuthMiddleware allowedRoles={[Roles.ROLE_MANAGER]}>
                <ManagerDashboard />
              </AuthMiddleware>
            }
          />
          <Route
            path="profile"
            element={
              <AuthMiddleware allowedRoles={[Roles.ROLE_MANAGER]}>
                <ProfilePage />
              </AuthMiddleware>
            }
          />
        </Route>

        {/* Add other role routes similarly */}
      </Route>

      {/* Default redirect */}
      <Route
        path="/"
        element={
          userRole ? (
            <Navigate
              to={
                defaultRedirectPerRole[userRole as keyof typeof Roles] ||
                "/login"
              }
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Not found route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
