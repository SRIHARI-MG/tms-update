import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TagInput from "@/components/ui/tag-input";
import PageIndicator from "@/components/ui/page-indicator";
import PhoneInput from "@/components/ui/phone-input";
import DatePicker from "@/components/ui/date-picker";
import api from "@/api/apiService";

interface ProfileDetailsSectionProps {
  userDetails: any;
  editedDetails: any;
  setEditedDetails: React.Dispatch<React.SetStateAction<any>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
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
      "role",
      "designation",
      "dateOfJoining",
      "employmentType",
      "internshipDuration",
      "internshipEndDate",
      "shiftTiming",
      "willingToTravel",
      "reportingManagerEmail",
      "primarySkills",
      "secondarySkills",
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

export default function ProfileDetailsSection({
  userDetails,
  editedDetails,
  setEditedDetails,
  isEditing,
  setIsEditing,
  errors,
  phoneNumbers,
  setPhoneNumbers,
}: ProfileDetailsSectionProps) {
  const [activePage, setActivePage] = useState(formSections[0].title);
  const [userRole, setUserRole] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);

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

  useEffect(() => {
    setUserRole(localStorage.getItem("role") || "");
  });

  const handleSkillsChange = (
    skillType: "primarySkills" | "secondarySkills",
    newSkills: string[]
  ) => {
    setEditedDetails((prev: any) => ({ ...prev, [skillType]: newSkills }));
  };

  const handleInputChange = (key: string, value: any) => {
    setEditedDetails((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleTagsChange = (newTags: string[]) => {
    setEditedDetails((prev: any) => ({ ...prev, skills: newTags }));
  };

  const handleDateChange = (key: string, date: Date | undefined) => {
    setEditedDetails((prev: any) => ({ ...prev, [key]: date }));
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
    const nonEditableFields = ["userId"];

    if (userRole === "ROLE_HR") {
      // All fields are editable for HR except userId
      return !nonEditableFields.includes(key);
    } else {
      // For other roles, keep the original non-editable fields
      const otherRolesNonEditableFields = [
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
      if (key === "personalEmail" || key === "gender") {
        return false;
      }
      return !otherRolesNonEditableFields.includes(key);
    }
  };

  const getWillingToTravelDisplay = (value: boolean) => {
    return value ? "Yes" : "No";
  };

  const getPlaceholder = (key: string) => {
    const placeholders: { [key: string]: string } = {
      firstName: "Enter your first name",
      lastName: "Enter your last name",
      dateOfBirth: "YYYY-MM-DD",
      gender: "Select gender",
      personalEmail: "Enter your personal email",
      bloodGroup: "Select blood group",
      // Add more placeholders for other fields as needed
    };
    return (
      placeholders[key] ||
      `Enter ${key
        .replace(/([A-Z])/g, " $1")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`
    );
  };

  // Add a null check at the beginning of the component
  if (!userDetails) {
    return <div>No user details available.</div>;
  }

  return (
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
                <p className="text-lg font-semibold">{section.title}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {section.keys.map((key) => {
                    if (key.startsWith("currentAddress")) {
                      return null; // We'll handle current address separately
                    }
                    if (key.startsWith("permanentAddress")) {
                      return null; // We'll handle permanent address separately
                    }
                    return (
                      <div key={key} className="flex flex-col gap-2">
                        <Label
                          htmlFor={key}
                          className="text-sm font-medium text-gray-500"
                        >
                          {key.startsWith("currentAddress") ||
                          key.startsWith("permanentAddress")
                            ? ""
                            : key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                          {section.title !== "Professional Details" && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        {key === "dateOfBirth" ||
                        key === "dateOfJoining" ||
                        key === "internshipEndDate" ? (
                          <DatePicker
                            value={editedDetails[key]}
                            onChange={(date) => handleDateChange(key, date)}
                            readOnly={!isEditing || !isFieldEditable(key)}
                          />
                        ) : key === "gender" ? (
                          <Select
                            value={editedDetails[key]}
                            onValueChange={(value) =>
                              handleInputChange(key, value)
                            }
                            disabled={!isEditing || !isFieldEditable(key)}
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
                        ) : key === "role" ? (
                          <Select
                            value={editedDetails[key]}
                            onValueChange={(value) =>
                              handleInputChange(key, value)
                            }
                            disabled={!isEditing || !isFieldEditable(key)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : key === "designation" ? (
                          <Select
                            value={editedDetails[key]}
                            onValueChange={(value) =>
                              handleInputChange(key, value)
                            }
                            disabled={!isEditing || !isFieldEditable(key)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Designation" />
                            </SelectTrigger>
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
                        ) : key === "employmentType" ? (
                          <Select
                            value={editedDetails[key]}
                            onValueChange={(value) => {
                              handleInputChange(key, value);
                              if (value !== "Intern") {
                                setEditedDetails((prev: any) => ({
                                  ...prev,
                                  internshipDuration: null,
                                  internshipEndDate: null,
                                }));
                              }
                            }}
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
                        ) : key === "internshipDuration" &&
                          editedDetails.employmentType === "Intern" ? (
                          <Select
                            value={editedDetails[key]}
                            onValueChange={(value) =>
                              handleInputChange(key, value)
                            }
                            disabled={!isEditing || !isFieldEditable(key)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Internship Duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6 months">6 months</SelectItem>
                              <SelectItem value="1 year">1 year</SelectItem>
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
                            placeholder={getPlaceholder(key)}
                          />
                        ) : key === "primarySkills" ||
                          key === "secondarySkills" ? (
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
                              onTagsChange={(newTags) =>
                                handleSkillsChange(key, newTags)
                              }
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
                            placeholder={getPlaceholder(key)}
                          />
                        )}
                        {errors[key] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[key]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {section.title === "Personal Details" && (
                  <>
                    {/* Current Address Section */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Current Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {section.keys
                          .filter((key) => key.startsWith("currentAddress"))
                          .map((key) => (
                            <div key={key} className="flex flex-col gap-2">
                              <Label
                                htmlFor={key}
                                className="text-sm font-medium text-gray-500"
                              >
                                {key
                                  .replace("currentAddress", "")
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()
                                  .replace(/^./, (str) => str.toUpperCase())}
                                <span className="text-red-500">*</span>
                              </Label>
                              {/* Render input field for current address */}
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
                                  errors[key]
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                required={true}
                                placeholder={getPlaceholder(key)}
                              />
                              {errors[key] && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors[key]}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Permanent Address Section */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Permanent Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {section.keys
                          .filter((key) => key.startsWith("permanentAddress"))
                          .map((key) => (
                            <div key={key} className="flex flex-col gap-2">
                              <Label
                                htmlFor={key}
                                className="text-sm font-medium text-gray-500"
                              >
                                {key
                                  .replace("permanentAddress", "")
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()
                                  .replace(/^./, (str) => str.toUpperCase())}
                                <span className="text-red-500">*</span>
                              </Label>
                              {/* Render input field for permanent address */}
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
                                  errors[key]
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                required={true}
                                placeholder={getPlaceholder(key)}
                              />
                              {errors[key] && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors[key]}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
}
