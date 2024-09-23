"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const params = useParams();
  const pathname = usePathname();

  // Reordered routes based on priority
  const routes = [
    {
      href: `/${params.storeId}`,
      label: `Dashboard`,
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: `Orders`,
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/products`,
      label: `Products`,
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/offers`,
      label: `Offers`,
      active: pathname === `/${params.storeId}/offers`,
    },
    {
      href: `/${params.storeId}/reviews`,
      label: `Reviews`,
      active: pathname === `/${params.storeId}/reviews`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: `Categories`,
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/flavors`,
      label: `Flavors`,
      active: pathname === `/${params.storeId}/flavors`,
    },
    {
      href: `/${params.storeId}/weights`,
      label: `Weights`,
      active: pathname === `/${params.storeId}/weights`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: `Billboards`,
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: `Settings`,
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
