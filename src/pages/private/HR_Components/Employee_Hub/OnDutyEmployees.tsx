import React, { useState, useEffect, useMemo } from "react";
import DynamicTable from "@/components/ui/custom-table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import api from "@/api/apiService";
import Loading from "@/components/ui/loading";
import mailLogo from "@/assets/Mail.svg";
import teamsLogo from "@/assets/teams.svg";
import whatsappLogo from "@/assets/whatsapp.svg";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import DatePicker from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, PlusIcon } from "lucide-react";

interface BankDetail {
  bankDetailsId: number;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  bankName: string;
  chequeProofName: string;
  chequeProofUrl: string;
}

interface UserDetails {
  profileUrl?: string;
  userId: string;
  firstName: string;
  lastName: string;
  personalEmail: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  alternateMobileNumber: string;
  alternateMobileNumberCountryCode: string;
  emergencyContactPersonName: string;
  emergencyContactMobileNumber: string;
  emergencyContactMobileNumberCountryCode: string;
  department: string;
  role: string;
  designation: string;
  employmentType: string;
  internshipDuration?: string;
  internshipEndDate?: string;
  shiftTiming: string;
  branch: string;
  dateOfJoining: string;
  dateOfLeaving: string | null;
  lastLogin: string;
  offboardingReason: string | null;
  finalInteractionPdfName: string | null;
  finalInteractionPdfUrl: string | null;
  revokeReason: string | null;
  reportingManagerId: string;
  reportingMangerName: string;
  reportingManagerEmail: string;
  primarySkills: string[];
  secondarySkills: string[];
  userRole: string | null;
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
  userProjects: any[]; // You might want to define a more specific type for projects
  bankDetail: BankDetail;
  active: boolean;
  willingToTravel: boolean;
  superAdmin: boolean;
  reportingManager: boolean;
}

const offboardingSchema = z.object({
  dateOfLeaving: z.date({
    required_error: "Date of leaving is required",
    invalid_type_error: "Date of leaving must be a valid date",
  }),
  offboardingReason: z.string().min(1, "Reason is required"),
});

const alertSchema = z.object({
  noDueStatus: z.boolean(),
  assertSubmitted: z.boolean(),
  idCardSubmitted: z.boolean(),
  finalInteractionMailAttachment: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    }),
});

const OnDutyEmployees = () => {
  const [employees, setEmployees] = useState<UserDetails[]>([]);
  const [filters, setFilters] = useState({
    role: "all",
    designation: "all",
    primarySkill: "all",
    secondarySkill: "all",
    branch: "all",
    department: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(false);
  const navigate = useNavigate();
  const [isOffboardModalOpen, setIsOffboardModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<UserDetails | null>(
    null
  );
  const [offboardingDate, setOffboardingDate] = useState<Date | undefined>(
    undefined
  );
  const [offboardingReason, setOffboardingReason] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<z.ZodIssue[] | null>(
    null
  );
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    noDueStatus: false,
    assertSubmitted: false,
    idCardSubmitted: false,
  });
  const [finalInteractionFile, setFinalInteractionFile] = useState<File | null>(
    null
  );
  const [alertValidationErrors, setAlertValidationErrors] = useState<
    z.ZodIssue[] | null
  >(null);

  const handleOffboard = (employee: UserDetails) => {
    console.log("Offboarding employee:", employee);
    setSelectedEmployee(employee);
    setIsOffboardModalOpen(true);
  };

  const handleOffboardSubmit = async () => {
    if (!selectedEmployee) return;

    try {
      offboardingSchema.parse({
        dateOfLeaving: offboardingDate,
        offboardingReason,
      });
      setValidationErrors(null);
      setIsConfirmDialogOpen(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors);
      }
    }
  };

  const confirmOffboarding = async () => {
    if (!selectedEmployee || !offboardingDate) return;

    try {
      const response = await api.post("/api/v1/admin/offboard-employee", {
        dateOfLeaving: format(offboardingDate, "yyyy-MM-dd"),
        offboardingReason: offboardingReason,
        userId: selectedEmployee.userId,
        userName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
      });

      console.log("Offboarding response:", response);
      // Handle successful offboarding (e.g., update employee list, show success message)
    } catch (error) {
      console.error("Error offboarding employee:", error);
      // Handle error (e.g., show error message)
    } finally {
      setIsOffboardModalOpen(false);
      setIsConfirmDialogOpen(false);
      setSelectedEmployee(null);
      setOffboardingDate(undefined);
      setOffboardingReason("");
      setValidationErrors(null);
    }
  };

  useEffect(() => {
    // Simulating API call
    const fetchEmployees = async () => {
      try {
        setIsFetchingData(true);
        const response = await api(`/api/v1/admin/employee-list`);
        setEmployees(response.data.response.data);
        console.log("Employees:", response.data.response.data);
        setIsFetchingData(false);
      } catch (error) {
        setIsFetchingData(false);
        console.error("Error fetching employee data:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchEmployees();
  }, []);

  const filterOptions = useMemo(() => {
    return {
      roles: [...new Set(employees.map((emp) => emp.role).filter(Boolean))],
      designations: [
        ...new Set(employees.map((emp) => emp.designation).filter(Boolean)),
      ],
      primarySkills: [
        ...new Set(
          employees.flatMap((emp) => emp.primarySkills).filter(Boolean)
        ),
      ],
      secondarySkills: [
        ...new Set(
          employees.flatMap((emp) => emp.secondarySkills).filter(Boolean)
        ),
      ],
      branches: [
        ...new Set(employees.map((emp) => emp.branch).filter(Boolean)),
      ],
      departments: [
        ...new Set(employees.map((emp) => emp.department).filter(Boolean)),
      ],
    };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const searchMatch =
        searchTerm === "" ||
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.userId.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        searchMatch &&
        (filters.role === "all" || emp.role === filters.role) &&
        (filters.designation === "all" ||
          emp.designation === filters.designation) &&
        (filters.primarySkill === "all" ||
          emp.primarySkills?.includes(filters.primarySkill)) &&
        (filters.secondarySkill === "all" ||
          emp.secondarySkills?.includes(filters.secondarySkill)) &&
        (filters.branch === "all" || emp.branch === filters.branch) &&
        (filters.department === "all" || emp.department === filters.department)
      );
    });
  }, [employees, filters, searchTerm]);

  const clearFilter = () => {
    setFilters({
      role: "all",
      designation: "all",
      primarySkill: "all",
      secondarySkill: "all",
      branch: "all",
      department: "all",
    });
    setSearchTerm("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleAlertSubmit = async () => {
    if (!selectedEmployee) return;

    try {
      alertSchema.parse({
        ...alertData,
        finalInteractionMailAttachment: finalInteractionFile,
      });
      setAlertValidationErrors(null);

      const formData = new FormData();
      formData.append(
        "finalInteractionMailAttachment",
        finalInteractionFile as File
      );
      formData.append(
        "offboardRequest",
        JSON.stringify({
          noDueStatus: alertData.noDueStatus,
          assertSubmitted: alertData.assertSubmitted,
          idCardSubmitted: alertData.idCardSubmitted,
        })
      );

      const response = await api.post(
        `/api/v1/admin/check-nodue-status/${selectedEmployee.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Alert submission response:", response);
      // Handle successful submission (e.g., show success message, update employee list)
      setIsAlertDialogOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setAlertValidationErrors(error.errors);
      } else {
        console.error("Error submitting alert:", error);
        // Handle API error (e.g., show error message)
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFinalInteractionFile(event.target.files[0]);
    }
  };

  const columns = [
    {
      header: "Employee",
      accessor: (employee: UserDetails) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={employee.profileUrl}
              alt={`${employee.firstName} ${employee.lastName}`}
            />
            <AvatarFallback>
              {employee.firstName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{`${employee.firstName} ${employee.lastName}`}</div>
            <div className="text-sm text-gray-500">{employee.userId}</div>
          </div>
        </div>
      ),
      sortAccessor: (employee: UserDetails) =>
        `${employee.firstName} ${employee.lastName}`,
      sortable: true,
      filterable: true,
      width: "20%",
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Primary Skills",
      accessor: (employee: UserDetails) => (
        <div className="flex flex-wrap gap-1">
          {employee?.primarySkills?.map((skill, index) => (
            <span
              key={index}
              className="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      ),
      filterable: true,
      width: "20%",
    },
    {
      header: "Secondary Skills",
      accessor: (employee: UserDetails) => (
        <div className="flex flex-wrap gap-1">
          {employee?.secondarySkills?.map((skill, index) => (
            <span
              key={index}
              className="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      ),
      filterable: true,
      width: "20%",
    },
    {
      header: "Reporting To",
      accessor: "reportingManagerEmail",
      sortable: true,
      filterable: true,
      width: "15%",
    },

    {
      header: "Contact",
      accessor: (item: UserDetails) => (
        <div className="flex space-x-2">
          <a href={`mailto:${item.email}`} title="Email">
            <img
              src={mailLogo}
              alt="Email Logo"
              className="w-6 h-6 text-gray-600 hover:text-primary"
              loading="lazy"
            />
          </a>
          <a
            href={`https://teams.microsoft.com/l/chat/0/0?users=${item.email}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Microsoft Teams"
          >
            <img
              src={teamsLogo}
              className="w-6 h-6 text-gray-600 hover:text-primary"
              loading="lazy"
            />
          </a>
          <a
            href={`https://wa.me/${item.mobileNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
          >
            <img
              src={whatsappLogo}
              className="w-6 h-6 text-gray-600 hover:text-primary"
              loading="lazy"
            />
          </a>
        </div>
      ),
      width: "6%",
    },
    {
      header: "Action",
      accessor: (employee: UserDetails) => (
        <>
          {employee?.dateOfLeaving === null ? (
            <Button
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleOffboard(employee);
              }}
            >
              Offboard
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEmployee(employee);
                setIsAlertDialogOpen(true);
              }}
            >
              Alert
            </Button>
          )}
        </>
      ),
      width: "5%",
      className: "py-2",
    },
  ];

  const handleViewEmployee = (employee: UserDetails) => {
    console.log("Viewing employee:", employee);
    navigate(`/hr/employee-hub/onduty-employees/${employee.userId}`, {
      state: { employeeDetails: employee },
    });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setOffboardingDate(newDate);
  };

  if (isFetchingData) {
    return <Loading />;
  }

  return (
    <div className="pb-5">
      <h1 className="text-2xl font-semibold mb-4">On-Duty Employee List</h1>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Button onClick={clearFilter} className="w-fit">
          Clear All Filters
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Select
            onValueChange={(value) => handleFilterChange("role", value)}
            value={filters.role}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {filterOptions.roles.map((role) => (
                <SelectItem key={role} value={role as string}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange("designation", value)}
            value={filters.designation}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              {filterOptions.designations.map((designation) => (
                <SelectItem key={designation} value={designation as string}>
                  {designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange("primarySkill", value)}
            value={filters.primarySkill}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Primary Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Primary Skills</SelectItem>
              {filterOptions.primarySkills.map((skill) => (
                <SelectItem key={skill} value={skill as string}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              handleFilterChange("secondarySkill", value)
            }
            value={filters.secondarySkill}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Secondary Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Secondary Skills</SelectItem>
              {filterOptions.secondarySkills.map((skill) => (
                <SelectItem key={skill} value={skill as string}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => handleFilterChange("branch", value)}
            value={filters.branch}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {filterOptions.branches.map((branch) => (
                <SelectItem key={branch} value={branch as string}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange("department", value)}
            value={filters.department}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {filterOptions.departments.map((department) => (
                <SelectItem key={department} value={department as string}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full sm:w-auto">
          <SearchInput
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        <Button onClick={() => navigate("/hr/employee-hub/onboard-employee")}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Onboard Employee
        </Button>
      </div>

      <div className="overflow-x-auto">
        <DynamicTable
          data={filteredEmployees}
          columns={columns}
          itemsPerPage={10}
          onClickNavigate={handleViewEmployee}
        />
      </div>
      <Dialog open={isOffboardModalOpen} onOpenChange={setIsOffboardModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offboard Employee</DialogTitle>
            <DialogDescription>
              Please provide the offboarding details for the employee.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-right">
                User ID
              </Label>
              <Input
                id="userId"
                value={selectedEmployee?.userId || ""}
                className=" focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary/5"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeName" className="text-right">
                Employee Name
              </Label>
              <Input
                id="employeeName"
                value={
                  `${selectedEmployee?.firstName} ${selectedEmployee?.lastName}` ||
                  ""
                }
                className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary/5"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfLeaving" className="text-right">
                Date of Leaving<span className="text-red-500">*</span>
              </Label>
              <div className="">
                <DatePicker
                  value={offboardingDate}
                  onChange={handleDateChange}
                />
              </div>
              {validationErrors?.find(
                (error) => error.path[0] === "dateOfLeaving"
              ) && (
                <p className="text-red-500 text-sm">
                  {
                    validationErrors.find(
                      (error) => error.path[0] === "dateOfLeaving"
                    )?.message
                  }
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-right">
                Reason<span className="text-red-500">*</span>
              </Label>
              <div>
                <Textarea
                  id="reason"
                  value={offboardingReason}
                  onChange={(e) => setOffboardingReason(e.target.value)}
                  className="col-span-3"
                  maxLength={500}
                  required
                />
              </div>
              {validationErrors?.find(
                (error) => error.path[0] === "dateOfLeaving"
              ) && (
                <p className="text-red-500 text-sm">
                  {
                    validationErrors.find(
                      (error) => error.path[0] === "dateOfLeaving"
                    )?.message
                  }
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleOffboardSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Alert</DialogTitle>
            <DialogDescription>
              Please provide the following information for the employee.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="noDueStatus"
                checked={alertData.noDueStatus}
                onCheckedChange={(checked) =>
                  setAlertData((prev) => ({ ...prev, noDueStatus: !!checked }))
                }
              />
              <Label htmlFor="noDueStatus">No due in finance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="assertSubmitted"
                checked={alertData.assertSubmitted}
                onCheckedChange={(checked) =>
                  setAlertData((prev) => ({
                    ...prev,
                    assertSubmitted: !!checked,
                  }))
                }
              />
              <Label htmlFor="assertSubmitted">Assert submitted</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="idCardSubmitted"
                checked={alertData.idCardSubmitted}
                onCheckedChange={(checked) =>
                  setAlertData((prev) => ({
                    ...prev,
                    idCardSubmitted: !!checked,
                  }))
                }
              />
              <Label htmlFor="idCardSubmitted">ID card submitted</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalInteractionFile">
                Final Interaction Mail attachment (PDF only)
              </Label>
              <Input
                id="finalInteractionFile"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
            {alertValidationErrors && (
              <div className="text-red-500">
                {alertValidationErrors.map((error) => (
                  <p key={error.path.join(".")}>{error.message}</p>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleAlertSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Offboarding</DialogTitle>
            <DialogDescription>
              Are you sure you want to offboard this employee? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmOffboarding}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnDutyEmployees;
