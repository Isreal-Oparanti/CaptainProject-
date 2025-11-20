"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "fa-grip" },
    { href: "/employees", label: "Employee", icon: "fa-user" },
    { href: "/attendance", label: "Attendance", icon: "fa-book" },
    {
      href: "/attendanceReport",
      label: "Attendance Report",
      icon: "fa-check-to-slot",
    },
  ];

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`sidebar-menu-item ${
                pathname === item.href ? "active" : ""
              }`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
