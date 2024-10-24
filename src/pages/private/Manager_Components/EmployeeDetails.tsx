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
import DatePicker from "@/components/ui/date-picker";
import PhoneInput from "@/components/ui/phone-input";
import TagInput from "@/components/ui/tag-input";
import api from "@/api/apiService";
import Loading from "@/components/ui/loading";

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
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in YYYY-MM-DD format.",
  }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  designation: z.string().min(1, { message: "Designation is required." }),
  position: z.string().min(1, { message: "Position is required." }),
  dateOfJoining: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in YYYY-MM-DD format.",
  }),
  salary: z.number().positive({ message: "Salary must be a positive number." }),
  mobileNumber: z.string(),
  alternateMobileNumber: z.string(),
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
  reportingMangerName: z
    .string()
    .min(1, { message: "Reporting manager name is required." })
    .nullable(),
  primarySkills: z.array(z.string()),
  secondarySkills: z.array(z.string()),
  employmentType: z
    .string()
    .min(1, { message: "Employment type is required." }),
  internshipEndDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date must be in YYYY-MM-DD format.",
    })
    .optional(),
  internshipDuration: z
    .string()
    .min(1, { message: "Internship duration is required." })
    .optional(),
  primaryProject: z
    .string()
    .min(1, { message: "Primary project is required." }),
  shiftTiming: z.string().min(1, { message: "Shift timing is required." }),
  willingToTravel: z
    .string()
    .min(1, { message: "Willingness to travel is required." }),
  reportingManagerEmail: z
    .string()
    .email({ message: "Invalid reporting manager email address." }),
  offboardingReason: z.string().optional(),
  revokeReason: z.string().optional(),
  department: z.string().min(1, { message: "Department is required." }),
  currentAddress: z.object({
    addressLine1: z.string().min(1, { message: "Address line 1 is required." }),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    district: z.string().min(1, { message: "District is required." }),
    state: z.string().min(1, { message: "State is required." }),
    zipcode: z
      .string()
      .regex(/^\d+$/, { message: "Zipcode must contain only numbers." }),
    nationality: z.string().min(1, { message: "Nationality is required." }),
  }),
  permanentAddress: z.object({
    addressLine1: z.string().min(1, { message: "Address line 1 is required." }),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    district: z.string().min(1, { message: "District is required." }),
    state: z.string().min(1, { message: "State is required." }),
    zipcode: z
      .string()
      .regex(/^\d+$/, { message: "Zipcode must contain only numbers." }),
    nationality: z.string().min(1, { message: "Nationality is required." }),
  }),
  permanentAddressDistrict: z
    .string()
    .min(1, { message: "Permanent address district is required." }),
  alternateMobileNumberCountryCode: z
    .string()
    .min(1, { message: "Alternate mobile number country code is required." })
    .optional(),
  emergencyContactMobileNumberCountryCode: z.string().min(1, {
    message: "Emergency contact mobile number country code is required.",
  }),
  emergencyContactMobileNumber: z.string().regex(/^\d{10}$/, {
    message: "Emergency contact mobile number must be 10 digits.",
  }),
  emergencyContactPersonName: z
    .string()
    .min(1, { message: "Emergency contact person name is required." }),
  finalInteractionPdfName: z.string().optional(),
  finalInteractionPdfUrl: z.string().url().optional(),
  active: z.boolean(),
  reportingManager: z.boolean(),
  currencyCode: z.string().min(1, { message: "Currency code is required." }),
  superAdmin: z.string().optional(),
  userRole: z.string().min(1, { message: "User role is required." }),
});

type EmployeeType = z.infer<typeof formSchema>;

export default function Employee_details() {
  const { userId } = useParams();
  const location = useLocation();
  const employee: EmployeeType = location.state.employeeDetails;
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);

  const willingToTravelOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const bloodGroupOptions = [
    "A+",
    "A-",
    "B+",
    "B-",
    "O+",
    "O-",
    "AB+",
    "AB-",
    "A1+",
    "A1-",
    "A2+",
    "A2-",
    "A1B+",
    "A1B-",
    "A2B+",
    "A2B-",
  ];

  const genderOptions = ["Male", "Female", "Other"];
  const employmentTypeOptions = [
    "Intern",
    "Full-Time",
    "Part-Time",
    "Consultant",
  ];
  const shiftTimeOptions = [
    "6.30 AM - 3.30 PM",
    "8.30 AM - 5.30 PM",
    "9.30 AM - 6.30 PM",
    "Flexible Shift",
  ];
  const countryCodes = ["+91", "+65", "+60", "+1", "+63"];

  const form = useForm<EmployeeType>({
    resolver: zodResolver(formSchema),
    defaultValues: employee,
  });

  useEffect(() => {
    // Fetch roles and designations from API
    const fetchDropdownData = async () => {
      try {
        const [rolesRes, designationsRes] = await Promise.all([
          api.get("/api/v1/dropdown/listRoles"),
          api.get("/api/v1/dropdown/listDesignations"),
        ]);

        setRoles(rolesRes.data.response.data);
        setDesignations(designationsRes.data.response.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

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

  const getWillingToTravelDisplay = (value: boolean) => {
    return value ? "Yes" : "No";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
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
                            <Input
                              {...field}
                              readOnly={!isEditMode}
                              className={`${
                                !isEditMode ? "bg-primary/5 text-gray-700" : ""
                              }`}
                              placeholder="Enter first name"
                              value={field.value || ""}
                            />
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
                            <Input
                              {...field}
                              readOnly={!isEditMode}
                              className={`${
                                !isEditMode ? "bg-primary/5 text-gray-700" : ""
                              }`}
                              placeholder="Enter last name"
                              value={field.value || ""}
                            />
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
                              readOnly={!isEditMode}
                              className={`${
                                !isEditMode ? "bg-primary/5 text-gray-700" : ""
                              }`}
                              placeholder="Enter email"
                              value={field.value || ""}
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
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={
                                field.value ? new Date(field.value) : undefined
                              }
                              readOnly={!isEditMode}
                            />
                          </FormControl>

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
                              {genderOptions.map((gender) => (
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bloodGroupOptions.map((bloodGroup) => (
                                <SelectItem key={bloodGroup} value={bloodGroup}>
                                  {bloodGroup}
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
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              readOnly={!isEditMode}
                              countryCodes={countryCodes}
                              placeholder="Enter mobile number"
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
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              readOnly={!isEditMode}
                              countryCodes={countryCodes}
                              placeholder="Enter Alternate number"
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
                            <Input
                              {...field}
                              className={`${
                                !isEditMode ? "bg-primary/5 text-gray-700" : ""
                              }`}
                              placeholder="Enter Emergency Contact Person"
                              value={field.value || ""}
                            />
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
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              readOnly={!isEditMode}
                              countryCodes={countryCodes}
                              placeholder="Enter Emergency Contact Number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Current Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="currentAddress.addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter Address Line 1"
                                value={field.value || ""}
                              />
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
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter Address Line 2"
                                value={field.value || ""}
                              />
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
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter LandMark"
                                value={field.value || ""}
                              />
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
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter Nationality"
                                value={field.value || ""}
                              />
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
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter Zipcode"
                                value={field.value || ""}
                              />
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
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter State"
                                value={field.value || ""}
                              />
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
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter District"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Permanent Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="permanentAddress.addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter Address Line 1"
                                value={field.value || ""}
                              />
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
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter Address Line 2"
                                value={field.value || ""}
                              />
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
                            <FormLabel>Landmark</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter Landmark"
                                value={field.value || ""}
                              />
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
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter Nationality"
                                value={field.value || ""}
                              />
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
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter Zipcode"
                                value={field.value || ""}
                              />
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
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter State"
                                value={field.value || ""}
                              />
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
                              <Input
                                {...field}
                                className={`${
                                  !isEditMode
                                    ? "bg-primary/5 text-gray-700"
                                    : ""
                                }`}
                                placeholder="Enter District"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
                            <Input
                              {...field}
                              className={`${
                                !isEditMode ? "bg-primary/5 text-gray-700" : ""
                              }`}
                              placeholder="Enter Employee Id"
                              value={field.value || ""}
                            />
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
                            <Input
                              {...field}
                              className={`${
                                !isEditMode ? "bg-primary/5 text-gray-700" : ""
                              }`}
                              placeholder="Enter Email"
                              value={field.value || ""}
                            />
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
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
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Designation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {designations.map((designation) => (
                                <SelectItem
                                  key={designation}
                                  value={designation}
                                >
                                  {designation}
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
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Employment Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {employmentTypeOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={`${
                                !isEditMode ? "bg-primary/5 text-gray-700" : ""
                              }`}
                            />
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
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Shift Time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {shiftTimeOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                      name="dateOfJoining"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Joining Date</FormLabel>

                          <FormControl>
                            <DatePicker
                              value={
                                field.value ? new Date(field.value) : undefined
                              }
                              readOnly={!isEditMode}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reportingManagerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reporting Manager</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={`${
                                !isEditMode ? "bg-primary/5 text-gray-700" : ""
                              }`}
                            />
                          </FormControl>
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
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                            value={field.value.toString()}
                            disabled={!isEditMode}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select">
                                  {getWillingToTravelDisplay(
                                    field.value === "true"
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {willingToTravelOptions.map((option) => (
                                <SelectItem
                                  key={option.label}
                                  value={option.value.toString()}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
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
                    /> */}

                    <FormField
                      control={form.control}
                      name="primarySkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Skills</FormLabel>
                          <FormControl>
                            {!isEditMode ? (
                              field.value && field.value.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {field.value.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic">
                                  No primary skills added
                                </p>
                              )
                            ) : (
                              <TagInput
                                initialTags={field.value}
                                onTagsChange={(newTags) =>
                                  field.onChange(newTags)
                                }
                              />
                            )}
                          </FormControl>
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
                            {!isEditMode ? (
                              field.value && field.value.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {field.value.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic">
                                  No secondary skills added
                                </p>
                              )
                            ) : (
                              <TagInput
                                initialTags={field.value}
                                onTagsChange={(newTags) =>
                                  field.onChange(newTags)
                                }
                              />
                            )}
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
