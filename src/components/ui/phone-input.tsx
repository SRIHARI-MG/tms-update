import React from "react";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface PhoneInputProps {
  value: string | { number: string; countryCode: string } | null;
  onChange: (value: string | { number: string; countryCode: string }) => void;
  onCountryChange?: (country: string) => void;
  countryCode?: string;
  readOnly?: boolean;
  countryCodes: string[];
  placeholder?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  onCountryChange,
  countryCode,
  readOnly,
  countryCodes,
  placeholder,
}) => {
  const isObjectValue = typeof value === "object" && value !== null;
  const phoneNumber = isObjectValue ? value.number : value || "";
  const selectedCountryCode = isObjectValue
    ? value.countryCode
    : countryCode || "+91";

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (isObjectValue) {
      onChange({ number: newValue, countryCode: selectedCountryCode });
    } else {
      onChange(newValue);
    }
  };

  const handleCountryChange = (newCountryCode: string) => {
    if (isObjectValue) {
      onChange({ number: phoneNumber, countryCode: newCountryCode });
    } else if (onCountryChange) {
      onCountryChange(newCountryCode);
    }
  };

  return (
    <div className="flex w-full">
      <Select
        value={selectedCountryCode}
        onValueChange={handleCountryChange}
        disabled={readOnly}
      >
        <SelectTrigger className="w-[80px] flex-shrink-0">
          <SelectValue placeholder={selectedCountryCode} />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((code: string) => (
            <SelectItem key={code} value={code}>
              {code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="text"
        value={phoneNumber}
        onChange={handlePhoneChange}
        readOnly={readOnly}
        className={`flex-grow ml-2 ${
          readOnly ? "bg-primary/5 text-gray-700" : ""
        } border-gray-300`}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PhoneInput;
