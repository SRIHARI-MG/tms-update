import { ReactNode } from "react";
import { Roles } from "../utils/Roles";
import HrDashboard from "@/pages/private/HR_Components/HrDashboard";
import ManagerDashboard from "@/pages/private/Manager_Components/ManagerDashboard";
import EmployeeDashboard from "@/pages/private/Employee_Components/EmployeeDashboard";
import ViewerDashboard from "@/pages/private/Viewer_Components/ViewerDashboard";
import SuperAdminDashboard from "@/pages/private/Super_Admin_Components/SuperAdminDashboard";
import RecruiterDashboard from "@/pages/private/Recruiter_Components/RecruiterDashboard";

interface RouteBase {
  path: string;
  element: ReactNode;
}

interface ProtectedRoutes extends RouteBase {
  roles: string | string[];
}

export const HrRoutes: ProtectedRoutes[] = [
  {
    path: "/hr/dashboard",
    element: <HrDashboard />,
    roles: Roles.ROLE_HR,
  },
  //   {
  //     path: "/hr/employee",
  //     element: <Employee />,
  //     roles: Roles.ROLE_HR,
  //   },
  //   {
  //     path: "/hr/approval",
  //     element: <Approval />,
  //     roles: Roles.ROLE_HR,
  //   },
  //   {
  //     path: "/certificate-requests",
  //     element: <CertificateApproval />,
  //     roles: Roles.ROLE_HR,
  //   },
  //   {
  //     path: "/employee/onboarding",
  //     element: <OptionSwitch />,
  //     roles: Roles.ROLE_HR,
  //   },
  //   {
  //     path: "/employee/:id",
  //     element: <EmployeeDetails />,
  //     roles: Roles.ROLE_HR,
  //   },
  //   {
  //     path: "/hr/collaborate",
  //     element: <Collaborate />,
  //     roles: Roles.ROLE_HR,
  //   },
  //   {
  //     path: "/hr/collaborate/:id",
  //     element: <CollaborateDetails />,
  //     roles: Roles.ROLE_HR,
  //   },
  //   {
  //     path: "/hr/profile",
  //     element: <UserProfile />,
  //     roles: Roles.ROLE_HR,
  //   },
  //   {
  //     path: "/employee/project-details/:id",
  //     element: <EmployeeProjectDetails />,
  //     roles: Roles.ROLE_HR,
  //   },
];

export const ManagerRoutes: ProtectedRoutes[] = [
  {
    path: "/manager/dashboard",
    element: <ManagerDashboard />,
    roles: Roles.ROLE_MANAGER,
  },
  //   {
  //     path: "/manager/employee",
  //     // element: <ListOfEmployees />,
  //     element: <EmployeeList />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/employee/:id",
  //     element: <EmployeeDetails />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/projects",
  //     element: <ProjectList />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/certificate",
  //     element: <CertificateApproval />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/projects/project-onboarding",
  //     element: <ProjectOnboardForm />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/projects/:id",
  //     element: <ProjectDetails />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/collaborate",
  //     element: <Collaborate />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/collaborate/:id",
  //     element: <CollaborateDetails />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/profile",
  //     element: <UserProfile />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/track-request",
  //     element: <Approval />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/employee/project-details/:id",
  //     element: <EmployeeProjectDetails />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/approvalrequest",
  //     element: <ApprovalRequest />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/individualreview",
  //     element: <IndividualApprovalRequest />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/timesheet",
  //     element: <TaskDetails />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/addtask",
  //     element: <AddTask />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/monthtasks",
  //     element: <MonthTasks />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/individualmonthtasks",
  //     element: <IndividualMonthTasks />,
  //     roles: [Roles.ROLE_EMPLOYEE, Roles.ROLE_MANAGER],
  //   },
  //   {
  //     path: "/manager/calendar",
  //     element: <Calendar />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/monthrequest",
  //     element: <MonthRequest />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/taskassign",
  //     element: <TaskAssign />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/taskassigntable",
  //     element: <TaskAssignTable />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  //   {
  //     path: "/manager/employeetaskassigndetails",
  //     element: <EmployeeTaskAssignDetails />,
  //     roles: Roles.ROLE_MANAGER,
  //   },
  // {
  //   path: "/manager/jobrequirements",
  //   element: <JobRequirementsTable />,
  //   roles: Roles.ROLE_MANAGER,
  // },
  // {
  //   path: "/manager/jobrequirements/create",
  //   element: <JobRequirements />,
  //   roles: Roles.ROLE_MANAGER,
  // },
  // {
  //   path: "/manager/track-jobrequirements",
  //   element: <JobRequirementsTrack />,
  //   roles: Roles.ROLE_MANAGER,
  // },
];

export const UserRoutes: ProtectedRoutes[] = [
  {
    path: "/employee/dashboard",
    element: <EmployeeDashboard />,
    roles: Roles.ROLE_EMPLOYEE,
  },
  //   {
  //     path: "/profile",
  //     element: <UserProfile />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/employee/collaborate",
  //     element: <Collaborate />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/employee/collaborate/:id",
  //     element: <CollaborateDetails />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/project-details",
  //     element: <UserIndividualProject />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/project-details/:id",
  //     element: <UserProjectList />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/certificate-approval",
  //     element: <CertificateApproval />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/track-request",
  //     element: <Approval />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/employee/taskdetails",
  //     element: <TaskDetails />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/employee/addtask",
  //     element: <AddTask />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/employee/calendar",
  //     element: <Calendar />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/employee/monthrequest",
  //     element: <MonthRequest />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/employee/taskassigntable",
  //     element: <TaskAssignTable />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/employee/individualreview",
  //     element: <IndividualApprovalRequest />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/employee/individualmonthtasks",
  //     element: <IndividualMonthTasks />,
  //     roles: [Roles.ROLE_EMPLOYEE, Roles.ROLE_MANAGER],
  //   },
  //   {
  //     path: "/asset/create-asset",
  //     element: <CreateAsset />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
  //   {
  //     path: "/asset/vendor",
  //     element: <Vendor />,
  //     roles: Roles.ROLE_EMPLOYEE,
  //   },
];

export const ViewerRoutes: ProtectedRoutes[] = [
  {
    path: "/viewer/dashboard",
    element: <ViewerDashboard />,
    roles: Roles.ROLE_VIEWER,
  },
  //   {
  //     path: "/viewer/employee",
  //     // element: <ViewerEmployeeTable />,
  //     element: <EmployeeList />,
  //     roles: Roles.ROLE_VIEWER,
  //   },
  //   {
  //     path: "/viewer/employee/:id",
  //     element: <EmployeeDetails />,
  //     roles: Roles.ROLE_VIEWER,
  //   },
  //   {
  //     path: "/viewer/profile",
  //     element: <UserProfile />,
  //     roles: Roles.ROLE_VIEWER,
  //   },
  //   {
  //     path: "/viewer/collaborate",
  //     element: <Collaborate />,
  //     roles: Roles.ROLE_VIEWER,
  //   },
  //   {
  //     path: "/viewer/collaborate/:id",
  //     element: <CollaborateDetails />,
  //     roles: Roles.ROLE_VIEWER,
  //   },
  //   {
  //     path: "/viewer/projects",
  //     element: <ViewerProjectList />,
  //     roles: Roles.ROLE_VIEWER,
  //   },
  //   {
  //     path: "/viewer/project/:id",
  //     element: <ViewerProjectDetails />,
  //     roles: Roles.ROLE_VIEWER,
  //   },
  //   {
  //     path: "/viewer/employee/project-details/:id",
  //     element: <EmployeeProjectDetails />,
  //     roles: Roles.ROLE_VIEWER,
  //   },
];

export const SuperAdminRoutes: ProtectedRoutes[] = [
  {
    path: "/superadmin/profile",
    element: <SuperAdminDashboard />,
    roles: Roles.SUPER_ADMIN,
  },
  //   {
  //     path: "/superadmin/dashboard",
  //     element: <Dashboard />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/additems",
  //     element: <AddItems />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/employee",
  //     element: <Employee />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/employee/:id",
  //     element: <EmployeeDetails />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/projects",
  //     element: <ProjectList />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/certificate-requests",
  //     element: <CertificateApproval />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/projects/project-onboarding",
  //     element: <ProjectOnboardForm />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/projects/:id",
  //     element: <ProjectDetails />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/collaborate",
  //     element: <Collaborate />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/collaborate/:id",
  //     element: <CollaborateDetails />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/approval",
  //     element: <Approval />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  //   {
  //     path: "/superadmin/employee/onboarding",
  //     element: <OptionSwitch />,
  //     roles: Roles.SUPER_ADMIN,
  //   },
  // {
  //   path: "/superadmin/jobrequirements",
  //   element: <JobRequirementsTable />,
  //   roles: Roles.SUPER_ADMIN,
  // },
  // {
  //   path: "/superadmin/jobrequirements/create",
  //   element: <JobRequirements />,
  //   roles: Roles.SUPER_ADMIN,
  // },
];

export const RecruiterRoutes: ProtectedRoutes[] = [
  {
    path: "/recruiter/profile",
    element: <RecruiterDashboard />,
    roles: Roles.ROLE_RECRUITER,
  },
  //   {
  //     path: "/recruiter/track-request",
  //     element: <Approval />,
  //     roles: Roles.ROLE_RECRUITER,
  //   },
  //   {
  //     path: "/recruiter/dashboard",
  //     element: <Dashboard />,
  //     roles: Roles.ROLE_RECRUITER,
  //   },
  //   {
  //     path: "/recruiter/collaborate",
  //     element: <Collaborate />,
  //     roles: Roles.ROLE_RECRUITER,
  //   },
  // {
  //   path: "/recruiter/jobrequirements",
  //   element: <JobRequirementsTable />,
  //   roles: Roles.ROLE_RECRUITER,
  // },
  // {
  //   path: "/recruiter/jobrequirements/create",
  //   element: <JobRequirementsPanel />,
  //   roles: Roles.ROLE_RECRUITER,
  // },
  // {
  //   path: "/recruiter/track-jobrequirements",
  //   element: <JobRequirementsTrack />,
  //   roles: Roles.ROLE_RECRUITER,
  // },
  //   {
  //     path: "/recruiter/approval",
  //     element: <Approval />,
  //     roles: Roles.ROLE_RECRUITER,
  //   },
  //   {
  //     path: "/recruiter/collaborate/:id",
  //     element: <CollaborateDetails />,
  //     roles: Roles.ROLE_RECRUITER,
  //   },
  //   {
  //     path: "/recruiter/employee",
  //     element: <Employee />,
  //     roles: Roles.ROLE_RECRUITER,
  //   },
  //   {
  //     path: "/recruiter/employee/:id",
  //     element: <EmployeeDetails />,
  //     roles: Roles.ROLE_RECRUITER,
  //   },
];
