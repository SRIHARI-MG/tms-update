import React, { useEffect, useState, useMemo } from "react";
import DynamicTable from "@/components/ui/custom-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/api/apiService";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import Loading from "@/components/ui/loading";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Download } from "lucide-react";
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

interface Employee {
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

export default function Vieweremployee() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  console.log("employes", employees);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    role: "all",
    designation: "all",
    primarySkills: "all",
    secondarySkills: "all",
    branch: "all",
    project: "all",
  });
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const fetchEmployees = async () => {
    try {
      setIsFetchingData(true);
      const response = await api.get("/api/v1/admin/collaborate-employee-list");
      setEmployees(response.data.response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filterOptions = useMemo(() => {
    return {
      roles: [...new Set(employees.map((emp) => emp.role))],
      designations: [...new Set(employees.map((emp) => emp.designation))],
      primarySkills: [
        ...new Set(employees?.flatMap((emp) => emp?.primarySkills)),
      ],
      secondarySkills: [
        ...new Set(employees?.flatMap((emp) => emp?.secondarySkills)),
      ],
      branches: [...new Set(employees.map((emp) => emp.branch))],
      projects: [...new Set(employees.flatMap((emp) => emp.userProjects))],
    };
  }, [employees]);

  console.log("primarySkills", filterOptions);

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
        (filters.primarySkills === "all" ||
          emp?.primarySkills?.includes(filters?.primarySkills)) &&
        (filters.secondarySkills === "all" ||
          emp?.secondarySkills?.includes(filters?.secondarySkills)) &&
        (filters.branch === "all" || emp.branch === filters.branch) &&
        (filters.project === "all" ||
          emp.userProjects.includes(filters.project))
      );
    });
  }, [employees, filters, searchTerm]);

  const clearFilter = () => {
    setFilters({
      role: "all",
      designation: "all",
      primarySkills: "all",
      secondarySkills: "all",
      branch: "all",
      project: "all",
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees Data");
    XLSX.writeFile(workbook, `${fileName}.xlsx`, {
      bookType: "xlsx",
      type: "array",
    });
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

    exportToExcel(exportData, "selected_employees_data");
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

    exportToExcel(exportData, "selected_employees_all_data");
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
      accessor: (item: Employee) => (
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
      accessor: "firstName",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Designation",
      accessor: "designation",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Primary Skills",
      filterable: true,
      accessor: (item: Employee) => (
        <div className="flex flex-wrap gap-1">
          {item.primarySkills?.map((pskill, index) => (
            <span
              key={index}
              className="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
            >
              {pskill}
            </span>
          ))}
        </div>
      ),
      width: "35%",
    },
    {
      header: "Secondary Skills",
      filterable: true,
      accessor: (item: Employee) => (
        <div className="flex flex-wrap gap-1">
          {item?.secondarySkills?.map((sskill, index) => (
            <span
              key={index}
              className="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
            >
              {sskill}
            </span>
          ))}
        </div>
      ),
      width: "35%",
    },
    {
      header: "Branch",
      accessor: "branch",
      sortable: true,
      filterable: true,
      width: "10%",
    },
  ];

  if (isFetchingData) {
    return <Loading />;
  }

  const handleViewEmployee = (employee: Employee) => {
    console.log("Viewing employee:", employee);
    navigate(`/viewer/workspace/vieweremployee/${employee.userId}`, {
      state: { employeeDetails: employee },
    });
  };

  return (
    <div className="pb-5">
      <h1 className="text-2xl font-semibold mb-5">Employee List</h1>
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
              {filterOptions.roles?.map((role) => (
                <SelectItem key={role} value={(role as string) || undefined}>
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
              {filterOptions.designations?.map((designation) => (
                <SelectItem
                  key={designation}
                  value={(designation as string) || undefined}
                >
                  {designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              handleFilterChange("primarySkills", value)
            }
            value={filters.primarySkills}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Primary Skills</SelectItem>
              {filterOptions.primarySkills?.map((pskill) => (
                <SelectItem
                  key={pskill}
                  value={(pskill as string) || undefined}
                >
                  {pskill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              handleFilterChange("secondarySkills", value)
            }
            value={filters.secondarySkills}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Secondary Skills</SelectItem>
              {filterOptions.secondarySkills?.map((sskill) => (
                <SelectItem
                  key={sskill}
                  value={(sskill as string) || undefined}
                >
                  {sskill}
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
                <SelectItem
                  key={branch}
                  value={(branch as string) || undefined}
                >
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange("project", value)}
            value={filters.project}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {filterOptions.projects.map((project) => (
                <SelectItem
                  key={project}
                  value={(project as string) || undefined}
                >
                  {project}
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
}
