import { cn } from "@/lib/utils"; // Ensure this utility is available in your project

interface SpinnerProps {
  size?: "small" | "medium" | "large"; // Different size options
  className?: string; // For custom styling
}

export const Spinner = ({ size = "medium", className }: SpinnerProps) => {
  const sizes = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-4",
    large: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-t-primary border-neutral-200",
        sizes[size],
        className
      )}
    />
  );
};
