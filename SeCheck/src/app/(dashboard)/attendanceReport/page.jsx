// "use client";
// import { useState, useEffect } from "react";
// import { getAttendance } from "@/data/attendanceStore";

// export default function AttendanceReport() {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Load attendance data from shared store
//   useEffect(() => {
//     setAttendanceData(getAttendance());
//   }, []);

//   const toMinutes = (timeStr) => {
//     if (!timeStr || timeStr === "-" || timeStr === "") return null;

//     const parts = timeStr.split(" ");
//     if (parts.length !== 2) return null;

//     const [time, modifier] = parts;
//     let [hours, minutes] = time.split(":").map(Number);

//     if (modifier === "PM" && hours !== 12) hours += 12;
//     if (modifier === "AM" && hours === 12) hours = 0;

//     return hours * 60 + minutes;
//   };

//   const getTotalTime = (checkins = [], checkouts = []) => {
//     if (!checkins.length || !checkouts.length) return "-";

//     const firstIn = toMinutes(checkins[0]);
//     const lastOut = toMinutes(checkouts[checkouts.length - 1]);

//     if (firstIn === null || lastOut === null || lastOut <= firstIn) return "-";

//     const diff = lastOut - firstIn;
//     const hours = Math.floor(diff / 60);
//     const minutes = diff % 60;

//     return `${hours}h ${minutes}m`;
//   };

//   const getRemark = (status, checkins = [], checkouts = []) => {
//     if (status === "Absent") return "Absent";
//     if (!checkins.length || !checkouts.length) return "Pending";

//     const firstCheckin = checkins[0];
//     const inMin = toMinutes(firstCheckin);

//     if (inMin === null) return "Pending";

//     return inMin <= 540 ? "On Time" : "Late Arrival";
//   };

//   const statusColor = (status) => {
//     if (status === "Present") return "status-present";
//     if (status === "Late") return "status-late";
//     if (status === "Absent") return "status-absent";
//     return "";
//   };

//   const filteredData = attendanceData.filter((item) =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="attendance-container">
//       <h1 className="title">Attendance Report</h1>

//       <div className="attendance-search">
//         <input
//           type="text"
//           placeholder="Search by employee name..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="search-input"
//         />
//       </div>

//       <table className="attendance-table">
//         <thead>
//           <tr>
//             <th>Employee</th>
//             <th>Status</th>
//             <th>Check-Ins</th>
//             <th>Check-Outs</th>
//             <th>Total Hours</th>
//             <th>Remarks</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredData.map((item, index) => {
//             const totalTime = getTotalTime(item.checkins, item.checkouts);
//             const remark = getRemark(
//               item.status,
//               item.checkins,
//               item.checkouts
//             );

//             return (
//               <tr key={index}>
//                 <td>{item.name}</td>
//                 <td className={statusColor(item.status)}>{item.status}</td>
//                 <td>
//                   {item.checkins?.length ? item.checkins.join(", ") : "-"}
//                 </td>
//                 <td>
//                   {item.checkouts?.length ? item.checkouts.join(", ") : "-"}
//                 </td>
//                 <td>{totalTime}</td>
//                 <td>{remark}</td>
//               </tr>
//             );
//           })}

//           {filteredData.length === 0 && (
//             <tr>
//               <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
//                 No records found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { getAttendance } from "@/data/attendanceStore";

export default function AttendanceReport() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load attendance data from shared store
  useEffect(() => {
    setAttendanceData(getAttendance());
  }, []);

  const toMinutes = (timeStr) => {
    if (!timeStr || timeStr === "-" || timeStr === "") return null;

    const parts = timeStr.split(" ");
    if (parts.length !== 2) return null;

    const [time, modifier] = parts;
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const getTotalTime = (checkins = [], checkouts = []) => {
    if (!checkins.length || !checkouts.length) return "-";

    const firstIn = toMinutes(checkins[0]);
    const lastOut = toMinutes(checkouts[checkouts.length - 1]);

    if (firstIn === null || lastOut === null || lastOut <= firstIn) return "-";

    const diff = lastOut - firstIn;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}h ${minutes}m`;
  };

  const getRemark = (status, checkins = [], checkouts = []) => {
    if (status === "Absent") return "Absent";
    if (!checkins.length || !checkouts.length) return "Pending";

    const firstCheckin = checkins[0];
    const inMin = toMinutes(firstCheckin);

    if (inMin === null) return "Pending";

    return inMin <= 540 ? "On Time" : "Late Arrival";
  };

  const statusColor = (status) => {
    if (status === "Present") return "status-present";
    if (status === "Late") return "status-late";
    if (status === "Absent") return "status-absent";
    return "";
  };

  const filteredData = attendanceData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Clear Report
  const clearReport = () => {
    if (!window.confirm("Are you sure you want to clear the report?")) return;
    localStorage.removeItem("attendanceData");
    setAttendanceData([]);
  };

  // Export to CSV (Excel compatible)
  const exportToCSV = () => {
    if (!attendanceData.length) {
      alert("No data to export!");
      return;
    }

    const header = [
      "Employee",
      "Status",
      "Check-Ins",
      "Check-Outs",
      "Total Hours",
      "Remarks",
    ];
    const rows = attendanceData.map((item) => [
      item.name,
      item.status,
      item.checkins?.join(", ") || "-",
      item.checkouts?.join(", ") || "-",
      getTotalTime(item.checkins, item.checkouts),
      getRemark(item.status, item.checkins, item.checkouts),
    ]);

    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Attendance_Report.csv";
    link.click();
  };

  return (
    <div className="attendance-container">
      <h1 className="title">Attendance Report</h1>

      <div className="attendance-search">
        <input
          type="text"
          placeholder="Search by employee name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Status</th>
            <th>Check-Ins</th>
            <th>Check-Outs</th>
            <th>Total Hours</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item, index) => {
            const totalTime = getTotalTime(item.checkins, item.checkouts);
            const remark = getRemark(
              item.status,
              item.checkins,
              item.checkouts
            );

            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td className={statusColor(item.status)}>{item.status}</td>
                <td>
                  {item.checkins?.length ? item.checkins.join(", ") : "-"}
                </td>
                <td>
                  {item.checkouts?.length ? item.checkouts.join(", ") : "-"}
                </td>
                <td>{totalTime}</td>
                <td>{remark}</td>
              </tr>
            );
          })}

          {filteredData.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Buttons below the table */}
      <div className="report-buttons">
        <button className="clear-btn" onClick={clearReport}>
          Clear Report
        </button>
        <button className="export-btn" onClick={exportToCSV}>
          Export to Excel
        </button>
      </div>
    </div>
  );
}
