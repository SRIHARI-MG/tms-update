import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  LogOut,
  User,
  User2,
  ChevronDown,
} from "lucide-react";
import companyLogo from "@/assets/CompanyLogo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { jwtDecode } from "jwt-decode";
import api from "@/api/apiService";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";
import { handleLogout } from "@/utils/authHandler";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DecodedToken {
  role: string;
  userId: string;
}
interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

interface UserDetails {
  key: string;
  profileUrl: string;
  userId: string;
  firstName: string;
  lastName: string;
  personalEmail: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: moment.Moment | any;
  role: string;
  designation: string;
  branch: string;
  dateOfJoining: string;
  reportingManagerId: string | null;
  reportingMangerName: string | null;
  reportingManagerEmail: string | null;
  skills: string[];
  employmentType: string;
  internshipEndDate: string;
  internshipDuration: string;
  shiftTiming: string;
  willingToTravel: string;
  primaryProject: string;
  projects: string[];
  department: string;
  currentAddressLine1: string;
  currentAddressLine2: string;
  currentAddressLandmark: string;
  currentAddressNationality: string;
  currentAddressZipcode: string;
  currentAddressState: string;
  currentAddressDistrict: string;
  permanentAddressLine1: string;
  permanentAddressLine2: string;
  permanentAddressLandmark: string;
  permanentAddressNationality: string;
  permanentAddressZipcode: string;
  permanentAddressState: string;
  permanentAddressDistrict: string;
  alternateMobileNumberCountryCode: string;
  emergencyContactMobileNumberCountryCode: string;
  emergencyContactMobileNumber: string;
  emergencyContactPersonName: string;
  alternateMobileNumber: string;
}

export default function Header() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState("");
  const [userProfileDetails, setUserProfileDetails] =
    useState<UserDetails | null>(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const showToast = React.useCallback(
    (message: string) => {
      toast({
        title: "Notification",
        description: message,
        variant: "default",
        className: "fixed bottom-4 right-4  max-w-sm",
      });
    },
    [toast]
  );

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileUrl: "",
    lastLogin: "",
    role: "",
  });

  const fetchUserInfo = async () => {
    let response;
    try {
      if (userRole === "ROLE_HR") {
        response = await api.get("/api/v1/admin/fetch-user-info");
      } else {
        response = await api.get("/api/v1/employee/profile");
      }
      const user = response.data.response.data;
      setUserDetails({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        profileUrl: user?.profileUrl,
        lastLogin: user?.lastLogin,
        role: user?.role,
      });

      const mappedData: UserDetails = {
        key: user?.userId,
        profileUrl: user?.profileUrl,
        userId: user?.userId,
        firstName: user?.firstName,
        lastName: user?.lastName,
        personalEmail: user?.personalEmail,
        email: user?.email,
        mobileNumber: user?.mobileNumber,
        countryCode: user?.countryCode,
        gender: user?.gender,
        bloodGroup: user?.bloodGroup,
        dateOfBirth: user?.dateOfBirth,
        role: user?.role,
        employmentType: user?.employmentType,
        internshipEndDate: user?.internshipEndDate,
        internshipDuration: user?.internshipDuration,
        shiftTiming: user?.shiftTiming,
        designation: user?.designation,
        branch: user?.branch,
        dateOfJoining: user?.dateOfJoining,
        reportingManagerId: user?.reportingManagerId,
        reportingMangerName: user?.reportingMangerName,
        reportingManagerEmail: user?.reportingManagerEmail,
        skills: user?.skills,
        department: user?.department,
        alternateMobileNumber: user?.alternateMobileNumber,
        emergencyContactPersonName: user?.emergencyContactPersonName,
        emergencyContactMobileNumber: user?.emergencyContactMobileNumber,
        emergencyContactMobileNumberCountryCode:
          user?.emergencyContactMobileNumberCountryCode,
        alternateMobileNumberCountryCode:
          user?.alternateMobileNumberCountryCode,
        willingToTravel: user?.willingToTravel,
        primaryProject: user?.primaryProject,
        projects: user?.projects,
        currentAddressLine1: user?.currentAddress?.addressLine1,
        currentAddressLine2: user?.currentAddress?.addressLine2,
        currentAddressLandmark: user?.currentAddress?.landmark,
        currentAddressNationality: user?.currentAddress?.nationality,
        currentAddressZipcode: user?.currentAddress?.zipcode,
        currentAddressState: user?.currentAddress?.state,
        currentAddressDistrict: user?.currentAddress?.district,
        permanentAddressLine1: user?.permanentAddress?.addressLine1,
        permanentAddressLine2: user?.permanentAddress?.addressLine2,
        permanentAddressLandmark: user?.permanentAddress?.landmark,
        permanentAddressNationality: user?.permanentAddress?.nationality,
        permanentAddressZipcode: user?.permanentAddress?.zipcode,
        permanentAddressState: user?.permanentAddress?.state,
        permanentAddressDistrict: user?.permanentAddress?.district,
      };
      console.log(mappedData);
      setUserProfileDetails(mappedData);
    } catch (error: any) {
      showToast(error.response.data.message);
      // if (error.response?.status === 403) {
      //   toast.warning("Session expired. Redirecting to login page...", {
      //     duration: 2000,
      //     onDismiss: () => {
      //       localStorage.clear();
      //       navigate("/login");
      //     },
      //   });
      // }
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("authToken") || "");
    setDecoded(jwtDecode(token || "") as DecodedToken);
    setUserRole(localStorage.getItem("role") || "");
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const roleBasedNavItems: { [key: string]: NavItem[] } = {
      ROLE_HR: [
        { label: "Profile", path: "/hr/profile" },
        { label: "Jobs", path: "/hr/jobs" },
        { label: "Candidates", path: "/hr/candidates" },
      ],
      ROLE_MANAGER: [
        { label: "Profile", path: "/manager/profile" },
        { label: "Team", path: "/manager/team" },
        { label: "Projects", path: "/manager/projects" },
      ],
      ROLE_EMPLOYEE: [
        { label: "Dashboard", path: "/employee/dashboard" },
        {
          label: "Workspace",
          path: "/employee/workspace",
          children: [
            { label: "Collaborate", path: "/employee/workspace/collaborate" },
            { label: "My Projects", path: "/employee/workspace/my-projects" },
          ],
        },
        {
          label: "Timesheet",
          path: "/employee/timesheet",
          children: [
            { label: "Calendar", path: "/employee/timesheet/calendar" },
            { label: "Task Details", path: "/employee/timesheet/task-details" },
            {
              label: "Assigned Tasks",
              path: "/employee/timesheet/assigned-tasks",
            },
          ],
        },
      ],
      // Add more role-based navigation items as needed
    };

    setNavItems(roleBasedNavItems[userRole] || []);
  }, [userRole]);

  const onLogout = () => {
    handleLogout(navigate, showToast);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
      ? "border border-primary bg-primary/10"
      : "";
  };

  const profileRenderNavigation = (): string => {
    let result = "";
    if (userRole === "ROLE_HR") {
      result = "/hr/profile";
    } else if (userRole === "ROLE_MANAGER") {
      result = "/manager/profile";
    } else if (userRole === "ROLE_VIEWER") {
      result = "/viewer/profile";
    } else if (userRole === "ROLE_EMPLOYEE") {
      result = "/employee/profile";
    } else if (userRole === "SUPER_ADMIN") {
      result = "/superadmin/profile";
    } else if (userRole === "ROLE_RECRUITER") {
      result = "/recruiter/profile";
    }
    return result;
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item, index) => (
      <div key={index} className="relative group">
        {item.children ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`px-3 py-1 text-md font-semibold text-primary hover:border rounded-sm hover:border-primary hover:bg-primary/10 ${isActive(
                item.path
              )} flex items-center`}
            >
              {item.label}
              <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              {item.children.map((child, childIndex) => (
                <>
                  <DropdownMenuItem key={childIndex} className="bg-primary/10">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigate(child.path);
                        setIsOpen(false);
                      }}
                      className="w-full bg-primary/10 px-3 py-1 hover:bg-primary hover:text-secondary"
                    >
                      {child.label}
                    </Button>
                  </DropdownMenuItem>
                  <Separator />
                </>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to={item.path}
            className={`px-3 py-1 text-md font-semibold text-primary hover:border rounded-sm hover:border-primary hover:bg-primary/10 ${isActive(
              item.path
            )}`}
          >
            {item.label}
          </Link>
        )}
      </div>
    ));
  };

  const handleMenuItemClick = (path: string) => {
    setIsOpen(false); // Close the dropdown
    navigate(path, { state: userProfileDetails });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background z-10 border-b-2">
      <div className="flex h-20 md:h-20 items-center justify-between px-4 md:px-10">
        <div className="flex items-center ">
          <Sheet>
            <SheetTrigger className="mr-2 md:hidden">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col space-y-4 mt-6">
                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.children ? (
                      <>
                        <div className="px-3 py-2 text-md font-semibold text-primary">
                          {item.label}
                        </div>
                        {item.children.map((child, childIndex) => (
                          <div className="flex flex-col gap-5">
                            <Link
                              key={childIndex}
                              to={child.path}
                              onClick={() => setIsOpen(false)}
                              className="px-6 py-2 text-md text-primary hover:bg-primary/10 rounded-sm"
                            >
                              {child.label}
                            </Link>
                          </div>
                        ))}
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-2 text-md font-semibold text-primary hover:bg-primary/10 rounded-sm"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={companyLogo}
              alt="Mindgraph"
              className="h-8 w-22 md:h-14 md:w-26"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <ThemeToggle />
          {/* <button className="relative">
            <Bell className="h-5 w-5 md:h-6 md:w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </button> */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage
                    className="object-cover"
                    src={userDetails.profileUrl}
                  />
                  <AvatarFallback>
                    {userDetails.firstName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm">
                  <p className="font-medium">{`${userDetails.firstName} ${userDetails.lastName}`}</p>
                  <p className="text-muted-foreground">{userDetails.role}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => handleMenuItemClick(profileRenderNavigation())}
              >
                <User2 className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsOpen(false)}>
                <Bell className="mr-2 h-4 w-4" />
                Track Request
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <nav className="hidden md:block border-t-2 h-14 px-10">
        <div className="flex gap-8 items-center h-full">
          {renderNavItems(navItems)}
        </div>
      </nav>
    </header>
  );
}
