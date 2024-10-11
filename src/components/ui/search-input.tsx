import { Search } from "lucide-react";
import React from "react";
import { InputProps } from "./input";
import { cn } from "@/lib/utils";

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 items-center rounded-md border border-input bg-background px-3  text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        <Search className="h-[20px] w-[20px]" />
        <input
          {...props}
          type="search"
          ref={ref}
          className="w-full p-2 ml-2 placeholder:text-muted-foreground bg-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
