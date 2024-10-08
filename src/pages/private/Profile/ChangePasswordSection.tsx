import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/api/apiService";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(1, "New Password is required"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordVisibility {
  oldPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

export default function ChangePasswordSection() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<PasswordVisibility>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const response = await api.post(
        "/api/v1/authentication/change-password",
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }
      );

      toast({
        title: "Success",
        description: "Password changed successfully",
        className: "fixed bottom-4 right-4  max-w-sm",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change password. Please try again.",
        className: "fixed bottom-4 right-4  max-w-sm",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-5">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative w-full md:w-[450px]">
                  <Input
                    {...field}
                    type={showPassword.oldPassword ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => togglePasswordVisibility("oldPassword")}
                  >
                    {!showPassword.oldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative w-full md:w-[450px]">
                  <Input
                    {...field}
                    type={showPassword.newPassword ? "text" : "password"}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => togglePasswordVisibility("newPassword")}
                  >
                    {!showPassword.newPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative w-full md:w-[450px]">
                  <Input
                    {...field}
                    type={showPassword.confirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    {!showPassword.confirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <Button type="submit">Change Password</Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
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
    </Form>
  );
}
