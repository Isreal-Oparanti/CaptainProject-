'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="header">
      <nav className="header--navbar">
        <div className="header--navbar__logo">
          <Link href="/">
            <img src="/img/logo.png" alt="SeCheck-Logo" className="logo" />
          </Link>
        </div>
        <ul className="navbar--link">
          <li><Link href="/" className="navbar--item">Home</Link></li>
          {isLoggedIn ? (
            <>
              <li><Link href="/dashboard" className="navbar--item">Dashboard</Link></li>
              <li><button onClick={handleLogout} className="navbar--item logout-btn">Logout</button></li>
            </>
          ) : (
            <li><Link href="/login" className="navbar--item">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
}