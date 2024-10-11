import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayoutPage";
import api from "@/api/apiService";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .refine(
      (value) => {
        return /^[a-zA-Z0-9._%+-]+@mind-graph\.com$/.test(value);
      },
      {
        message: "Email must be in the format user@mind-graph.com",
      }
    ),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [success, setSuccess] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async () => {
    const values = form.getValues();
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      const response = await api.post(
        "/api/v1/authentication/forgot-password",
        formData
      );
      if (response.data.status === "OK") {
        setSuccess(true);
        const responseData = response?.data?.response;
        toast({
          title: "Success",
          description: responseData?.message,
          variant: "default",
          className: "fixed bottom-4 right-4  max-w-sm",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
        className: "fixed bottom-4 right-4  max-w-sm",
      });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      const response = await api.post(
        "/api/v1/authentication/forgot-password",
        formData
      );
      if (response.data.status === "OK") {
        setSuccess(true);
        const responseData = response?.data?.response;
        toast({
          title: "Success",
          description: responseData?.message,
          variant: "default",
          className: "fixed bottom-4 right-4  max-w-sm",
        });
        navigate("/");
      }
    } catch (error) {
      setSuccess(false);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
        className: "fixed bottom-4 right-4  max-w-sm",
      });
    }
  }

  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email to reset your password."
    >
      <Card className="w-full max-w-md bg-background border-none shadow-lg">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {form.formState.errors.root.message}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <>
                  <Alert className="w-full flex items-center justify-between bg-green-100 border-green-600">
                    <AlertDescription>
                      Password reset link sent to your email.
                    </AlertDescription>
                    <Button>Resend</Button>
                  </Alert>
                </>
              )}
              {!success && (
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </AuthLayout>
  );
}
