import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/api/apiService";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, UploadCloud, User2, Users } from "lucide-react";
import TagInput from "@/components/ui/tag-input";
import DatePicker from "@/components/ui/date-picker";
import PhoneInput from "@/components/ui/phone-input";
import UploadBulkOnboardForm from "./HR_Components/UploadBulkOnboardForm";

const formSchema = z.object({
  userId: z
    .string()
    .min(1, "Employee ID is required")
    .regex(/^MG/, "Employee ID must start with 'MG'"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  personalEmail: z.string().email("Invalid personal email address"),
  email: z
    .string()
    .email("Invalid work email")
    .min(1, "Work email is required"),
  countryCode: z.string(),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  gender: z.string(),
  bloodGroup: z.string(),
  dateOfBirth: z.date(),
  alternateMobileNumber: z
    .string()
    .min(1, "Alternate mobile number is required"),
  alternateMobileNumberCountryCode: z.string(),
  emergencyContactPersonName: z
    .string()
    .min(1, "Emergency contact name is required"),
  emergencyContactMobileNumber: z
    .string()
    .min(1, "Emergency contact number is required"),
  emergencyContactMobileNumberCountryCode: z.string(),
  department: z.string(),
  role: z.string().min(1, "Role is required"),
  designation: z.string(),
  employmentType: z.string(),
  internshipDuration: z.string().nullable(),
  internshipEndDate: z.date().nullable(),
  shiftTiming: z.string(),
  branch: z.string().min(1, "Branch is required"),
  dateOfJoining: z.date(),
  reportingTo: z.string(),
  skills: z.array(z.string()),
  primarySkills: z.array(z.string()),
  secondarySkills: z.array(z.string()),
  willingToTravel: z.boolean(),
  currentAddress: z.object({
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    district: z.string(),
    zipcode: z.string(),
    state: z.string(),
    nationality: z.string(),
    permanentAddress: z.boolean(),
  }),
  permanentAddress: z.object({
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    district: z.string(),
    zipcode: z.string(),
    state: z.string(),
    nationality: z.string(),
    permanentAddress: z.boolean(),
  }),
});

const genderOptions = ["Male", "Female", "Others"];
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const employmentTypeOptions = ["Full-Time", "Part-Time", "Contract", "Intern"];
const shiftTimeOptions = [
  "6.30 AM - 3.30 PM",
  "8.30 AM - 5.30 PM",
  "9.30 AM - 6.30 PM",
  "Flexible Shift",
];

const countryOptions = ["India", "USA", "Malaysia", "Singapore", "Philippines"];
const branchOptions = [
  "Coimbatore",
  "Bangalore",
  "Hyderabad",
  "Bhubaneshwar",
  "Malaysia",
  "Philippines",
  "Singapore",
  "USA",
];

export default function EmployeeOnboardForm() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("Single Onboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [rolesRes, departmentsRes, designationsRes, countryCodesRes] =
          await Promise.all([
            api.get("/api/v1/dropdown/listRoles"),
            api.get("/api/v1/dropdown/listDepartments"),
            api.get("/api/v1/dropdown/listDesignations"),
            api.get("/api/v1/dropdown/listCountryCodes"),
          ]);

        setRoles(rolesRes.data.response.data);
        setDepartments(departmentsRes.data.response.data);
        setDesignations(designationsRes.data.response.data);
        setCountryCodes(countryCodesRes.data.response.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch dropdown data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchDropdownData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      firstName: "",
      lastName: "",
      personalEmail: "",
      email: "",
      countryCode: "+91",
      mobileNumber: "",
      gender: "",
      bloodGroup: "",
      dateOfBirth: new Date(),
      alternateMobileNumber: "",
      alternateMobileNumberCountryCode: "+91",
      emergencyContactPersonName: "",
      emergencyContactMobileNumber: "",
      emergencyContactMobileNumberCountryCode: "+91",
      department: "",
      role: "",
      designation: "",
      employmentType: "",
      internshipDuration: null,
      internshipEndDate: null,
      shiftTiming: "",
      branch: "",
      dateOfJoining: new Date(),
      reportingTo: "",
      skills: [],
      primarySkills: [],
      secondarySkills: [],
      willingToTravel: false,
      currentAddress: {
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        district: "",
        zipcode: "",
        state: "",
        nationality: "",
        permanentAddress: false,
      },
      permanentAddress: {
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        district: "",
        zipcode: "",
        state: "",
        nationality: "",
        permanentAddress: true,
      },
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, or GIF)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploadingAvatar(true);

      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
      setProfileImage(file);

      toast({
        title: "Image uploaded",
        description: "Profile image has been successfully uploaded",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      // Transform skills into the required format
      const transformedSkills = [
        ...values.primarySkills.map((skill) => ({ skill, priority: 1 })),
        ...values.secondarySkills.map((skill) => ({ skill, priority: 2 })),
      ];

      // Create a copy of values and replace primarySkills and secondarySkills with the transformed skills
      const { primarySkills, secondarySkills, ...transformedValues } = {
        ...values,
        skills: transformedSkills,
      };

      formData.append("profileData", JSON.stringify(transformedValues));

      const response = await api.post(
        "/api/v1/admin/onboard-employee",
        formData
      );

      toast({
        title: "Employee Onboarded",
        description: response.data.message,
      });

      // Reset form or navigate to another page
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6 pb-5 px-4">
      <h1 className="text-2xl font-semibold">Employee Onboarding</h1>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-6">
        <Card className="w-full h-fit md:w-3/12 border-none rounded-lg shadow-md">
          <CardHeader
            className={`mb-6 border-primary/15 border-b-2 py-5 ${
              isMobile ? "cursor-pointer" : ""
            }`}
            onClick={isMobile ? toggleMobileNav : undefined}
          >
            <CardTitle>Onboarding Options</CardTitle>
          </CardHeader>
          <CardContent
            className={`space-y-2 pb-5 ${
              isMobile && !isMobileNavOpen ? "hidden" : ""
            }`}
          >
            <nav className="space-y-2">
              <Button
                variant={
                  selectedOption === "Single Onboard" ? "secondary" : "ghost"
                }
                className="w-full justify-start text-md hover:bg-primary/10"
                onClick={() => setSelectedOption("Single Onboard")}
              >
                <User2 className="mr-2 h-5 w-5" />
                Single Onboard
              </Button>
              <Button
                variant={
                  selectedOption === "Bulk Onboard" ? "secondary" : "ghost"
                }
                className="w-full justify-start text-md hover:bg-primary/10"
                onClick={() => setSelectedOption("Bulk Onboard")}
              >
                <Users className="mr-2 h-5 w-5" />
                Bulk Onboard
              </Button>
            </nav>
          </CardContent>
        </Card>
        <Card className="w-full md:w-3/4 shadow-md border-none">
          <CardHeader>
            <CardTitle>{selectedOption}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedOption === "Single Onboard" ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="flex justify-center sm:justify-start items-center mb-6">
                    <div
                      className="relative group cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Avatar className="h-28 w-28 border">
                        <AvatarImage
                          src={avatarUrl || undefined}
                          alt="Profile"
                          className="object-cover"
                        />
                        <AvatarFallback className="flex flex-col gap-1">
                          <User2 className="h-6 w-6" />
                          Upload
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {isUploadingAvatar ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                        ) : (
                          <Camera className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="personal">
                        Personal Details
                      </TabsTrigger>
                      <TabsTrigger value="professional">
                        Professional Details
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                First Name{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter first name"
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
                              <FormLabel>
                                Last Name{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter last name"
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
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
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
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {genderOptions.map((option) => (
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
                          name="personalEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Personal Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter personal email"
                                />
                              </FormControl>
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
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select blood group" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {bloodGroupOptions.map((option) => (
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
                          name="mobileNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Mobile Number{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <PhoneInput
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  onCountryChange={(country) =>
                                    form.setValue("countryCode", country)
                                  }
                                  countryCode={form.watch("countryCode")}
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
                              <FormLabel>
                                Alternate Mobile Number{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <PhoneInput
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  countryCodes={countryCodes}
                                  placeholder="Enter alternate mobile number"
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
                              <FormLabel>
                                Emergency Contact Name{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter emergency name"
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
                              <FormLabel>
                                Emergency Contact Number{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <PhoneInput
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  countryCodes={countryCodes}
                                  placeholder="Enter emergency contact number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Current Address Fields */}
                        <div className="col-span-2">
                          <h3 className="text-lg font-semibold mb-2">
                            Current Address
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="currentAddress.addressLine1"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address Line 1</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter address line 1"
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
                                      placeholder="Enter address line 2"
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
                                  <FormLabel>Landmark</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter landmark"
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
                                      placeholder="Enter zipcode"
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
                                      placeholder="Enter state"
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
                                      placeholder="Enter district"
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
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field?.value as string}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select nationality" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {countryOptions.map((country) => (
                                        <SelectItem
                                          key={country}
                                          value={country}
                                        >
                                          {country}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Permanent Address Fields */}
                        <div className="col-span-2">
                          <h3 className="text-lg font-semibold mb-2">
                            Permanent Address
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="permanentAddress.addressLine1"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address Line 1</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter address line 1"
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
                                      placeholder="Enter address line 2"
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
                                      placeholder="Enter landmark"
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
                                      placeholder="Enter zipcode"
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
                                      placeholder="Enter state"
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
                                      placeholder="Enter district"
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
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field?.value as string}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select nationality" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {countryOptions.map((country) => (
                                        <SelectItem
                                          key={country}
                                          value={country}
                                        >
                                          {country}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
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
                              <FormLabel>
                                Employee ID{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Enter Employee ID (start with MG or mg)"
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
                              <FormLabel>
                                Professional Email{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter Professional email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dateOfJoining"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                              <FormLabel>Date of Joining</FormLabel>
                              <FormControl>
                                <DatePicker
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                />
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
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  if (value !== "Intern") {
                                    form.setValue("internshipDuration", null);
                                    form.setValue("internshipEndDate", null);
                                  }
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select employment type" />
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
                        {form.watch("employmentType") === "Intern" && (
                          <>
                            <FormField
                              control={form.control}
                              name="internshipDuration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Internship Period</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select internship period" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="6 months">
                                        6 months
                                      </SelectItem>
                                      <SelectItem value="1 year">
                                        1 year
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="internshipEndDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                  <FormLabel>Internship End Date</FormLabel>
                                  <FormControl>
                                    <DatePicker
                                      value={field.value}
                                      onChange={(date) => field.onChange(date)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Role <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
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
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {departments.map((department) => (
                                    <SelectItem
                                      key={department}
                                      value={department}
                                    >
                                      {department}
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
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select designation" />
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
                          name="reportingTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reporting To</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter reporting manager ID"
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
                                defaultValue={field.value ? "true" : "false"}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select option" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="true">Yes</SelectItem>
                                  <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shiftTiming"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Shift Timing</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select shift timing" />
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
                          name="branch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Branch <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select branch" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {branchOptions.map((branch) => (
                                    <SelectItem key={branch} value={branch}>
                                      {branch}
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
                          name="primarySkills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Skills</FormLabel>
                              <FormControl>
                                <TagInput
                                  initialTags={field.value}
                                  onTagsChange={(tags) => field.onChange(tags)}
                                />
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
                                <TagInput
                                  initialTags={field.value}
                                  onTagsChange={(tags) => field.onChange(tags)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button type="submit">Submit Onboard</Button>
                </form>
              </Form>
            ) : (
              <div>
                <UploadBulkOnboardForm />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
