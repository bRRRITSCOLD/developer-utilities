import * as React from "react"

import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

function SensitiveTextInput <T>({ children = null, className, ...props }: T & { children?: React.ReactNode, className?: string; }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return <div className="relative col-span-3">
    {children}

    <Input
      { ...props}
      className={cn("col-span-3 text-ellipsis overflow-hidden text-nowrap text-gray-300", className)}
      type={showPassword ? "text" : "password"}
    />
    <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
      {showPassword ? (
        <Eye
          className="h-4 w-4 text-white"
          onClick={togglePasswordVisibility}
        />
      ) : (
        <EyeOff
          className="h-4 w-4 text-white"
          onClick={togglePasswordVisibility}
        />
      )}
    </div>
  </div>
}

export { Input, SensitiveTextInput }
