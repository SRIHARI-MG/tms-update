import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, X, CheckCircle } from "lucide-react";
import TagInput from "@/components/ui/tag-input";
import PageIndicator from "@/components/ui/page-indicator";
import PhoneInput from "@/components/ui/phone-input";

interface ProfileDetailsSectionProps {
  userDetails: any;
  editedDetails: any;
  setEditedDetails: React.Dispatch<React.SetStateAction<any>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleRequestApproval: () => void;
  errors: any;
  phoneNumbers: any;
  setPhoneNumbers: React.Dispatch<React.SetStateAction<any>>;
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
const countryCodes = ["+91", "+65", "+60", "+1", "+63"];

export default function ProfileDetailsSection({
  userDetails,
  editedDetails,
  setEditedDetails,
  isEditing,
  setIsEditing,
  handleRequestApproval,
  errors,
  phoneNumbers,
  setPhoneNumbers,
}: ProfileDetailsSectionProps) {
  const [activePage, setActivePage] = useState(formSections[0].title);

  const toggleEdit = () => {
    if (isEditing) {
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

  const handlePhoneChange = (field: any, value: any) => {
    setPhoneNumbers((prev: any) => ({ ...prev, [field]: value }));
    setEditedDetails((prev: any) => ({
      ...prev,
      [field]: value.number,
      [`${field}CountryCode`]: value.countryCode,
    }));
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

  const getWillingToTravelDisplay = (value: boolean) => {
    return value ? "Yes" : "No";
  };

  return (
    <div className="mt-5 space-y-6">
      <div className="flex justify-between items-center sm:flex-wrap">
        <PageIndicator
          pages={formSections.map((section) => section.title)}
          activePage={activePage}
          onPageChange={setActivePage}
        />
        {/* <div className="space-x-2 space-y-2">
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
        </div> */}
      </div>

      <div className="space-y-2">
        {formSections.map(
          (section) =>
            section.title === activePage && (
              <div key={section.title}>
                <p className="text-lg font-semibold">{section.title}</p>
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
                          value={editedDetails[key].toString()}
                          onValueChange={(value) =>
                            handleInputChange(key, value === "true")
                          }
                          disabled={!isEditing || !isFieldEditable(key)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select">
                              {getWillingToTravelDisplay(editedDetails[key])}
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
                          disabled={!isEditing || !isFieldEditable(key)}
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
                          disabled={!isEditing || !isFieldEditable(key)}
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
                        <PhoneInput
                          value={phoneNumbers[key]}
                          onChange={(value: any) =>
                            handlePhoneChange(key, value)
                          }
                          readOnly={!isEditing}
                          countryCodes={countryCodes}
                          required={section.title !== "Professional Details"}
                        />
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
                            initialTags={editedDetails[key] as string[]}
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
                          readOnly={!isEditing || !isFieldEditable(key)}
                          className={`${
                            !isEditing || !isFieldEditable(key)
                              ? "bg-primary/5 text-gray-700"
                              : ""
                          } ${
                            errors[key] ? "border-red-500" : "border-gray-300"
                          }`}
                          required={section.title !== "Professional Details"}
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
      </div>
    </div>
  );
}
