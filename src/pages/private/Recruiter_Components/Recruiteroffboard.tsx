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
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import api from "@/api/apiService";
import Loading from "@/components/ui/loading";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Download } from "lucide-react";
import { z } from "zod";
import * as XLSX from "xlsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

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

const Recruiteroffboard = () => {
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
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const isSuperadmin = userRole === "SUPER_ADMIN";

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsFetchingData(true);
        const response = await api(
          "/api/v1/admin/employee-list?isActive=false"
        );
        setEmployees(response.data.response.data);
        console.log("Offboarded Employees:", response.data.response.data);
      } catch (error) {
        console.error("Error fetching offboarded employee data:", error);
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
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.userId.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        searchMatch &&
        (filters.role === "all" || emp.role === filters.role) &&
        (filters.designation === "all" ||
          emp.designation === filters.designation) &&
        (filters.primarySkill === "all" ||
          emp.primarySkills.includes(filters.primarySkill)) &&
        (filters.secondarySkill === "all" ||
          emp.secondarySkills.includes(filters.secondarySkill)) &&
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

  // Export Logic
  const exportToExcel = (data: any[], fileName: string) => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "Please select employees to export",
        variant: "destructive",
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Offboarded Employees Data"
    );
    XLSX.writeFile(workbook, `${fileName}.xlsx`, {
      bookType: "xlsx",
      type: "array",
    });
  };

  const fieldsList = [
    "userId",
    "firstName",
    "lastName",
    "gender",
    "email",
    "personalEmail",
    "mobileNumber",
    "dateOfBirth",
    "bloodGroup",
    "department",
    "role",
    "designation",
    "branch",
    "reportingManagerName",
    "reportingManagerEmail",
    "dateOfJoining",
    "primarySkills",
    "secondarySkills",
    "employmentType",
    "internshipEndDate",
    "internshipDuration",
    "shiftTiming",
    "willingToTravel",
    "salary",
    "alternateMobileNumber",
    "emergencyContactPersonName",
    "emergencyContactMobileNumber",
    "currentAddress.addressLine1",
    "currentAddress.addressLine2",
    "currentAddress.landmark",
    "currentAddress.nationality",
    "currentAddress.zipcode",
    "currentAddress.state",
    "currentAddress.district",
    "permanentAddress.addressLine1",
    "permanentAddress.addressLine2",
    "permanentAddress.landmark",
    "permanentAddress.nationality",
    "permanentAddress.zipcode",
    "permanentAddress.state",
    "permanentAddress.district",
  ];

  const fieldDisplayNames: { [key: string]: string } = {
    userId: "User ID",
    firstName: "First Name",
    lastName: "Last Name",
    gender: "Gender",
    email: "Email",
    personalEmail: "Personal Email",
    mobileNumber: "Mobile Number",
    dateOfBirth: "Date of Birth",
    bloodGroup: "Blood Group",
    department: "Department",
    role: "Role",
    designation: "Designation",
    branch: "Branch",
    reportingManagerName: "Reporting Manager Name",
    reportingManagerEmail: "Reporting Manager Email",
    dateOfJoining: "Date of Joining",
    primarySkills: "Primary Skills",
    secondarySkills: "Secondary Skills",
    employmentType: "Employment Type",
    internshipEndDate: "Internship End Date",
    internshipDuration: "Internship Duration",
    shiftTiming: "Shift Timing",
    willingToTravel: "Willing to Travel",
    salary: "Salary",
    alternateMobileNumber: "Alternate Mobile Number",
    emergencyContactPersonName: "Emergency Contact Person Name",
    emergencyContactMobileNumber: "Emergency Contact Mobile Number",
    "currentAddress.addressLine1": "Current Address Line 1",
    "currentAddress.addressLine2": "Current Address Line 2",
    "currentAddress.landmark": "Current Address Landmark",
    "currentAddress.nationality": "Current Address Nationality",
    "currentAddress.zipcode": "Current Address Zipcode",
    "currentAddress.state": "Current Address State",
    "currentAddress.district": "Current Address District",
    "permanentAddress.addressLine1": "Permanent Address Line 1",
    "permanentAddress.addressLine2": "Permanent Address Line 2",
    "permanentAddress.landmark": "Permanent Address Landmark",
    "permanentAddress.nationality": "Permanent Address Nationality",
    "permanentAddress.zipcode": "Permanent Address Zipcode",
    "permanentAddress.state": "Permanent Address State",
    "permanentAddress.district": "Permanent Address District",
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      toast({
        title: "No fields selected",
        description: "Please select at least one field to export.",
        variant: "destructive",
      });
      return;
    }

    if (selectedEmployees.length === 0) {
      toast({
        title: "No employees selected",
        description: "Please select at least one employee to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = employees
      .filter((emp) => selectedEmployees.includes(emp.userId))
      .map((employee) => {
        const filteredData: { [key: string]: any } = {};
        selectedFields.forEach((field) => {
          const keys = field.split(".");
          let value = employee as any;
          for (const key of keys) {
            if (value && typeof value === "object" && key in value) {
              value = value[key];
            } else {
              value = undefined;
              break;
            }
          }
          // Special handling for primarySkills and secondarySkills
          if (field === "primarySkills" || field === "secondarySkills") {
            value = Array.isArray(value) ? value.join(", ") : value;
          }
          filteredData[fieldDisplayNames[field] || field] = value;
        });
        return filteredData;
      });

    exportToExcel(exportData, "selected_offboarded_employees_data");
  };

  const handleExportAll = () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "No employees selected",
        description: "Please select at least one employee to export all data.",
        variant: "destructive",
      });
      return;
    }

    // Export all fields for selected employees
    const exportData = employees
      .filter((emp) => selectedEmployees.includes(emp.userId))
      .map((employee) => {
        const filteredData: { [key: string]: any } = {};
        fieldsList.forEach((field) => {
          const keys = field.split(".");
          let value = employee as any;
          for (const key of keys) {
            if (value && typeof value === "object" && key in value) {
              value = value[key];
            } else {
              value = undefined;
              break;
            }
          }
          // Special handling for primarySkills and secondarySkills
          if (field === "primarySkills" || field === "secondarySkills") {
            value = Array.isArray(value) ? value.join(", ") : value;
          }
          filteredData[fieldDisplayNames[field] || field] = value;
        });
        return filteredData;
      });

    if (exportData.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available for the selected employees.",
        variant: "destructive",
      });
      return;
    }

    exportToExcel(exportData, "selected_offboarded_employees_all_data");
  };

  const handleCheckboxChange = (checked: boolean, userId: string) => {
    setSelectedEmployees((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.userId));
    } else {
      setSelectedEmployees([]);
    }
  };

  const isAllSelected = selectedEmployees.length === filteredEmployees.length;
  const isIndeterminate =
    selectedEmployees.length > 0 &&
    selectedEmployees.length < filteredEmployees.length;

  const columns = [
    {
      header: (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
        </div>
      ),
      accessor: (item: UserDetails) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedEmployees.includes(item.userId)}
            onCheckedChange={(checked: boolean) =>
              handleCheckboxChange(checked, item.userId)
            }
          />
        </div>
      ),
      width: "5%",
    },
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
      width: "25%",
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      filterable: true,
      width: "15%",
    },
    {
      header: "Designation",
      accessor: "designation",
      sortable: true,
      filterable: true,
      width: "15%",
    },
    {
      header: "Date of Leaving",
      accessor: (employee: UserDetails) =>
        employee.dateOfLeaving
          ? format(new Date(employee.dateOfLeaving), "dd-MM-yyyy")
          : "N/A",
      sortAccessor: (employee: UserDetails) => employee.dateOfLeaving,
      sortable: true,
      width: "15%",
    },
    {
      header: "Offboarding Reason",
      accessor: "offboardingReason",
      sortable: true,
      width: "20%",
    },
  ];

  const handleViewEmployee = (employee: UserDetails) => {
    console.log("Viewing offboarded employee:", employee);
    if(isSuperadmin){
      navigate(`/superadmin/workspace/offboarded-employees/${employee.userId}`, {
        state: { employeeDetails: employee },
      });

    } else {
      navigate(`/hr/employee-hub/offboarded-employees/${employee.userId}`, {
        state: { employeeDetails: employee },
      });
    }
    
  };

  if (isFetchingData) {
    return <Loading />;
  }

  return (
    <div className="pb-5">
      <h1 className="text-2xl font-semibold mb-4">Offboarded Employee List</h1>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Button onClick={clearFilter} className="w-fit">
          Clear All Filters
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium">Export Options:</h3>
              <Button onClick={handleExportAll} className="w-full mb-2">
                Export All Data
              </Button>
              <h3 className="font-medium">Or Select Fields to Export:</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {fieldsList.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={selectedFields.includes(field)}
                      onCheckedChange={(checked) => {
                        setSelectedFields((prev) =>
                          checked
                            ? [...prev, field]
                            : prev.filter((f) => f !== field)
                        );
                      }}
                    />
                    <label
                      htmlFor={field}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {fieldDisplayNames[field] || field}
                    </label>
                  </div>
                ))}
              </div>
              <Button onClick={handleExport} className="w-full">
                Export Selected Data
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="overflow-x-auto">
        <DynamicTable
          data={filteredEmployees}
          columns={columns}
          itemsPerPage={10}
          onClickNavigate={handleViewEmployee}
        />
      </div>
    </div>
  );
};

export default Recruiteroffboard;
