'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const attendanceData = [
    { id: 1, name: 'Gabriel John', department: 'ICT' },
    { id: 2, name: 'Centro comercial Moctezuma', department: 'Francisco Chang' },
    { id: 3, name: 'Ernst Handel', department: 'Roland Mendel' },
    { id: 4, name: 'Island Trading', department: 'Helen Bennett' },
    { id: 5, name: 'Laughing Bacchus Winecellars', department: 'Yoshi Tannamuri' },
    { id: 6, name: 'Magazzini Alimentari Riuniti', department: 'Giovanni Rovelli' },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="title">Attendance Log</h1>
        <div className="btn4">
          <a href="#" className="add-staff">Add Staff</a>
        </div>
      </div>                

      <h2>Daily Attendance Report</h2>

      <table className="Attendance-Sheet">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Name</th>
            <th>Department</th>
            <th className="space">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((person, index) => (
            <tr key={person.id}>
              <td>{index + 1}.</td>
              <td>{person.name}</td>
              <td>{person.department}</td>
              <td>
                <ul className="status">
                  <li className="status-line"><a href="#" className="status-item status-item-1">Present</a></li>
                  <li className="status-line"><a href="#" className="status-item status-item-2">Absent</a></li>
                  <li className="status-line"><a href="#" className="status-item status-item-3">Temporal Out</a></li>
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="btn5">
        <a href="#" className="view-all">View More</a>
      </div>
    </div>
  );
}