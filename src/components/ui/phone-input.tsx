import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const PhoneInput = ({ value, onChange, readOnly, countryCodes }: any) => (
  <div className="flex">
    <Select
      value={value.countryCode}
      onValueChange={(selectedCode) =>
        onChange({ countryCode: selectedCode, number: value.number })
      }
      disabled={readOnly}
    >
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder={value.countryCode || "+1"} />
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
      type="tel"
      value={value.number}
      onChange={(e) =>
        onChange({ countryCode: value.countryCode, number: e.target.value })
      }
      readOnly={readOnly}
      className={`flex-1 ml-2 ${
        readOnly ? "bg-primary/5 text-gray-700" : ""
      } border-gray-300`}
    />
  </div>
);

export default PhoneInput;
