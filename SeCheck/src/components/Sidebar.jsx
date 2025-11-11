'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'fa-grip' },
    { href: '/employees', label: 'Employee', icon: 'fa-user' },
    { href: '/departments', label: 'Department', icon: 'fa-building' },
    { href: '/attendance', label: 'Attendance', icon: 'fa-book' },
    { href: '/reports', label: 'Attendance Report', icon: 'fa-check-to-slot' },
    { href: '/settings', label: 'Settings', icon: 'fa-youtube' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
      
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link 
              href={item.href} 
              className={`sidebar-menu-item ${pathname === item.href ? 'active' : ''}`}
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