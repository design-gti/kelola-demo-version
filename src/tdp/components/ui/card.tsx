// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import * as React from "react";

import { cn, filterFigmaProps } from "./utils";

function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-lg shadow-card",
        className,
      )}
      {...filterFigmaProps(props)}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...filterFigmaProps(props)}
    >
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      className={cn("font-title", className)}
      {...filterFigmaProps(props)}
    >
      {children}
    </h4>
  );
}

function CardDescription({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      className={cn("text-muted-foreground", className)}
      {...filterFigmaProps(props)}
    >
      {children}
    </p>
  );
}

function CardAction({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...filterFigmaProps(props)}
    >
      {children}
    </div>
  );
}

function CardContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...filterFigmaProps(props)}
    >
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...filterFigmaProps(props)}
    >
      {children}
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};