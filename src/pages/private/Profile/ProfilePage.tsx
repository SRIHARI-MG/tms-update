import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  FileText,
  Award,
  Key,
  LogOut,
  Edit,
  X,
  CheckCircle,
  Camera,
  ChevronUp,
  ChevronDown,
  User2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TagInput from "@/components/ui/tag-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/api/apiService";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { handleLogout } from "@/utils/authHandler";
import PageIndicator from "@/components/ui/page-indicator";
import { useUser, useUserActions } from "@/layout/Header";

const BankDetailsSection = lazy(() => import("./BankDetailsSection"));
const ChangePasswordSection = lazy(() => import("./ChangePasswordSection"));
const PhoneInput = lazy(() => import("@/components/ui/phone-input"));
const DocumentsSection = lazy(() => import("./DocumentsSection"));
const CertificatesSection = lazy(() => import("./CertificatesSection"));

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
  skills?: string[];
  employmentType?: string;
  department?: string;
  internshipEndDate: string;
  internshipDuration: string;
  shiftTiming: string;
  willingToTravel: boolean;
  primaryProject: string;
  projects: string[];
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

interface DocumentDetails {
  number: string;
  name: string;
  file: File | null;
}

interface AadharDetails extends DocumentDetails {
  mobileNumber: string;
}

interface Documents {
  aadhar: AadharDetails;
  pan: DocumentDetails;
  passport: DocumentDetails;
}

const formSections = [
  {
    title: "Personal Details",
    keys: [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "mobileNumber",
      "alternateMobileNumber",
      "personalEmail",
      "bloodGroup",
      "emergencyContactPersonName",
      "emergencyContactMobileNumber",
      "currentAddressLine1",
      "currentAddressLine2",
      "currentAddressLandmark",
      "currentAddressNationality",
      "currentAddressState",
      "currentAddressDistrict",
      "currentAddressZipcode",
      "permanentAddressLine1",
      "permanentAddressLine2",
      "permanentAddressLandmark",
      "permanentAddressNationality",
      "permanentAddressState",
      "permanentAddressDistrict",
      "permanentAddressZipcode",
    ],
  },
  {
    title: "Professional Details",
    keys: [
      "userId",
      "email",
      "dateOfJoining",
      "employmentType",
      "internshipDuration",
      "internshipEndDate",
      "designation",
      "shiftTiming",
      "willingToTravel",
      "reportingManagerEmail",
      "skills",
    ],
  },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userDetails } = useUser();
  const { updateUserDetails } = useUserActions();
  const [selectedNav, setSelectedNav] = useState("Profile Details");
  const [isEditing, setIsEditing] = useState(false);
  const [activePage, setActivePage] = useState(formSections[0].title);
  const [editedDetails, setEditedDetails] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [isEditingDocuments, setIsEditingDocuments] = useState<boolean>(false);

  const [phoneNumbers, setPhoneNumbers] = useState({
    mobileNumber: {
      countryCode: "",
      number: "",
    },
    alternateMobileNumber: {
      countryCode: "",
      number: "",
    },
    emergencyContactMobileNumber: {
      countryCode: "",
      number: "",
    },
  });

  useEffect(() => {
    if (userDetails) {
      setEditedDetails({
        ...userDetails,
        // Add address fields
        currentAddressLine1: userDetails.currentAddressLine1 || "",
        currentAddressLine2: userDetails.currentAddressLine2 || "",
        currentAddressLandmark: userDetails.currentAddressLandmark || "",
        currentAddressNationality: userDetails.currentAddressNationality || "",
        currentAddressZipcode: userDetails.currentAddressZipcode || "",
        currentAddressState: userDetails.currentAddressState || "",
        currentAddressDistrict: userDetails.currentAddressDistrict || "",
        permanentAddressLine1: userDetails.permanentAddressLine1 || "",
        permanentAddressLine2: userDetails.permanentAddressLine2 || "",
        permanentAddressLandmark: userDetails.permanentAddressLandmark || "",
        permanentAddressNationality:
          userDetails.permanentAddressNationality || "",
        permanentAddressZipcode: userDetails.permanentAddressZipcode || "",
        permanentAddressState: userDetails.permanentAddressState || "",
        permanentAddressDistrict: userDetails.permanentAddressDistrict || "",
      });

      setPhoneNumbers({
        mobileNumber: {
          countryCode: userDetails.countryCode || "",
          number: userDetails.mobileNumber || "",
        },
        alternateMobileNumber: {
          countryCode: userDetails.alternateMobileNumberCountryCode || "",
          number: userDetails.alternateMobileNumber || "",
        },
        emergencyContactMobileNumber: {
          countryCode:
            userDetails.emergencyContactMobileNumberCountryCode || "",
          number: userDetails.emergencyContactMobileNumber || "",
        },
      });
    }
  }, [userDetails]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(userDetails?.profileUrl);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    setUserRole(localStorage.getItem("role") || "");
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const isFieldEditable = (key: string) => {
    const nonEditableFields = [
      "userId",
      "email",
      "dateOfJoining",
      "employmentType",
      "internshipDuration",
      "internshipEndDate",
      "designation",
      "reportingManagerEmail",
      "shiftTiming",
    ];
    return !nonEditableFields.includes(key);
  };

  const navItems = [
    { name: "Profile Details", icon: User2 },
    { name: "Bank Details", icon: Briefcase },
    { name: "Documents", icon: FileText },
    { name: "Certifications", icon: Award },
    { name: "Change Password", icon: Key },
  ];

  const countryCodes = ["+91", "+65", "+60", "+1", "+63"];
  const genderOptions = ["Male", "Female", "Others"];
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
  const willingToTravelOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];
  const employmentTypeOptions = [
    "Intern",
    "Full-time",
    "Part-time",
    "Consultant",
  ];
  const shiftTimeOptions = [
    "6.30 AM - 3.30 PM",
    "8.30 AM - 5.30 PM",
    "9.30 AM - 6.30 PM",
    "Flexible Shift",
  ];

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

  const handlePhoneChange = (field: any, value: any) => {
    setPhoneNumbers((prev) => ({ ...prev, [field]: value }));
    setEditedDetails((prev: any) => ({
      ...prev,
      [field]: value.number,
      [`${field}CountryCode`]: value.countryCode,
    }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      // If cancelling, reset the edited details to current userDetails
      setEditedDetails({
        ...userDetails,
        currentAddressLine1: userDetails?.currentAddressLine1 || "",
        currentAddressLine2: userDetails?.currentAddressLine2 || "",
        currentAddressLandmark: userDetails?.currentAddressLandmark || "",
        currentAddressNationality: userDetails?.currentAddressNationality || "",
        currentAddressZipcode: userDetails?.currentAddressZipcode || "",
        currentAddressState: userDetails?.currentAddressState || "",
        currentAddressDistrict: userDetails?.currentAddressDistrict || "",
        permanentAddressLine1: userDetails?.permanentAddressLine1 || "",
        permanentAddressLine2: userDetails?.permanentAddressLine2 || "",
        permanentAddressLandmark: userDetails?.permanentAddressLandmark || "",
        permanentAddressNationality:
          userDetails?.permanentAddressNationality || "",
        permanentAddressZipcode: userDetails?.permanentAddressZipcode || "",
        permanentAddressState: userDetails?.permanentAddressState || "",
        permanentAddressDistrict: userDetails?.permanentAddressDistrict || "",
      });
      setPhoneNumbers({
        mobileNumber: {
          countryCode: userDetails?.countryCode || "",
          number: userDetails?.mobileNumber || "",
        },
        alternateMobileNumber: {
          countryCode: userDetails?.alternateMobileNumberCountryCode || "",
          number: userDetails?.alternateMobileNumber || "",
        },
        emergencyContactMobileNumber: {
          countryCode:
            userDetails?.emergencyContactMobileNumberCountryCode || "",
          number: userDetails?.emergencyContactMobileNumber || "",
        },
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (key: string, value: any) => {
    setEditedDetails((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleTagsChange = (newTags: string[]) => {
    setEditedDetails((prev: any) => ({ ...prev, skills: newTags }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "mobileNumber",
      "alternateMobileNumber",
      "personalEmail",
      "bloodGroup",
      "emergencyContactPersonName",
      "emergencyContactMobileNumber",
      "currentAddressLine1",
      "currentAddressLine2",
      "currentAddressLandmark",
      "currentAddressNationality",
      "currentAddressState",
      "currentAddressDistrict",
      "currentAddressZipcode",
      "permanentAddressLine1",
      "permanentAddressLine2",
      "permanentAddressLandmark",
      "permanentAddressNationality",
      "permanentAddressState",
      "permanentAddressDistrict",
      "permanentAddressZipcode",
    ];

    requiredFields.forEach((field) => {
      if (!editedDetails[field] || editedDetails[field].trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestApproval = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    } else {
      console.log("Form validation failed");
    }
  };

  const getWillingToTravelDisplay = (value: boolean) => {
    return value ? "Yes" : "No";
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert("Please upload an image file (JPEG, PNG, or GIF)");
      return;
    }

    if (file.size > maxSize) {
      alert("File size should be less than 5MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);

      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);

      // Prepare form data for upload
      const formData = new FormData();
      formData.append("profileImage", file);

      // Make API call to update avatar
      await updateProfile(formData);

      console.log("Avatar upload complete");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
      // Revert to original avatar
      setAvatarUrl(userDetails?.profileUrl);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const updateProfile = async (formData?: FormData) => {
    try {
      let payload = new FormData();

      // Create the requestedData object
      const updatedProfileData: Partial<UserDetails> = {
        userId: editedDetails.userId,
        firstName: editedDetails.firstName,
        lastName: editedDetails.lastName,
        dateOfBirth: editedDetails.dateOfBirth,
        bloodGroup: editedDetails.bloodGroup,
        gender: editedDetails.gender,
        emergencyContactMobileNumberCountryCode:
          editedDetails.emergencyContactMobileNumberCountryCode,
        alternateMobileNumberCountryCode:
          editedDetails.alternateMobileNumberCountryCode,
        personalEmail: editedDetails.personalEmail,
        mobileNumber: editedDetails.mobileNumber,
        skills: editedDetails.skills,
        willingToTravel: editedDetails.willingToTravel,
        employmentType: editedDetails.employmentType,
        shiftTiming: editedDetails.shiftTiming,
        countryCode: editedDetails.countryCode,
        alternateMobileNumber: editedDetails.alternateMobileNumber,
        emergencyContactPersonName: editedDetails.emergencyContactPersonName,
        emergencyContactMobileNumber:
          editedDetails.emergencyContactMobileNumber,
        currentAddress: {
          addressLine1: editedDetails.currentAddressLine1,
          addressLine2: editedDetails.currentAddressLine2,
          landmark: editedDetails.currentAddressLandmark,
          nationality: editedDetails.currentAddressNationality,
          zipcode: editedDetails.currentAddressZipcode,
          state: editedDetails.currentAddressState,
          district: editedDetails.currentAddressDistrict,
        },
        permanentAddress: {
          addressLine1: editedDetails.permanentAddressLine1,
          addressLine2: editedDetails.permanentAddressLine2,
          landmark: editedDetails.permanentAddressLandmark,
          nationality: editedDetails.permanentAddressNationality,
          zipcode: editedDetails.permanentAddressZipcode,
          state: editedDetails.permanentAddressState,
          district: editedDetails.permanentAddressDistrict,
        },
      };

      // Always append requestedData
      payload.append("requestedData", JSON.stringify(updatedProfileData));

      // If formData is provided (avatar update), append the profileImage
      if (formData && formData.get("profileImage")) {
        payload.append("profileImage", formData.get("profileImage") as File);
      }

      let response;
      if (userRole === "ROLE_HR" || userRole === "ROLE_VIEWER") {
        response = await api.put("/api/v1/admin/profile-update", payload);
      } else {
        response = await api.put(
          "/api/v1/employee/profile-update-request",
          payload
        );
      }

      console.log("Profile update response:", response);
      updateUserDetails(response.data.response.data);

      // Handle success (e.g., show a success message, update local state)
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error (e.g., show error message)
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleConfirmedSubmission = async () => {
    await updateProfile();
    setIsEditing(false);
    setShowConfirmDialog(false);
    // You might want to show a success message or update the UI
  };

  const handleEditDocuments = () => setIsEditingDocuments(true);

  const handleSaveDocuments = async (updatedDocuments: Documents) => {
    try {
      // Make API call to save updated documents
      // await api.put(`/api/documents/${userDetails.userId}`, updatedDocuments);
      setIsEditingDocuments(false);
      // Optionally, update local state or refetch data
    } catch (error) {
      console.error("Error saving documents:", error);
      // Handle error (e.g., show error message)
    }
  };

  const handleCancelDocuments = () => setIsEditingDocuments(false);

  const handleLogoutClick = () => {
    handleLogout(navigate, showToast);
  };

  return (
    <div className="space-y-6 pb-5 px-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-6">
        <Card className="w-full h-fit md:w-3/12 border-none rounded-lg shadow-md">
          <CardHeader
            className={`mb-6 border-primary/15 border-b-2 py-5 ${
              isMobile ? "cursor-pointer" : ""
            }`}
            onClick={isMobile ? toggleMobileNav : undefined}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="relative group cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage
                      src={userDetails?.profileUrl}
                      alt={userDetails?.firstName}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {userDetails?.firstName.slice(0, 2).toUpperCase()}
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
                <div>
                  <h2 className="text-2xl font-semibold">{`${userDetails?.firstName} ${userDetails?.lastName}`}</h2>
                  <p className="text-md text-muted-foreground">
                    {userDetails?.role}
                  </p>
                </div>
              </div>
              {isMobile && (
                <div className="">
                  {isMobileNavOpen ? <ChevronUp /> : <ChevronDown />}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent
            className={`space-y-2 pb-5  ${
              isMobile && !isMobileNavOpen ? "hidden" : ""
            }`}
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant={selectedNav === item.name ? "secondary" : "ghost"}
                  className="w-full justify-start text-md hover:bg-primary/10 "
                  onClick={() => {
                    setSelectedNav(item.name);
                    if (isMobile) setIsMobileNavOpen(false);
                  }}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full text-md justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogoutClick}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </nav>
          </CardContent>
        </Card>
        <Card className="w-full md:w-3/4 shadow-md border-none relative">
          <div className="flex p-5 gap-2 justify-between ">
            <CardTitle>{selectedNav}</CardTitle>
            {selectedNav === "Profile Details" && (
              <div className="space-x-2 space-y-2">
                <Button
                  onClick={toggleEdit}
                  size="sm"
                  variant={`${isEditing ? "outline" : "default"}`}
                >
                  {isEditing ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
                {isEditing && (
                  <Button onClick={handleRequestApproval} size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Request for Approval
                  </Button>
                )}
              </div>
            )}
          </div>
          <CardContent>
            {selectedNav === "Profile Details" && (
              <div className="mt-5 space-y-6">
                <div className="flex justify-between items-center sm:flex-wrap">
                  <PageIndicator
                    pages={formSections.map((section) => section.title)}
                    activePage={activePage}
                    onPageChange={setActivePage}
                  />
                </div>

                <div className="space-y-2">
                  {formSections.map(
                    (section) =>
                      section.title === activePage && (
                        <div key={section.title}>
                          <p className="text-lg font-semibold">
                            {section.title}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {section.keys.map((key) => (
                              <div key={key} className="space-y-2">
                                <Label
                                  htmlFor={key}
                                  className="text-sm font-medium text-gray-500"
                                >
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                  {section.title !== "Professional Details" && (
                                    <span className="text-red-500">*</span>
                                  )}
                                </Label>

                                {key === "gender" ? (
                                  <Select
                                    value={editedDetails[key]}
                                    onValueChange={(value) =>
                                      handleInputChange(key, value)
                                    }
                                    disabled={!isEditing}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {genderOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : key === "bloodGroup" ? (
                                  <Select
                                    value={editedDetails[key]}
                                    onValueChange={(value) =>
                                      handleInputChange(key, value)
                                    }
                                    disabled={!isEditing}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select Blood Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {bloodGroupOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : key === "willingToTravel" ? (
                                  <Select
                                    value={editedDetails[key].toString()} // Convert boolean to string for Select
                                    onValueChange={
                                      (value) =>
                                        handleInputChange(key, value === "true") // Convert string back to boolean
                                    }
                                    disabled={
                                      !isEditing || !isFieldEditable(key)
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select">
                                        {getWillingToTravelDisplay(
                                          editedDetails[key]
                                        )}
                                      </SelectValue>
                                    </SelectTrigger>
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
                                ) : key === "employmentType" ? (
                                  <Select
                                    value={editedDetails[key]}
                                    onValueChange={(value) =>
                                      handleInputChange(key, value)
                                    }
                                    disabled={
                                      !isEditing || !isFieldEditable(key)
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select Employment Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {employmentTypeOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : key === "shiftTiming" ? (
                                  <Select
                                    value={editedDetails[key]}
                                    onValueChange={(value) =>
                                      handleInputChange(key, value)
                                    }
                                    disabled={
                                      !isEditing || !isFieldEditable(key)
                                    }
                                  >
                                    <SelectTrigger className="w-full ">
                                      <SelectValue placeholder="Select Shift Time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {shiftTimeOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : key === "mobileNumber" ||
                                  key === "alternateMobileNumber" ||
                                  key === "emergencyContactMobileNumber" ? (
                                  <Suspense fallback={<div></div>}>
                                    <PhoneInput
                                      value={phoneNumbers[key]}
                                      onChange={(value: any) =>
                                        handlePhoneChange(key, value)
                                      }
                                      readOnly={!isEditing}
                                      countryCodes={countryCodes}
                                      required={
                                        section.title !== "Professional Details"
                                      }
                                    />
                                  </Suspense>
                                ) : key === "skills" ? (
                                  !isEditing ? (
                                    <div className="flex flex-wrap gap-2">
                                      {(editedDetails[key] as string[]).map(
                                        (skill, index) => (
                                          <span
                                            key={index}
                                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                                          >
                                            {skill}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <TagInput
                                      initialTags={
                                        editedDetails[key] as string[]
                                      }
                                      onTagsChange={handleTagsChange}
                                    />
                                  )
                                ) : (
                                  <Input
                                    id={key}
                                    value={editedDetails[key] as string}
                                    onChange={(e) =>
                                      handleInputChange(key, e.target.value)
                                    }
                                    readOnly={
                                      !isEditing || !isFieldEditable(key)
                                    }
                                    className={`${
                                      !isEditing || !isFieldEditable(key)
                                        ? "bg-primary/5 text-gray-700"
                                        : ""
                                    } ${
                                      errors[key]
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                                    required={
                                      section.title !== "Professional Details"
                                    }
                                  />
                                )}
                                {errors[key] && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors[key]}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                  {/* <FormContent /> */}
                </div>
              </div>
            )}
            {selectedNav === "Bank Details" && (
              <Suspense fallback={<div></div>}>
                <BankDetailsSection />
              </Suspense>
            )}
            {selectedNav === "Documents" && (
              <Suspense fallback={<div></div>}>
                <DocumentsSection
                  isEditing={isEditingDocuments}
                  onEdit={handleEditDocuments}
                  onSave={() => {
                    handleSaveDocuments;
                  }}
                  onCancel={handleCancelDocuments}
                />
              </Suspense>
            )}
            {selectedNav === "Certifications" && (
              <Suspense fallback={<div></div>}>
                {" "}
                <CertificatesSection />
              </Suspense>
            )}
            {selectedNav === "Change Password" && (
              <Suspense fallback={<div></div>}>
                {" "}
                <ChangePasswordSection />
              </Suspense>
            )}
          </CardContent>
        </Card>
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Profile Update</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit these changes for approval? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmedSubmission}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
