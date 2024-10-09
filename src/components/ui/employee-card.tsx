import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Locate, Mail, MapPin, User2, UserCircle } from "lucide-react";

interface EmployeeCardProps {
  avatar: string;
  employeeId: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: string;
  designation?: string;
  branch?: string;
}

export default function Component(
  props: EmployeeCardProps = {
    avatar: "/placeholder.svg?height=100&width=100",
    employeeId: "MGINXXXX",
    firstName: "XXXX",
    lastName: "YYY",
    email: "xxxxx@mind-graph.com",
    role: "Developer",
    designation: "Senior Software Engineer",
    branch: "Coimbatore",
  }
) {
  const {
    avatar,
    employeeId,
    firstName,
    lastName,
    email,
    role,
    designation,
    branch,
  } = props;

  return (
    <Card className="w-full max-w-md  bg-background border-none">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            className="object-cover"
            alt={`${firstName} ${lastName}`}
            src={avatar}
          />
          <AvatarFallback>
            {firstName[0]}
            {lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {firstName} {lastName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{designation}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-[20px_1fr] items-center gap-2">
          <User2 className="h-5 w-5" />
          <span>{employeeId}</span>
        </div>
        <div className="grid grid-cols-[20px_1fr] items-center gap-2">
          <Mail className="h-5 w-5" />
          <span>{email}</span>
        </div>
        <div className="grid grid-cols-[20px_1fr] items-center gap-2">
          <UserCircle className="h-5 w-5" />
          <span>{role}</span>
        </div>
        <div className="grid grid-cols-[20px_1fr] items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span>{branch}</span>
        </div>
      </CardContent>
    </Card>
  );
}
