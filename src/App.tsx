import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthMiddleware } from "@/AuthMiddleware";
import { Roles, defaultRedirectPerRole } from "@/utils/roleConfig";
import { LayoutPage } from "@/layout/LayoutPage";
import Loading from "./components/ui/loading";
import Employees from "./pages/private/Manager_Components/Employees";
import Projects from "./pages/private/Manager_Components/Projects"
import Collaborate from "./pages/private/Manager_Components/Collaborate";
import Certificate from "./pages/private/Manager_Components/Certificate";
import Employee_details from "./pages/private/Manager_Components/Employee_details";
import OnDutyEmployees from "./pages/private/HR_Components/Employee_Hub/OnDutyEmployees";
import OffboardEmployees from "./pages/private/HR_Components/Employee_Hub/OffboardEmployees";
import WorkspaceRequestApproval from "./pages/private/HR_Components/Workspace/WorkspaceRequestApproval";
import EmployeeProfilePage from "./pages/private/HR_Components/Employee_Hub/EmployeeProfilePage";
import Certificateslist from "./pages/private/Certificateslist";
import Project_details from "./pages/private/Manager_Components/Project_details";
import { number, string } from "zod";
import Projectmembers from "./pages/private/Manager_Components/Projectmembers";

// Lazy loaded components
const LoginPage = lazy(() => import("@/pages/public/LoginPage"));
const ForgotPasswordPage = lazy(
  () => import("@/pages/public/ForgotPasswordPage")
);
const HrDashboard = lazy(
  () => import("@/pages/private/HR_Components/HrDashboard")
);
const ProfilePage = lazy(() => import("@/pages/private/Profile/ProfilePage"));
const ManagerDashboard = lazy(
  () => import("@/pages/private/Manager_Components/ManagerDashboard")
);
const NotFoundPage = lazy(() => import("@/pages/public/NotFoundPage"));
const EmployeeDashboard = lazy(
  () => import("@/pages/private/Employee_Components/EmployeeDashboard")
);
const WorkspaceCollaborate = lazy(
  () =>
    import("@/pages/private/Employee_Components/Workspace/WorkspaceCollaborate")
);
const WorkspaceMyProjects = lazy(
  () =>
    import("@/pages/private/Employee_Components/Workspace/WorkspaceMyProjects")
);
const TimesheetCalender = lazy(
  () =>
    import("@/pages/private/Employee_Components/Timesheet/TimesheetCalender")
);
const TimesheetTaskDetails = lazy(
  () =>
    import("@/pages/private/Employee_Components/Timesheet/TimesheetTaskDetails")
);
const TimesheetAssignedTask = lazy(
  () =>
    import(
      "@/pages/private/Employee_Components/Timesheet/TimesheetAssignedTask"
    )
);
const TrackRequestPage = lazy(
  () => import("./pages/private/Track Request/TrackRequestPage")
);
const Unauthorized = lazy(() => import("./pages/public/UnauthorizedPage"));

function App() {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("authToken");

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected routes wrapper */}
        <Route
          element={
            token ? (
              <AuthMiddleware
                allowedRoles={[
                  Roles.ROLE_EMPLOYEE,
                  Roles.SUPER_ADMIN,
                  Roles.ROLE_HR,
                  Roles.ROLE_MANAGER,
                  Roles.ROLE_RECRUITER,
                  Roles.ROLE_VIEWER,
                ]}
              >
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
          <Route path="hr">
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
            <Route path="employee-hub">
              <Route
                path="onduty-employees"
                element={
                  <AuthMiddleware allowedRoles={[Roles.ROLE_HR]}>
                    <OnDutyEmployees />
                  </AuthMiddleware>
                }
              />
              <Route
                path="onduty-employees/:userId"
                element={
                  <AuthMiddleware allowedRoles={[Roles.ROLE_HR]}>
                    <EmployeeProfilePage />
                  </AuthMiddleware>
                }
              />
              <Route
                path="offboarded-employees"
                element={
                  <AuthMiddleware allowedRoles={[Roles.ROLE_HR]}>
                    <OffboardEmployees />
                  </AuthMiddleware>
                }
              />
              <Route
                path="offboarded-employees/:userId"
                element={
                  <AuthMiddleware allowedRoles={[Roles.ROLE_HR]}>
                    <EmployeeProfilePage />
                  </AuthMiddleware>
                }
              />
            </Route>
            <Route path="workspace">
              <Route
                path="collaborate"
                element={
                  <AuthMiddleware allowedRoles={[Roles.ROLE_HR]}>
                    <WorkspaceCollaborate />
                  </AuthMiddleware>
                }
              />
              <Route
                path="request-approval"
                element={
                  <AuthMiddleware allowedRoles={[Roles.ROLE_HR]}>
                    <TrackRequestPage />
                  </AuthMiddleware>
                }
              />
            </Route>
          </Route>

          {/* Manager Routes */}
          <Route path="manager">
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
             <Route
              path="Employees"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_MANAGER]}>
                  <Employees />
                </AuthMiddleware>
              }
            />
            <Route
                path="Employees/:userId"
                element={
                  <AuthMiddleware allowedRoles={[Roles.ROLE_MANAGER]}>
                    <Employee_details/>
                  </AuthMiddleware>
                }
            />
              
             <Route
              path="Projects"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_MANAGER]}>
                  <Projects />
                </AuthMiddleware>
              }
            />
             <Route
              path="Collaborate"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_MANAGER]}>
                  <Collaborate />
                </AuthMiddleware>
              }
            />
            <Route
              path="Certificate"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_MANAGER]}>
                  <Certificate />
                </AuthMiddleware>
              }
            />
            <Route
              path="Project_details"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_MANAGER]}>
                  <Project_details />
                </AuthMiddleware>
              }
            />
             <Route
              path="Projectmembers"
              element={
                <AuthMiddleware allowedRoles={[Roles.ROLE_MANAGER]}>
                  <Projectmembers />
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

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Not found route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
