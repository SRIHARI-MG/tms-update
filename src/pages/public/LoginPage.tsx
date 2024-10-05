import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayoutPage";
import { Eye, EyeOff } from "lucide-react";
import api from "@/api/apiService";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { defaultRedirectPerRole, Roles } from "@/utils/roleConfig";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email or Employee Id is required" })
    .refine(
      (value) => {
        return (
          /^[a-zA-Z0-9._%+-]+@mind-graph\.com$/.test(value) ||
          /^MG/i.test(value)
        );
      },
      {
        message:
          "Email must be in the format user@mind-graph.com or start with MG",
      }
    ),
  password: z.string().min(1, { message: "Please enter the password" }),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      localStorage.clear();
      const response = await api.post(`/api/v1/authentication/login`, {
        email: values.email,
        password: values.password,
      });

      if (response.data?.response?.data?.token) {
        const token = response.data.response.data.token;
        const decoded: { Role: keyof typeof Roles } = jwtDecode(token);

        localStorage.setItem("authToken", token);
        localStorage.setItem("role", decoded.Role);

        toast({
          title: "Success",
          description: "Logged in successfully",
          variant: "default",
        });

        // Redirect based on role
        const redirectPath = defaultRedirectPerRole[decoded.Role] || "/";
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description:
          "Login failed. Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSubmit(values);
  }

  return (
    <AuthLayout
      title="Welcome Back"
      description="Login to access your account and manage your services."
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Employee ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Email or Employee ID"
                        {...field}
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-4 text-sm text-center">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
      <Toaster />
    </AuthLayout>
  );
}
