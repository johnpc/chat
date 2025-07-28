import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input className={`input ${className}`.trim()} ref={ref} {...props} />
    );
  },
);
Input.displayName = "Input";

export { Input };
