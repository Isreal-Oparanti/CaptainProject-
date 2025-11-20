"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { getEmployees, getAttendance } from "@/data/attendanceStore";

// Register Chart.js items
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    setEmployees(getEmployees());
    setAttendanceData(getAttendance());
  }, []);

  /** -----------------------------
   *  STAFF COUNTS
   * ----------------------------- */
  const totalStaff = employees.length;

  const today = new Date().toISOString().split("T")[0];

  const todaysAttendance = attendanceData.filter((a) => a.date === today);

  const presentCount = todaysAttendance.filter(
    (a) => a.status === "Present"
  ).length;
  const lateCount = todaysAttendance.filter((a) => a.status === "Late").length;
  const absentCount = totalStaff - (presentCount + lateCount);

  /** -----------------------------
   *  WEEKLY SUMMARY (MON–FRI)
   * ----------------------------- */
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const getDayAttendanceCount = (dayName) => {
    return attendanceData.filter((a) => {
      const day = new Date(a.date).toLocaleString("en-US", {
        weekday: "short",
      });
      return day === dayName;
    }).length;
  };

  const weeklyData = days.map((d) => getDayAttendanceCount(d));

  /** -----------------------------
   *  BAR CHART CONFIG (WEEKLY)
   * ----------------------------- */
  const barChartData = {
    labels: days,
    datasets: [
      {
        label: "Attendance Count",
        data: weeklyData,
        backgroundColor: "#4A90E2",
      },
    ],
  };

  /** -----------------------------
   *  TODAY STACKED BAR
   * ----------------------------- */
  const todayStackedData = {
    labels: ["Today"],
    datasets: [
      {
        label: "Present",
        data: [presentCount],
        backgroundColor: "#2ecc71",
      },
      {
        label: "Late",
        data: [lateCount],
        backgroundColor: "#f1c40f",
      },
      {
        label: "Absent",
        data: [absentCount],
        backgroundColor: "#e74c3c",
      },
    ],
  };

  const todayStackedOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return (
    <div className="attendance-dashboard">
      <h1>Attendance Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="summary-cards">
        <div className="card total">
          <h2>{totalStaff}</h2>
          <p>Total Staff</p>
        </div>

        <div className="card present">
          <h2>{presentCount}</h2>
          <p>Present Today</p>
        </div>

        <div className="card late">
          <h2>{lateCount}</h2>
          <p>Late Today</p>
        </div>

        <div className="card absent">
          <h2>{absentCount}</h2>
          <p>Absent Today</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts">
        <div className="chart">
          <h3>Attendance Summary (Mon–Fri)</h3>
          <Bar data={barChartData} />
        </div>

        <div className="chart">
          <h3>Today’s Attendance</h3>
          <Bar data={todayStackedData} options={todayStackedOptions} />
        </div>
      </div>
    </div>
  );
}
