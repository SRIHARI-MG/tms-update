import api from "@/api/apiService";
import { toast } from "@/hooks/use-toast";
import React, { Suspense, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Camera, CheckCircle, Edit, X } from "lucide-react";
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
import ViewProjectDetailsById from "../../ViewProjectDetailsById";
import BankDetailsSection from "../../Profile/BankDetailsSection";
import ProfileDetailsSection from "../../Profile/ProfileDetailsSection";

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
  finalInteractionPdfName: string;
  finalInteractionPdfUrl: string;
  active: boolean;
  reportingManager: boolean;
  currencyCode: string;
  superAdmin: string;
  salary: string;
}

const EmployeeProfilePage = () => {
  const { userId } = useParams();
  const location = useLocation();
  const [employee, setEmployee] = useState<UserDetails>(() => {
    const employeeDetails = location.state.employeeDetails;
    return {
      ...employeeDetails,
      currentAddressLine1: employeeDetails.currentAddress?.addressLine1 || "",
      currentAddressLine2: employeeDetails.currentAddress?.addressLine2 || "",
      currentAddressLandmark: employeeDetails.currentAddress?.landmark || "",
      currentAddressNationality:
        employeeDetails.currentAddress?.nationality || "",
      currentAddressZipcode: employeeDetails.currentAddress?.zipcode || "",
      currentAddressState: employeeDetails.currentAddress?.state || "",
      currentAddressDistrict: employeeDetails.currentAddress?.district || "",
      permanentAddressLine1:
        employeeDetails.permanentAddress?.addressLine1 || "",
      permanentAddressLine2:
        employeeDetails.permanentAddress?.addressLine2 || "",
      permanentAddressLandmark:
        employeeDetails.permanentAddress?.landmark || "",
      permanentAddressNationality:
        employeeDetails.permanentAddress?.nationality || "",
      permanentAddressZipcode: employeeDetails.permanentAddress?.zipcode || "",
      permanentAddressState: employeeDetails.permanentAddress?.state || "",
      permanentAddressDistrict:
        employeeDetails.permanentAddress?.district || "",
    };
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(employee);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNav, setSelectedNav] = useState("Profile Details");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(employee?.profileUrl);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [phoneNumbers, setPhoneNumbers] = useState({
    mobileNumber: {
      countryCode: employee.countryCode || "",
      number: employee.mobileNumber || "",
    },
    alternateMobileNumber: {
      countryCode: employee.alternateMobileNumberCountryCode || "",
      number: employee.alternateMobileNumber || "",
    },
    emergencyContactMobileNumber: {
      countryCode: employee.emergencyContactMobileNumberCountryCode || "",
      number: employee.emergencyContactMobileNumber || "",
    },
  });

  useEffect(() => {
    setUserRole(localStorage.getItem("role") || "");
  });

  const toggleEdit = () => {
    if (isEditing) {
      setEditedDetails(employee);
      setPhoneNumbers({
        mobileNumber: {
          countryCode: employee.countryCode || "",
          number: employee.mobileNumber || "",
        },
        alternateMobileNumber: {
          countryCode: employee.alternateMobileNumberCountryCode || "",
          number: employee.alternateMobileNumber || "",
        },
        emergencyContactMobileNumber: {
          countryCode: employee.emergencyContactMobileNumberCountryCode || "",
          number: employee.emergencyContactMobileNumber || "",
        },
      });
    }
    setIsEditing(!isEditing);
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

  const handleRequestApproval = async () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    } else {
      console.log("Form validation failed");
    }
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
      window.location.reload();
      console.log("Avatar upload complete");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
      // Revert to original avatar
      setAvatarUrl(employee?.profileUrl);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const updateProfile = async (formData?: FormData) => {
    try {
      let payload = new FormData();

      // Transform skills into the required format
      const transformedSkills = [
        ...(editedDetails.primarySkills || []).map((skill) => ({
          skill,
          priority: 1,
        })),
        ...(editedDetails.secondarySkills || []).map((skill) => ({
          skill,
          priority: 2,
        })),
      ];

      // Create the requestedData object
      const updatedProfileData: Partial<UserDetails> = {
        userId: editedDetails.userId,
        firstName: editedDetails?.firstName,
        lastName: editedDetails?.lastName,
        bloodGroup: editedDetails?.bloodGroup,
        mobileNumber: editedDetails?.mobileNumber,
        alternateMobileNumber: editedDetails?.alternateMobileNumber,
        alternateMobileNumberCountryCode:
          editedDetails?.alternateMobileNumberCountryCode,
        emergencyContactMobileNumberCountryCode:
          editedDetails?.emergencyContactMobileNumberCountryCode,
        emergencyContactPersonName: editedDetails?.emergencyContactPersonName,
        emergencyContactMobileNumber:
          editedDetails?.emergencyContactMobileNumber,
        countryCode: editedDetails?.countryCode || employee?.countryCode,
        currencyCode: editedDetails?.currencyCode || employee?.currencyCode,
        email: editedDetails?.email,
        dateOfBirth: editedDetails?.dateOfBirth,
        dateOfJoining: editedDetails?.dateOfJoining,
        role: editedDetails?.role,
        designation: editedDetails?.designation,
        branch: editedDetails?.branch,
        reportingManagerEmail: editedDetails?.reportingManagerEmail,
        willingToTravel: editedDetails?.willingToTravel,
        skills: transformedSkills, // Use the transformed skills array
        department: editedDetails?.department,
        employmentType: editedDetails?.employmentType,
        internshipDuration: editedDetails?.internshipDuration,
        internshipEndDate: editedDetails?.internshipEndDate,
        shiftTiming: editedDetails?.shiftTiming,
        salary: editedDetails?.salary,
        currentAddress: {
          addressLine1: editedDetails?.currentAddressLine1,
          addressLine2: editedDetails?.currentAddressLine2,
          landmark: editedDetails?.currentAddressLandmark,
          nationality: editedDetails?.currentAddressNationality,
          zipcode: editedDetails?.currentAddressZipcode,
          state: editedDetails?.currentAddressState,
          district: editedDetails?.currentAddressDistrict,
        },
        permanentAddress: {
          addressLine1: editedDetails?.permanentAddressLine1,
          addressLine2: editedDetails?.permanentAddressLine2,
          landmark: editedDetails?.permanentAddressLandmark,
          nationality: editedDetails?.permanentAddressNationality,
          zipcode: editedDetails?.permanentAddressZipcode,
          state: editedDetails?.permanentAddressState,
          district: editedDetails?.permanentAddressDistrict,
        },
      };

      // Always append requestedData
      payload.append("updateDetails", JSON.stringify(updatedProfileData));

      // If formData is provided (avatar update), append the profileImage
      if (formData && formData.get("profileImage")) {
        payload.append("profileImage", formData.get("profileImage") as File);
      }

      const response = await api.put("/api/v1/admin/update-employee", payload);

      console.log("Profile update response:", response);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-start space-y-6 pb-5 px-4">
      <h1 className="text-2xl font-semibold">Employee Profile</h1>
      <div className="w-full">
        <Card className="w-full shadow-md border-none relative">
          <div className="flex p-5 gap-2 justify-between">
            <CardTitle>{selectedNav}</CardTitle>
          </div>
          <CardContent>
            <Tabs defaultValue="profileDetails" className="w-full">
              <TabsList>
                <TabsTrigger
                  value="profileDetails"
                  onClick={() => setSelectedNav("Profile Details")}
                >
                  Profile Details
                </TabsTrigger>
                <TabsTrigger
                  value="bankDetails"
                  onClick={() => setSelectedNav("Bank Details")}
                >
                  Bank Details
                </TabsTrigger>
                <TabsTrigger
                  value="projectsDetails"
                  onClick={() => setSelectedNav("Project Details")}
                >
                  Project Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profileDetails">
                <Suspense fallback={<div>Loading...</div>}>
                  {selectedNav === "Profile Details" && (
                    <div className="flex justify-between items-center mt-5">
                      <div
                        className="relative group cursor-pointer"
                        onClick={handleAvatarClick}
                      >
                        <Avatar className="h-28 w-28 border">
                          <AvatarImage
                            src={employee?.profileUrl}
                            alt={employee?.firstName}
                            className="object-cover"
                            loading="lazy"
                          />
                          <AvatarFallback>
                            {employee?.firstName.slice(0, 2).toUpperCase()}
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
                      <div className="flex gap-2">
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
                            Update Changes
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  <ProfileDetailsSection
                    isEditing={isEditing}
                    userDetails={employee}
                    editedDetails={editedDetails}
                    setEditedDetails={setEditedDetails}
                    setIsEditing={setIsEditing}
                    errors={errors}
                    phoneNumbers={phoneNumbers}
                    setPhoneNumbers={setPhoneNumbers}
                  />
                </Suspense>
              </TabsContent>

              <TabsContent value="bankDetails">
                <Suspense fallback={<div>Loading...</div>}>
                  <BankDetailsSection userId={(userId as string) || ""} />
                </Suspense>
              </TabsContent>

              <TabsContent value="projectsDetails">
                <ViewProjectDetailsById userId={userId} />
              </TabsContent>
            </Tabs>
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
};

export default EmployeeProfilePage;
