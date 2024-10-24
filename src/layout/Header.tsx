import React, { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  LogOut,
  User,
  User2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import api from "@/api/apiService";
import { useToast } from "@/hooks/use-toast";
import { handleLogout } from "@/utils/authHandler";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDrawer } from "@/hooks/use-drawer";

interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

interface UserDetails {
  profileUrl?: string;
  userId: string;
  firstName: string;
  lastName?: string;
  email?: string;
  personalEmail?: string;
  mobileNumber?: string;
  countryCode?: string;
  gender?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  role?: string;
  designation?: string;
  branch?: string;
  dateOfJoining?: string;
  reportingManagerId?: string;
  reportingMangerName?: string;
  reportingManagerEmail?: string;
  primarySkills?: string[];
  secondarySkills?: string[];
  employmentType?: string;
  department?: string;
  willingToTravel: boolean;
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
  primaryProject: string;
  projects: string[];
}

interface UserContextType {
  userDetails: UserDetails | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActionsContextType {
  updateUserDetails: (newDetails: Partial<UserDetails>) => void;
  resetUserDetails: () => void;
  fetchUserDetails: () => Promise<void>;
}

// Create contexts
const UserContext = createContext<UserContextType>({
  userDetails: null,
  isLoading: false,
  error: null,
});

const UserActionsContext = createContext<UserActionsContextType>({
  updateUserDetails: () => {},
  resetUserDetails: () => {},
  fetchUserDetails: async () => {},
});

// Provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
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

  const updateUserDetails = (newDetails: Partial<UserDetails>) => {
    setUserDetails(
      (prevDetails) =>
        ({
          ...prevDetails,
          ...newDetails,
        } as UserDetails)
    );
  };

  const resetUserDetails = () => {
    setUserDetails(null);
    setError(null);
  };

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    const userRole = localStorage.getItem("role");

    try {
      const response = await api.get(
        userRole === "ROLE_HR"
          ? "/api/v1/admin/fetch-user-info"
          : "/api/v1/employee/profile"
      );

      const userData = response.data.response.data;

      const mappedData: UserDetails = {
        profileUrl: userData.profileUrl,
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        personalEmail: userData.personalEmail,
        mobileNumber: userData.mobileNumber,
        countryCode: userData.countryCode,
        gender: userData.gender,
        bloodGroup: userData.bloodGroup,
        dateOfBirth: userData.dateOfBirth,
        role: userData.role,
        designation: userData.designation,
        branch: userData.branch,
        dateOfJoining: userData.dateOfJoining,
        reportingManagerId: userData.reportingManagerId,
        reportingMangerName: userData.reportingMangerName,
        reportingManagerEmail: userData.reportingManagerEmail,
        primarySkills: userData.primarySkills,
        secondarySkills: userData.secondarySkills,
        employmentType: userData.employmentType,
        department: userData.department,
        alternateMobileNumber: userData?.alternateMobileNumber,
        emergencyContactPersonName: userData?.emergencyContactPersonName,
        emergencyContactMobileNumber: userData?.emergencyContactMobileNumber,
        emergencyContactMobileNumberCountryCode:
          userData?.emergencyContactMobileNumberCountryCode,
        alternateMobileNumberCountryCode:
          userData?.alternateMobileNumberCountryCode,
        willingToTravel: userData?.willingToTravel,
        primaryProject: userData?.primaryProject,
        projects: userData?.projects,
        currentAddressLine1: userData?.currentAddress?.addressLine1,
        currentAddressLine2: userData?.currentAddress?.addressLine2,
        currentAddressLandmark: userData?.currentAddress?.landmark,
        currentAddressNationality: userData?.currentAddress?.nationality,
        currentAddressZipcode: userData?.currentAddress?.zipcode,
        currentAddressState: userData?.currentAddress?.state,
        currentAddressDistrict: userData?.currentAddress?.district,
        permanentAddressLine1: userData?.permanentAddress?.addressLine1,
        permanentAddressLine2: userData?.permanentAddress?.addressLine2,
        permanentAddressLandmark: userData?.permanentAddress?.landmark,
        permanentAddressNationality: userData?.permanentAddress?.nationality,
        permanentAddressZipcode: userData?.permanentAddress?.zipcode,
        permanentAddressState: userData?.permanentAddress?.state,
        permanentAddressDistrict: userData?.permanentAddress?.district,
      };

      setUserDetails(mappedData);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user details";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      handleLogout(navigate, showToast);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ userDetails, isLoading, error }}>
      <UserActionsContext.Provider
        value={{ updateUserDetails, resetUserDetails, fetchUserDetails }}
      >
        {children}
      </UserActionsContext.Provider>
    </UserContext.Provider>
  );
}

// Custom hooks
export function useUser() {
  return useContext(UserContext);
}

export function useUserActions() {
  return useContext(UserActionsContext);
}

export default function Header() {
  const { userDetails, isLoading } = useUser();
  const { openDrawer, closeDrawer } = useDrawer();
  const { fetchUserDetails } = useUserActions();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userRole: string | null = localStorage.getItem("role");
  const showTrackRequest =
    userRole === "ROLE_MANAGER" || userRole === "ROLE_EMPLOYEE";

  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<NavItem | null>(null);
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

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const roleBasedNavItems: { [key: string]: NavItem[] } = {
      ROLE_HR: [
        { label: "Dashboard", path: "/hr/dashboard" },
        {
          label: "Employee Hub",
          path: "/hr/employee-hub",
          children: [
            {
              label: "On-Duty Employees",
              path: "/hr/employee-hub/onduty-employees",
            },
            {
              label: "Offboarded Employees",
              path: "/hr/employee-hub/offboarded-employees",
            },
          ],
        },
        {
          label: "Workspace",
          path: "/hr/workspace",
          children: [
            { label: "Collaborate", path: "/hr/workspace/collaborate" },
            {
              label: "Request Approval",
              path: "/hr/workspace/request-approval",
            },
          ],
        },
      ],
      ROLE_MANAGER: [
        { label: "Profile", path: "/manager/profile" },
        { label: "Collaborate", path: "/manager/Collaborate" },
        { label: "Projects", path: "/manager/Projects" },
        { label: "Employees", path: "/manager/Employees" },
        { label: "Certificate", path: "/manager/Certificate" },
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
        // {
        //   label: "Timesheet",
        //   path: "/employee/timesheet",
        //   children: [
        //     { label: "Calendar", path: "/employee/timesheet/calendar" },
        //     { label: "Task Details", path: "/employee/timesheet/task-details" },
        //     {
        //       label: "Assigned Tasks",
        //       path: "/employee/timesheet/assigned-tasks",
        //     },
        //   ],
        // },
      ],
      // Add more role-based navigation items as needed
    };

    const currentNavItems = roleBasedNavItems[userRole as string] || [];
    setNavItems(currentNavItems);

    // Check if the current path is in the nav items
    const isPathInNavItems = (items: NavItem[]): boolean => {
      return items.some(
        (item) =>
          location.pathname.startsWith(item.path) ||
          (item.children && isPathInNavItems(item.children))
      );
    };

    if (!isPathInNavItems(currentNavItems)) {
      closeDrawer();
    }
  }, [userRole, location.pathname]);

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

  const trackRequestRenderNavigation = (): string => {
    let result = "";
    if (userRole === "ROLE_MANAGER") {
      result = "/manager/track-request";
    } else if (userRole === "ROLE_EMPLOYEE") {
      result = "/employee/track-request";
    }
    return result;
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item, index) => (
      <div key={index} className="relative group">
        <Button
          variant="ghost"
          className={`px-3 py-1 text-md font-semibold text-primary hover:border rounded-sm hover:border-primary hover:bg-primary/10 ${isActive(
            item.path
          )}`}
          onClick={() => {
            if (item.children && item.children.length > 0) {
              // Navigate to the first child's path
              navigate(item.children[0].path);
              // Open the drawer with the parent item's content
              openDrawer({
                title: item.label,
                content: (
                  <div className="space-y-2">
                    {item.children.map((child, childIndex) => (
                      <Button
                        key={childIndex}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => child.path} // This returns the path
                        path={child.path} // This provides the path directly
                      >
                        {child.label}
                      </Button>
                    ))}
                  </div>
                ),
              });
            } else {
              closeDrawer();
              navigate(item.path);
            }
          }}
        >
          {item.label}
          {item.children && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    ));
  };

  const SheetNavigation = ({
    navItems,
    setSheetOpen,
    navigate,
  }: {
    navItems: NavItem[];
    setSheetOpen: (open: boolean) => void;
    navigate: (path: string) => void;
  }) => {
    const location = useLocation();
    const [openItems, setOpenItems] = useState<string[]>([]);

    const isActiveRoute = (path: string) => {
      return location.pathname.startsWith(path);
    };

    const toggleItem = (label: string) => {
      setOpenItems((prev) =>
        prev.includes(label)
          ? prev.filter((item) => item !== label)
          : [...prev, label]
      );
    };

    const renderNavItem = (item: NavItem) => (
      <div key={item.label} className="w-full">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between px-3 py-2 text-md font-semibold rounded-md transition-colors",
            isActiveRoute(item.path)
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-muted"
          )}
          onClick={() => {
            if (item.children) {
              toggleItem(item.label);
            } else {
              navigate(item.path);
            }
          }}
        >
          {item.label}
          {item.children &&
            (openItems.includes(item.label) ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            ))}
        </Button>

        {item.children && openItems.includes(item.label) && (
          <div className="relative ml-4 mt-1">
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-b-2 border-muted rounded-bl-lg"></div>
            <div className="pl-2 pt-2 border-l-2 border-muted">
              {item.children.map((child) => (
                <Button
                  key={child.label}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-4 py-2 text-sm rounded-md transition-colors",
                    isActiveRoute(child.path)
                      ? "bg-primary/90 text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => {
                    navigate(child.path);
                    setSheetOpen(false);
                  }}
                >
                  {child.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div className="flex flex-col space-y-1 mt-6">
        {navItems.map(renderNavItem)}
      </div>
    );
  };

  const handleMenuItemClick = (path: string) => {
    setIsOpen(false); // Close the dropdown
    navigate(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-background z-10 border-b-2">
        <div className="flex h-20 md:h-20 items-center justify-between px-4 md:px-10">
          <div className="flex items-center ">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger className="mr-2 md:hidden">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetNavigation
                  navItems={navItems}
                  setSheetOpen={setSheetOpen}
                  navigate={navigate}
                />
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={companyLogo}
                alt="Mindgraph"
                className="h-8 w-22 md:h-14 md:w-26"
                loading="lazy"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage
                      loading="lazy"
                      className="object-cover"
                      src={userDetails?.profileUrl}
                    />
                    <AvatarFallback>
                      {userDetails?.firstName?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-sm">
                    <p className="font-medium">{`${userDetails?.firstName} ${userDetails?.lastName}`}</p>
                    <p className="text-muted-foreground">{userDetails?.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    handleMenuItemClick(profileRenderNavigation())
                  }
                >
                  <User2 className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                {showTrackRequest && (
                  <DropdownMenuItem
                    onSelect={() =>
                      handleMenuItemClick(trackRequestRenderNavigation())
                    }
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Track Request
                  </DropdownMenuItem>
                )}
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
      {/* <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{activeNavItem?.label}</DrawerTitle>
            <DrawerDescription>Navigate to a sub-section</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-2">
            {activeNavItem?.children?.map((child, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(child.path);
                  setIsDrawerOpen(false);
                }}
              >
                {child.label}
              </Button>
            ))}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer> */}
    </>
  );
}
