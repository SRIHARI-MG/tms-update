'use client'

import React, { useEffect, useState, useMemo } from "react"
import DynamicTable from "@/components/ui/custom-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import api from "@/api/apiService"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/search-input"
import Loading from "@/components/ui/loading"
import * as XLSX from "xlsx"
import { useNavigate } from "react-router-dom"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Employee {
  profileUrl: string
  userId: string
  firstName: string
  lastName: string
  gender: string
  email: string
  personalEmail: string
  mobileNumber: string
  dateOfBirth: string
  bloodGroup: string
  department: string
  role: string
  designation: string
  branch: string
  reportingManagerName: string
  reportingManagerEmail: string
  dateOfJoining: string
  primarySkills: string[]
  secondarySkills: string[]
  employmentType: string
  internshipEndDate: string
  internshipDuration: string
  shiftTiming: string
  willingToTravel: boolean
  salary: string
  alternateMobileNumber: string
  emergencyContactPersonName: string
  emergencyContactMobileNumber: string
  currentAddress: {
    addressLine1: string
    addressLine2: string
    landmark: string
    nationality: string
    zipcode: string
    state: string
    district: string
  }
  permanentAddress: {
    addressLine1: string
    addressLine2: string
    landmark: string
    nationality: string
    zipcode: string
    state: string
    district: string
  }
  userProjects: string[]
}

export default function Component() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([])
  console.log("employes", employees);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [filters, setFilters] = useState({
    role: "all",
    designation: "all",
    primarySkills: "all",
    secondarySkills: "all",
    branch: "all",
    project: "all",
  })
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFields, setSelectedFields] = useState<string[]>([])

  const fetchEmployees = async () => {
    try {
      setIsFetchingData(true)
      const response = await api.get("/api/v1/admin/collaborate-employee-list")
      setEmployees(response.data.response.data)
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setIsFetchingData(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const filterOptions = useMemo(() => {
    return {
      roles: [...new Set(employees.map((emp) => emp.role))],
      designations: [...new Set(employees.map((emp) => emp.designation))],
      primarySkills: ["all",...new Set(employees?.flatMap((emp) => emp?.primarySkills))],
      secondarySkills: ["all",...new Set(employees?.flatMap((emp) => emp?.secondarySkills))],
      branches: [...new Set(employees.map((emp) => emp.branch))],
      projects: [...new Set(employees.flatMap((emp) => emp.userProjects))],
    }
  }, [employees])

  console.log("primarySkills", filterOptions);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const searchMatch =
        searchTerm === "" ||
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.userId.toLowerCase().includes(searchTerm.toLowerCase())

      return (
        searchMatch &&
        (filters.role === "all" || emp.role === filters.role) &&
        (filters.designation === "all" ||
          emp.designation === filters.designation) &&
        (filters.primarySkills === "all" || emp?.primarySkills?.includes(filters?.primarySkills)) &&
        (filters.secondarySkills === "all" || emp?.secondarySkills?.includes(filters?.secondarySkills)) &&
        (filters.branch === "all" || emp.branch === filters.branch) &&
        (filters.project === "all" ||
          emp.userProjects.includes(filters.project))
      )
    })
  }, [employees, filters, searchTerm])

  const clearFilter = () => {
    setFilters({
      role: "all",
      designation: "all",
      primarySkills: "all",
      secondarySkills: "all",
      branch: "all",
      project: "all",
    })
    setSearchTerm("")
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const exportToExcel = (data: any[], fileName: string) => {
    if (data.length === 0) {
      alert("No data to export.")
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees Data")
    XLSX.writeFile(workbook, `${fileName}.xlsx`, { bookType: 'xlsx', type: 'array' })
  }

  const handleExport = () => {
    const exportData = employees
      .filter((emp) => selectedEmployees.includes(emp.userId))
      .map((employee) => {
        const filteredData: { [key: string]: any } = {}
        selectedFields.forEach((field) => {
          const keys = field.split(".")
          let value = employee as any
          keys.forEach((key) => {
            value = value[key]
          })
          filteredData[field] = value
        })
        return filteredData
      })

    exportToExcel(exportData, "selected_employees_data")
  }

  const handleExportAll = () => {
    const exportData = employees.map((employee) => {
      const filteredData: { [key: string]: any } = {}
      fieldsList.forEach((field) => {
        const keys = field.split(".")
        let value = employee as any
        keys.forEach((key) => {
          value = value[key]
        })
        filteredData[field] = value
      })
      return filteredData
    })

    exportToExcel(exportData, "all_employees_data")
  }

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
  ]

  const handleCheckboxChange = (checked: boolean, userId: string) => {
    setSelectedEmployees((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.userId))
    } else {
      setSelectedEmployees([])
    }
  }

  const isAllSelected = selectedEmployees.length === filteredEmployees.length
  const isIndeterminate =
    selectedEmployees.length > 0 &&
    selectedEmployees.length < filteredEmployees.length

  const columns = [
    {
      header: () => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
          />
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
  ]

  if (isFetchingData) {
    return <Loading />
  }

  const handleViewEmployee = (employee: Employee) => {
    console.log("Viewing employee:", employee)
    navigate(`/manager/Employees/${employee.userId}`, {
      state: { employeeDetails: employee },
    })
  }

  return (
    <div className="pb-5">
      <h1 className="text-2xl font-semibold mb-5">Employee List</h1>
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
              {filterOptions.roles?.map((role) => (
                <SelectItem key={role} value={role || undefined}>
                  {role || "Undefined"}
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
                <SelectItem key={designation} value={designation || undefined}>
                  {designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange("primarySkills", value)}
            value={filters.primarySkills}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Primary Skills</SelectItem>
              {filterOptions.primarySkills?.map((pskill) => (
                <SelectItem key={pskill} value={pskill || undefined}>
                  {pskill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange("secondarySkills", value)}
            value={filters.secondarySkills}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Secondary Skills</SelectItem>
              {filterOptions.secondarySkills?.map((sskill) => (
                <SelectItem key={sskill} value={sskill || undefined}>
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
                <SelectItem key={branch} value={branch || undefined}>
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
                <SelectItem key={project} value={project || undefined}>
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
            <Button>Export</Button>
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
                        )
                      }}
                    />
                    <label
                      htmlFor={field}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {field}
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
  )
}