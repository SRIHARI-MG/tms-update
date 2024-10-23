import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Certificates from "../ViewCertificateDetailsById";
import ViewProjectDetailsById from "../ViewProjectDetailsById";

const formSchema = z.object({
  userId: z.string().uuid(),
  profileUrl: z.string().url().optional(),
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  personalEmail: z.string().email({ message: "Invalid email address." }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format." }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  designation: z.string().min(1, { message: "Designation is required." }),
  position: z.string().min(1, { message: "Position is required." }),
  dateOfJoining: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format." }),
  salary: z.number().positive({ message: "Salary must be a positive number." }),
  mobileNumber: z.number().int().positive().gte(1000000000).lte(9999999999, { message: "Mobile number must be 10 digits." }),
  alternateMobileNumber: z.number().int().positive().gte(1000000000).lte(9999999999, { message: "Alternate mobile number must be 10 digits." }).optional(),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }),
  role: z.string().min(1, { message: "Role is required." }),
  branch: z.string().min(1, { message: "Branch is required." }),
  dateofLeaving: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date must be in YYYY-MM-DD format.",
    })
    .optional(),
  projects: z.array(z.string()),
  countryCode: z.string().min(1, { message: "Country code is required." }),
  reportingManagerId: z.string().uuid().nullable(),
  reportingMangerName: z.string().min(1, { message: "Reporting manager name is required." }).nullable(),
  primarySkills: z.array(z.string()),
  secondarySkills: z.array(z.string()),
  employmentType: z.string().min(1, { message: "Employment type is required." }),
  internshipEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format." }).optional(),
  internshipDuration: z.string().min(1, { message: "Internship duration is required." }).optional(),
  primaryProject: z.string().min(1, { message: "Primary project is required." }),
  shiftTiming: z.string().min(1, { message: "Shift timing is required." }),
  willingToTravel: z.string().min(1, { message: "Willingness to travel is required." }),
  reportingManagerEmail: z.string().email({ message: "Invalid reporting manager email address." }),
  offboardingReason: z.string().optional(),
  revokeReason: z.string().optional(),
  department: z.string().min(1, { message: "Department is required." }),
  // currentAddressLine1: z.string().min(1, { message: "Current address line 1 is required." }),
  // currentAddressLine2: z.string().optional(),
  // currentAddressLandmark: z.string().optional(),
  // currentAddressNationality: z.string().min(1, { message: "Current address nationality is required." }),
  // currentAddressZipcode: z.string().regex(/^\d+$/, { message: "Zipcode must contain only numbers." }),
  // currentAddressState: z.string().min(1, { message: "Current address state is required." }),
  // currentAddressDistrict: z.string().min(1, { message: "Current address district is required." }),
  // permanentAddressLine1: z.string().min(1, { message: "Permanent address line 1 is required." }),
  // permanentAddressLine2: z.string().optional(),
  // permanentAddressLandmark: z.string().optional(),
  // permanentAddressNationality: z.string().min(1, { message: "Permanent address nationality is required." }),
  // permanentAddressZipcode: z.string().regex(/^\d+$/, { message: "Zipcode must contain only numbers." }),
  // permanentAddressState: z.string().min(1, { message: "Permanent address state is required." }),
  currentAddress: z.object({
    addressLine1: z.string().min(1, { message: "Address line 1 is required." }),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    district: z.string().min(1, { message: "District is required." }),
    state: z.string().min(1, { message: "State is required." }),
    zipcode: z.string().regex(/^\d+$/, { message: "Zipcode must contain only numbers." }),
    nationality: z.string().min(1, { message: "Nationality is required." }),
  }),
  permanentAddress: z.object({
    addressLine1: z.string().min(1, { message: "Address line 1 is required." }),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    district: z.string().min(1, { message: "District is required." }),
    state: z.string().min(1, { message: "State is required." }),
    zipcode: z.string().regex(/^\d+$/, { message: "Zipcode must contain only numbers." }),
    nationality: z.string().min(1, { message: "Nationality is required." }),
  }),
  permanentAddressDistrict: z.string().min(1, { message: "Permanent address district is required." }),
  alternateMobileNumberCountryCode: z.string().min(1, { message: "Alternate mobile number country code is required." }).optional(),
  emergencyContactMobileNumberCountryCode: z.string().min(1, { message: "Emergency contact mobile number country code is required." }),
  emergencyContactMobileNumber: z.string().regex(/^\d{10}$/, { message: "Emergency contact mobile number must be 10 digits." }),
  emergencyContactPersonName: z.string().min(1, { message: "Emergency contact person name is required." }),
  finalInteractionPdfName: z.string().optional(),
  finalInteractionPdfUrl: z.string().url().optional(),
  active: z.boolean(),
  reportingManager: z.boolean(),
  currencyCode: z.string().min(1, { message: "Currency code is required." }),
  superAdmin: z.string().optional(),
  userRole: z.string().min(1, { message: "User role is required." }),
});

type EmployeeType = z.infer<typeof formSchema>;

// const dummyEmployee: EmployeeType = {
//   employee_id: "1",
//   profileUrl: "https://i.pravatar.cc/300",
//   firstName: "John",
//   lastName: "Doe",
//   email: "john.doe@example.com",
//   dateOfBirth: "1990-01-01",
//   gender: "Male",
//   designation: "Senior Developer",
//   position: "Senior Developer",
//   joiningDate: "2020-03-15",
//   salary: 85000,
//   mobilenumber: 1111111111,
//   alternatemobilenumber: 1111111111,
//   bloodgroup: "A+ve",
//   role: "Developer",
//   branch: "Main",
//   dateofLeaving: undefined,
//   projects: ["Project A", "Project B"],
//   countryCode: "+1",
//   reportingManagerId: null,
//   reportingMangerName: null,
//   skills: ["JavaScript", "React", "Node.js"],
//   employmentType: "Full-time",
//   internshipEndDate: undefined,
//   internshipDuration: undefined,
//   primaryProject: "Project A",
//   shiftTiming: "9 AM - 6 PM",
//   willingToTravel: "Yes",
//   reportingManagerEmail: "manager@example.com",
//   offboardingReason: undefined,
//   revokeReason: undefined,
//   department: "Engineering",
//   currentAddressLine1: "123 Main St",
//   currentAddressLine2: "Apt 4",
//   currentAddressLandmark: "Near Park",
//   currentAddressNationality: "USA",
//   currentAddressZipcode: "12345",
//   currentAddressState: "California",
//   currentAddressDistrict: "San Francisco",
//   permanentAddressLine1: "456 Oak St",
//   permanentAddressLine2: "Suite 7",
//   permanentAddressLandmark: "Near School",
//   permanentAddressNationality: "USA",
//   permanentAddressZipcode: "67890",
//   permanentAddressState: "New York",
//   permanentAddressDistrict: "Manhattan",
//   alternateMobileNumberCountryCode: "+1",
//   emergencyContactMobileNumberCountryCode: "+1",
//   emergencyContactMobileNumber: "9876543210",
//   emergencyContactPersonName: "Jane Doe",
//   alternateMobileNumber: "9876543210",
//   finalInteractionPdfName: undefined,
//   finalInteractionPdfUrl: undefined,
//   active: true,
//   reportingManager: false,
//   currencyCode: "USD",
//   superAdmin: undefined,
//   userRole: "Employee",
// }

export default function Employee_details() {
  const { userId } = useParams();
  const location = useLocation();
  const employee: EmployeeType = location.state.employeeDetails;
  // const [employee, setEmployee] = useState<EmployeeType>(dummyEmployee)
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmployeeType>({
    resolver: zodResolver(formSchema),
    defaultValues: employee,
  });

  const onSubmit = async (values: EmployeeType) => {
    try {
      const response = await fetch(`/api/employees/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Failed to update employee data");
      }
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating employee data:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{"Employee Details"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex justify-between items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={employee.profileUrl}
                    alt={`${employee.firstName} ${employee.lastName}`}
                  />
                  <AvatarFallback>
                    {employee.firstName[0]}
                    {employee.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {/* {!isEditMode && (
                  <Button onClick={() => setIsEditMode(true)}>Edit</Button>
                )} */}
              </div>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList>
                  <TabsTrigger value="personal">Personal Details</TabsTrigger>
                  <TabsTrigger value="professional">
                    Professional Details
                  </TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personalEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditMode}
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of Birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={!isEditMode}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? format(date, "yyyy-MM-dd") : ""
                                  )
                                }
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["Male", "Female", "Other"].map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {gender}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditMode}
                              type="tel"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="alternateMobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alternate Mobile Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditMode}
                              type="tel"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyContactPersonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Person</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyContactMobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditMode}
                              type="tel"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <h1>Current Address</h1>
                    <FormField
                      control={form.control}
                      name="currentAddress.addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentAddress.addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentAddress.landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LandMark</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentAddress.nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentAddress.zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zipcode</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentAddress.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentAddress.district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <h1>Permanent Address</h1>
                    <FormField
                      control={form.control}
                      name="permanentAddress.addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Addressline1</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="permanentAddress.addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Addressline2</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="permanentAddress.landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LandMark</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="permanentAddress.nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="permanentAddress.zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zipcode</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="permanentAddress.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="permanentAddress.district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="professional">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee Id</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Type</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shiftTiming"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shift Time</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfJoining"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Joining Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={!isEditMode}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? format(date, "yyyy-MM-dd") : ""
                                  )
                                }
                                disabled={(date) => date > new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reportingMangerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reporting Manager</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditMode}
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="primarySkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Skills</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              disabled={!isEditMode}
                              value={field.value.join(", ")}
                              onChange={(e) => field.onChange(e.target.value.split(", "))}
                            />
                          </FormControl>
                          <FormDescription>Enter skills separated by commas</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="secondarySkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Skills</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              disabled={!isEditMode}
                              value={field.value.join(", ")}
                              onChange={(e) => field.onChange(e.target.value.split(", "))}
                            />
                          </FormControl>
                          <FormDescription>Enter skills separated by commas</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="secondarySkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Skills</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isEditMode}
                              value={field.value.join(", ")}
                              onChange={(e) =>
                                field.onChange(e.target.value.split(", "))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Enter skills separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="willingToTravel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Willing to Travel</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditMode}
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="projects">
                  <ViewProjectDetailsById userId={userId} />
                </TabsContent>

                <TabsContent value="certificates">
                  <Certificates userId={userId} />
                </TabsContent>
              </Tabs>

              {isEditMode && (
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
