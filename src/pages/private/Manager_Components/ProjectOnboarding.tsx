"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import api from "@/api/apiService"

const DatePicker: React.FC<{
  id: string;
  selected: Date | null;
  onSelect: (date: Date | null) => void;
}> = ({ id, selected, onSelect }) => (
  <Input
    type="date"
    id={id}
    value={selected ? selected.toISOString().split('T')[0] : ''}
    onChange={(e) => onSelect(e.target.value ? new Date(e.target.value) : null)}
  />
);

interface ProjectOnboardingProps {
  onProjectAdded: () => void;
}

interface FormData {
  projectCode: string;
  projectName: string;
  projectDescription: string;
  subProject: string;
  projectType: string;
  startDate: Date | null;
  estimatedEndDate: Date | null;
  projectOwnerEmail: string;
  projectManagerEmail: string;
  projectStatus: string;
}

const ProjectOnboarding: React.FC<ProjectOnboardingProps> = ({ onProjectAdded }) => {
    const [value, setValue] = React.useState("")
  const [managerValue, setManagerValue] = React.useState("");
  const [formData, setFormData] = useState<FormData>({
    projectCode: '',
    projectName: '',
    projectDescription: '',
    subProject: '',
    projectType: '',
    startDate: null,
    estimatedEndDate: null,
    projectOwnerEmail: '',
    projectManagerEmail: '',
    projectStatus: ''
  });
  const [open, setOpen] = React.useState(false)
  const [employees, setEmployees] = useState([]);

  const handleInputChange = (name: keyof FormData, value: string | Date | null) => {
    setFormData(prev => ({
         ...prev,
          [name]: value 
        }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/v1/project/onboard-project', formData);
      if (response.data.success) {
        setOpen(false);
        onProjectAdded();
        setFormData({
          projectCode: '',
          projectName: '',
          projectDescription: '',
          subProject: '',
          projectType: '',
          startDate: null,
          estimatedEndDate: null,
          projectOwnerEmail: '',
          projectManagerEmail: '',
          projectStatus: '',
        });
      } else {
        console.error('Failed to create project:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/api/v1/admin/employee-list');
      const employeeCombo = response.data.response.data.map((item: any) => {
        return { label: item.email, value: item.email };
      })
      setEmployees(employeeCombo);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

   
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,  
      projectOwnerEmail: value  
    }));
  }, [value]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,  
      projectManagerEmail: managerValue  
    }));
  }, [managerValue]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4">
            <div className="space-y-4">
              <Label htmlFor="projectCode">Project Code</Label>
              <Input
                id="projectCode"
                value={formData.projectCode}
                onChange={(e) => handleInputChange('projectCode', e.target.value)}
                placeholder="Enter project code"
                className="w-[280px]"
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="Enter project name"
                className="w-[280px]"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="space-y-2 w-[280px]">
              <Label htmlFor="subProject">Sub Project</Label>
              <Select
                onValueChange={(value) => handleInputChange('subProject', value)}
                value={formData.subProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sub1">Sub 1</SelectItem>
                  <SelectItem value="sub2">Sub 2</SelectItem>
                  <SelectItem value="sub3">Sub 3</SelectItem>
                  <SelectItem value="sub4">Sub 4</SelectItem>
                  <SelectItem value="sub5">Sub 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-[280px]">
              <Label htmlFor="projectType">Project Type</Label>
              <Select 
                onValueChange={(value) => handleInputChange('projectType', value)}
                value={formData.projectType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Internal">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="space-y-2 w-[280px]">
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                id="startDate"
                selected={formData.startDate}
                onSelect={(date) => handleInputChange('startDate', date)}
              />
            </div>
            <div className="space-y-2 w-[280px]">
              <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
              <DatePicker
                id="estimatedEndDate"
                selected={formData.estimatedEndDate}
                onSelect={(date) => handleInputChange('estimatedEndDate', date)}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[280px] justify-between"
                >
                  {/* {formData.projectOwnerEmail || "Select project owner"} */}
                  {value ? employees.find((framework) => framework.value === value)?.label
                        : "Select Project Owner"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0">
              <Command>
          <CommandInput placeholder="Search Project Owner" />
          <CommandList>
            <CommandEmpty>No Owner found.</CommandEmpty>
            <CommandGroup>
              {employees.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue) 
                  }}
                >
                    
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework?.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

          <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[280px] justify-between"
                >
                  {managerValue ? employees.find((framework) => framework.value === managerValue)?.label : "Select Project Manager"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0">
                <Command>
                  <CommandInput placeholder="Search project manager..." />
                  <CommandList>
                    <CommandEmpty>No manager found.</CommandEmpty>
                    <CommandGroup>
                      {employees.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setManagerValue(currentValue === managerValue ? "" : currentValue)
                           
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              managerValue === framework?.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {framework.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

         

           
           
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectStatus">Project Status</Label>
            <Select 
              onValueChange={(value) => handleInputChange('projectStatus', value)}
              value={formData.projectStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Yet to start">Yet to start</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Over Due">Over Due</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Project Description</Label>
            <Textarea
              id="projectDescription"
              value={formData.projectDescription}
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
              placeholder="Enter Project Description"
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectOnboarding