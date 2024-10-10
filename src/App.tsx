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
import WorkspaceCollaborate from "@/pages/private/Employee_Components/Workspace/WorkspaceCollaborate";
import WorkspaceMyProjects from "@/pages/private/Employee_Components/Workspace/WorkspaceMyProjects";
import TimesheetCalender from "@/pages/private/Employee_Components/Timesheet/TimesheetCalender";
import TimesheetTaskDetails from "@/pages/private/Employee_Components/Timesheet/TimesheetTaskDetails";
import TimesheetAssignedTask from "@/pages/private/Employee_Components/Timesheet/TimesheetAssignedTask";
import TrackRequestPage from "./pages/private/Track Request/TrackRequestPage";

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
            <AuthMiddleware allowedRoles={[Roles.ROLE_EMPLOYEE]}>
              <LayoutPage role={userRole!} />
            </AuthMiddleware>
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
          <Route
            path="track-request"
            element={
              <AuthMiddleware allowedRoles={[Roles.ROLE_EMPLOYEE]}>
                <TrackRequestPage />
              </AuthMiddleware>
            }
          />
          <Route path="workspace">
            <Route
              path="collaborate"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_EMPLOYEE]}>
                  <WorkspaceCollaborate />
                </AuthMiddleware>
              }
            />
            <Route
              path="my-projects"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_EMPLOYEE]}>
                  <WorkspaceMyProjects />
                </AuthMiddleware>
              }
            />
          </Route>

          <Route path="timesheet">
            <Route
              path="calendar"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_EMPLOYEE]}>
                  <TimesheetCalender />
                </AuthMiddleware>
              }
            />
            <Route
              path="task-details"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_EMPLOYEE]}>
                  <TimesheetTaskDetails />
                </AuthMiddleware>
              }
            />
            <Route
              path="assigned-tasks"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_EMPLOYEE]}>
                  <TimesheetAssignedTask />
                </AuthMiddleware>
              }
            />
          </Route>
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
