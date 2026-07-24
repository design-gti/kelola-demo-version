// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn, filterFigmaProps } from "./utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "flex items-center gap-2 font-subtitle select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className,
    )}
    {...filterFigmaProps(props)}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };