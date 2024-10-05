import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

export default function ChangePasswordSection() {
  const [showPassword, setShowPassword] = useState<PasswordVisibility>({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your password change logic here
    console.log("Password change submitted");
  };

  const handleReset = () => {
    // Reset form logic here
    const form = document.getElementById("password-form") as HTMLFormElement;
    if (form) form.reset();
  };

  return (
    <form id="password-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <div className="relative w-full md:w-[450px]">
          <Input
            id="current-password"
            type={showPassword.current ? "text" : "password"}
            placeholder="Enter Current Password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => togglePasswordVisibility("current")}
          >
            {showPassword.current ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <div className="relative w-full md:w-[450px]">
          <Input
            id="new-password"
            type={showPassword.new ? "text" : "password"}
            placeholder="Enter New Password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => togglePasswordVisibility("new")}
          >
            {showPassword.new ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative w-full md:w-[450px]">
          <Input
            id="confirm-password"
            type={showPassword.confirm ? "text" : "password"}
            placeholder="Enter Confirm Password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => togglePasswordVisibility("confirm")}
          >
            {showPassword.confirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button type="submit">Submit</Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Clear
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="text-sm text-muted-foreground">
        <p className="font-semibold">Good Password Contains:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Include lower and uppercase characters</li>
          <li>Include at least 1 number or symbol</li>
          <li>Be at least 8 characters long</li>
          <li>Password should not be the same as the old password</li>
        </ul>
      </div>
    </form>
  );
}
