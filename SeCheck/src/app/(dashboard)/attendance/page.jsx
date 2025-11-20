// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { getEmployees } from "@/data/attendanceStore";

// export default function AttendancePage() {
//   const router = useRouter();

//   const nowTime = () =>
//     new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   const [attendanceData, setAttendanceData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   // 🔹 Load employees only
//   useEffect(() => {
//     const employees = getEmployees();

//     const initialData = employees.map((emp) => ({
//       id: emp.id,
//       name: emp.name,
//       status: "-",
//       checkins: [],
//       checkouts: [],
//       inSession: false,
//     }));

//     setAttendanceData(initialData);
//   }, []);

//   // 🔹 Auto-close attendance at 11:59 PM
//   useEffect(() => {
//     const now = new Date();
//     const autoCloseTime = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate(),
//       23,
//       59,
//       0,
//       0
//     ); // today 11:59 PM

//     const timeout = autoCloseTime.getTime() - now.getTime();

//     if (timeout > 0) {
//       const timer = setTimeout(() => {
//         closeAttendanceForToday(true); // auto flag
//       }, timeout);

//       return () => clearTimeout(timer);
//     } else {
//       closeAttendanceForToday(true);
//     }
//   }, [attendanceData]);

//   // Handle Check-In
//   const handleCheckIn = (id) => {
//     setAttendanceData((prev) =>
//       prev.map((person) => {
//         if (person.id !== id || person.inSession) return person;

//         const timeStr = nowTime();
//         const status =
//           person.checkins.length === 0
//             ? new Date().getHours() >= 9
//               ? "Late"
//               : "Present"
//             : person.status;

//         return {
//           ...person,
//           status,
//           checkins: [...person.checkins, timeStr],
//           inSession: true,
//         };
//       })
//     );
//   };

//   // Handle Check-Out
//   const handleCheckOut = (id) => {
//     setAttendanceData((prev) =>
//       prev.map((person) => {
//         if (person.id !== id || !person.inSession) return person;

//         const timeStr = nowTime();
//         return {
//           ...person,
//           checkouts: [...person.checkouts, timeStr],
//           inSession: false,
//         };
//       })
//     );
//   };

//   // Close Attendance for Today
//   const closeAttendanceForToday = (isAuto = false) => {
//     const currentHour = new Date().getHours();
//     if (!isAuto && currentHour < 5) {
//       alert("Attendance can only be closed after 5 AM.");
//       return;
//     }

//     if (!isAuto) {
//       const proceed = window.confirm(
//         "Are you sure you want to close attendance for today?"
//       );
//       if (!proceed) return;
//     }

//     // 1️⃣ Save a copy for the report
//     const reportData = attendanceData.map((person) => {
//       const checkins = Array.isArray(person.checkins) ? person.checkins : [];
//       const checkouts = Array.isArray(person.checkouts) ? person.checkouts : [];

//       const finalCheckouts =
//         checkins.length > 0 && checkouts.length === 0
//           ? [
//               ...checkouts,
//               new Date().toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               }),
//             ]
//           : checkouts;

//       return {
//         ...person,
//         date: new Date().toISOString().split("T")[0], // add date for filtering
//         checkins: checkins.length === 0 ? ["-"] : checkins,
//         checkouts: finalCheckouts.length === 0 ? ["-"] : finalCheckouts,
//         status: checkins.length === 0 ? "Absent" : person.status || "Present",
//       };
//     });

//     // Save only for report
//     localStorage.setItem("attendanceData", JSON.stringify(reportData));

//     // 2️⃣ Reset the attendance page state for a new day (no localStorage overwrite)
//     const resetData = attendanceData.map((person) => ({
//       ...person,
//       checkins: [],
//       checkouts: [],
//       status: "-",
//       inSession: false,
//     }));

//     setAttendanceData(resetData);

//     // 3️⃣ Navigate to report
//     router.push("/attendanceReport");
//   };

//   // 🔹 View attendance by selected date
//   const handleViewDate = () => {
//     if (!selectedDate) {
//       alert("Please select a date to view attendance.");
//       return;
//     }

//     const allAttendance = JSON.parse(
//       localStorage.getItem("attendanceData") || "[]"
//     );

//     const filtered = allAttendance.filter((a) => a.date === selectedDate);

//     if (filtered.length === 0) {
//       alert("No attendance data found for this date.");
//     }

//     setFilteredData(filtered);
//   };

//   return (
//     <div className="report-container">
//       <h1 className="gap">Attendance</h1>

//       <div className="attendance-search">
//         <input
//           type="date"
//           className="date-input"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           placeholder="Select date"
//         />
//         <button className="view-btn" onClick={handleViewDate}>
//           View
//         </button>
//       </div>

//       <table className="attendance-table">
//         <thead>
//           <tr>
//             <th>S/N</th>
//             <th>Staff Name</th>
//             <th>Status</th>
//             <th>Check-In Times</th>
//             <th>Check-Out Times</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {(filteredData.length > 0 ? filteredData : attendanceData).map(
//             (person, index) => {
//               const checkins = Array.isArray(person.checkins)
//                 ? person.checkins
//                 : [];
//               const checkouts = Array.isArray(person.checkouts)
//                 ? person.checkouts
//                 : [];
//               const canCheckIn = !person.inSession && filteredData.length === 0;
//               const canCheckOut = person.inSession && filteredData.length === 0;

//               return (
//                 <tr key={person.id}>
//                   <td>{index + 1}</td>
//                   <td>{person.name}</td>
//                   <td>{person.status}</td>
//                   <td>{checkins.length > 0 ? checkins.join(", ") : "-"}</td>
//                   <td>{checkouts.length > 0 ? checkouts.join(", ") : "-"}</td>
//                   <td>
//                     <button
//                       className="checkin-btn"
//                       onClick={() => handleCheckIn(person.id)}
//                       disabled={!canCheckIn}
//                       style={{
//                         opacity: canCheckIn ? 1 : 0.6,
//                         pointerEvents: canCheckIn ? "auto" : "none",
//                       }}
//                     >
//                       Check In
//                     </button>

//                     <button
//                       className="checkout-btn"
//                       onClick={() => handleCheckOut(person.id)}
//                       disabled={!canCheckOut}
//                       style={{
//                         opacity: canCheckOut ? 1 : 0.6,
//                         pointerEvents: canCheckOut ? "auto" : "none",
//                       }}
//                     >
//                       Check Out
//                     </button>
//                   </td>
//                 </tr>
//               );
//             }
//           )}
//         </tbody>
//       </table>

//       <div>
//         <button
//           onClick={() => closeAttendanceForToday(false)}
//           className="close-attendance-btn"
//         >
//           Close Attendance for Today
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { getEmployees } from "@/data/attendanceStore";

// export default function AttendancePage() {
//   const router = useRouter();

//   const nowTime = () =>
//     new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   const [attendanceData, setAttendanceData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   // 🔹 Load employees only
//   useEffect(() => {
//     const employees = getEmployees();

//     const initialData = employees.map((emp) => ({
//       id: emp.id,
//       name: emp.name,
//       status: "-",
//       checkins: [],
//       checkouts: [],
//       inSession: false,
//     }));

//     setAttendanceData(initialData);
//   }, []);

//   // 🔹 Auto-close attendance at 11:59 PM
//   useEffect(() => {
//     const now = new Date();
//     const autoCloseTime = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate(),
//       23,
//       59,
//       0,
//       0
//     );

//     const timeout = autoCloseTime.getTime() - now.getTime();

//     if (timeout > 0) {
//       const timer = setTimeout(() => {
//         closeAttendanceForToday(true);
//       }, timeout);

//       return () => clearTimeout(timer);
//     } else {
//       closeAttendanceForToday(true);
//     }
//   }, [attendanceData]);

//   // Handle Check-In
//   const handleCheckIn = (id) => {
//     setAttendanceData((prev) =>
//       prev.map((person) => {
//         if (person.id !== id || person.inSession) return person;

//         const timeStr = nowTime();
//         const status =
//           person.checkins.length === 0
//             ? new Date().getHours() >= 9
//               ? "Late"
//               : "Present"
//             : person.status;

//         return {
//           ...person,
//           status,
//           checkins: [...person.checkins, timeStr],
//           inSession: true,
//         };
//       })
//     );
//   };

//   // Handle Check-Out
//   const handleCheckOut = (id) => {
//     setAttendanceData((prev) =>
//       prev.map((person) => {
//         if (person.id !== id || !person.inSession) return person;

//         const timeStr = nowTime();
//         return {
//           ...person,
//           checkouts: [...person.checkouts, timeStr],
//           inSession: false,
//         };
//       })
//     );
//   };

//   // Close Attendance for Today
//   const closeAttendanceForToday = (isAuto = false) => {
//     const currentHour = new Date().getHours();
//     if (!isAuto && currentHour < 5) {
//       alert("Attendance can only be closed after 5 AM.");
//       return;
//     }

//     if (!isAuto) {
//       const proceed = window.confirm(
//         "Are you sure you want to close attendance for today?"
//       );
//       if (!proceed) return;
//     }

//     const reportData = attendanceData.map((person) => {
//       const checkins = Array.isArray(person.checkins) ? person.checkins : [];
//       const checkouts = Array.isArray(person.checkouts) ? person.checkouts : [];

//       const finalCheckouts =
//         checkins.length > 0 && checkouts.length === 0
//           ? [
//               ...checkouts,
//               new Date().toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               }),
//             ]
//           : checkouts;

//       return {
//         ...person,
//         date: new Date().toISOString().split("T")[0],
//         checkins: checkins.length === 0 ? ["-"] : checkins,
//         checkouts: finalCheckouts.length === 0 ? ["-"] : finalCheckouts,
//         status: checkins.length === 0 ? "Absent" : person.status || "Present",
//       };
//     });

//     localStorage.setItem("attendanceData", JSON.stringify(reportData));

//     const resetData = attendanceData.map((person) => ({
//       ...person,
//       checkins: [],
//       checkouts: [],
//       status: "-",
//       inSession: false,
//     }));

//     setAttendanceData(resetData);

//     router.push("/attendanceReport");
//   };

//   // 🔹 View attendance by selected date
//   const handleViewDate = () => {
//     if (!selectedDate) {
//       alert("Please select a date to view attendance.");
//       return;
//     }

//     const allAttendance = JSON.parse(
//       localStorage.getItem("attendanceData") || "[]"
//     );

//     const filtered = allAttendance.filter((a) => a.date === selectedDate);

//     if (filtered.length === 0) {
//       alert("No attendance data found for this date.");
//     }

//     setFilteredData(filtered);
//   };

//   // 🔹 Clear filtered data to restore the page to live attendance
//   const handleClearFilter = () => {
//     setFilteredData([]);
//     setSelectedDate("");
//   };

//   return (
//     <div className="report-container">
//       <h1 className="gap">Attendance</h1>

//       <div className="attendance-search">
//         <input
//           type="date"
//           className="date-input"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           placeholder="Select date"
//         />
//         <button className="view-btn" onClick={handleViewDate}>
//           View
//         </button>
//         {filteredData.length > 0 && (
//           <button className="clear-btn" onClick={handleClearFilter}>
//             Clear
//           </button>
//         )}
//       </div>

//       <table className="attendance-table">
//         <thead>
//           <tr>
//             <th>S/N</th>
//             <th>Staff Name</th>
//             <th>Status</th>
//             <th>Check-In Times</th>
//             <th>Check-Out Times</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {(filteredData.length > 0 ? filteredData : attendanceData).map(
//             (person, index) => {
//               const checkins = Array.isArray(person.checkins)
//                 ? person.checkins
//                 : [];
//               const checkouts = Array.isArray(person.checkouts)
//                 ? person.checkouts
//                 : [];
//               const canCheckIn = !person.inSession && filteredData.length === 0;
//               const canCheckOut = person.inSession && filteredData.length === 0;

//               return (
//                 <tr key={person.id}>
//                   <td>{index + 1}</td>
//                   <td>{person.name}</td>
//                   <td>{person.status}</td>
//                   <td>{checkins.length > 0 ? checkins.join(", ") : "-"}</td>
//                   <td>{checkouts.length > 0 ? checkouts.join(", ") : "-"}</td>
//                   <td>
//                     <button
//                       className="checkin-btn"
//                       onClick={() => handleCheckIn(person.id)}
//                       disabled={!canCheckIn}
//                       style={{
//                         opacity: canCheckIn ? 1 : 0.6,
//                         pointerEvents: canCheckIn ? "auto" : "none",
//                       }}
//                     >
//                       Check In
//                     </button>

//                     <button
//                       className="checkout-btn"
//                       onClick={() => handleCheckOut(person.id)}
//                       disabled={!canCheckOut}
//                       style={{
//                         opacity: canCheckOut ? 1 : 0.6,
//                         pointerEvents: canCheckOut ? "auto" : "none",
//                       }}
//                     >
//                       Check Out
//                     </button>
//                   </td>
//                 </tr>
//               );
//             }
//           )}
//         </tbody>
//       </table>

//       <div>
//         <button
//           onClick={() => closeAttendanceForToday(false)}
//           className="close-attendance-btn"
//         >
//           Close Attendance for Today
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getEmployees } from "@/data/attendanceStore";

export default function AttendancePage() {
  const router = useRouter();

  const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Load employees only
  useEffect(() => {
    const employees = getEmployees();

    const initialData = employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      status: "-",
      checkins: [],
      checkouts: [],
      inSession: false,
    }));

    setAttendanceData(initialData);
  }, []);

  // 🔹 Auto-close attendance at 11:59 PM
  useEffect(() => {
    const now = new Date();
    const autoCloseTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      0,
      0
    );

    const timeout = autoCloseTime.getTime() - now.getTime();

    if (timeout > 0) {
      const timer = setTimeout(() => {
        closeAttendanceForToday(true);
      }, timeout);

      return () => clearTimeout(timer);
    } else {
      closeAttendanceForToday(true);
    }
  }, [attendanceData]);

  // Handle Check-In
  const handleCheckIn = (id) => {
    setAttendanceData((prev) =>
      prev.map((person) => {
        if (person.id !== id || person.inSession) return person;

        const timeStr = nowTime();
        const status =
          person.checkins.length === 0
            ? new Date().getHours() >= 9
              ? "Late"
              : "Present"
            : person.status;

        return {
          ...person,
          status,
          checkins: [...person.checkins, timeStr],
          inSession: true,
        };
      })
    );
  };

  // Handle Check-Out
  const handleCheckOut = (id) => {
    setAttendanceData((prev) =>
      prev.map((person) => {
        if (person.id !== id || !person.inSession) return person;

        const timeStr = nowTime();
        return {
          ...person,
          checkouts: [...person.checkouts, timeStr],
          inSession: false,
        };
      })
    );
  };

  // Close Attendance for Today
  const closeAttendanceForToday = (isAuto = false) => {
    const currentHour = new Date().getHours();
    if (!isAuto && currentHour < 5) {
      alert("Attendance can only be closed after 5 AM.");
      return;
    }

    if (!isAuto) {
      const proceed = window.confirm(
        "Are you sure you want to close attendance for today?"
      );
      if (!proceed) return;
    }

    const reportData = attendanceData.map((person) => {
      const checkins = Array.isArray(person.checkins) ? person.checkins : [];
      const checkouts = Array.isArray(person.checkouts) ? person.checkouts : [];

      const finalCheckouts =
        checkins.length > 0 && checkouts.length === 0
          ? [
              ...checkouts,
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            ]
          : checkouts;

      return {
        ...person,
        date: new Date().toISOString().split("T")[0],
        checkins: checkins.length === 0 ? ["-"] : checkins,
        checkouts: finalCheckouts.length === 0 ? ["-"] : finalCheckouts,
        status: checkins.length === 0 ? "Absent" : person.status || "Present",
      };
    });

    localStorage.setItem("attendanceData", JSON.stringify(reportData));

    const resetData = attendanceData.map((person) => ({
      ...person,
      checkins: [],
      checkouts: [],
      status: "-",
      inSession: false,
    }));

    setAttendanceData(resetData);

    router.push("/attendanceReport");
  };

  // 🔹 View attendance by selected date
  const handleViewDate = () => {
    if (!selectedDate) {
      alert("Please select a date to view attendance.");
      return;
    }

    const allAttendance = JSON.parse(
      localStorage.getItem("attendanceData") || "[]"
    );

    const filtered = allAttendance.filter((a) => a.date === selectedDate);

    if (filtered.length === 0) {
      alert("No attendance data found for this date.");
    }

    setFilteredData(filtered);
  };

  // 🔹 Clear filtered data to restore the page to live attendance
  const handleClearFilter = () => {
    setFilteredData([]);
    setSelectedDate("");
  };

  return (
    <div className="report-container">
      <h1 className="gap">Attendance</h1>

      <div className="attendance-search">
        <input
          type="date"
          className="date-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="Select date"
        />
        <button className="view-btn" onClick={handleViewDate}>
          View
        </button>
        {selectedDate && (
          <button className="clear-btn" onClick={handleClearFilter}>
            Clear
          </button>
        )}
      </div>

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
            <th>S/N</th>
            <th>Staff Name</th>
            <th>Status</th>
            <th>Check-In Times</th>
            <th>Check-Out Times</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {(filteredData.length > 0 ? filteredData : attendanceData).map(
            (person, index) => {
              const checkins = Array.isArray(person.checkins)
                ? person.checkins
                : [];
              const checkouts = Array.isArray(person.checkouts)
                ? person.checkouts
                : [];
              const canCheckIn = !person.inSession && filteredData.length === 0;
              const canCheckOut = person.inSession && filteredData.length === 0;

              return (
                <tr key={person.id}>
                  <td>{index + 1}</td>
                  <td>{person.name}</td>
                  <td>{person.status}</td>
                  <td>{checkins.length > 0 ? checkins.join(", ") : "-"}</td>
                  <td>{checkouts.length > 0 ? checkouts.join(", ") : "-"}</td>
                  <td>
                    <button
                      className="checkin-btn"
                      onClick={() => handleCheckIn(person.id)}
                      disabled={!canCheckIn}
                      style={{
                        opacity: canCheckIn ? 1 : 0.6,
                        pointerEvents: canCheckIn ? "auto" : "none",
                      }}
                    >
                      Check In
                    </button>

                    <button
                      className="checkout-btn"
                      onClick={() => handleCheckOut(person.id)}
                      disabled={!canCheckOut}
                      style={{
                        opacity: canCheckOut ? 1 : 0.6,
                        pointerEvents: canCheckOut ? "auto" : "none",
                      }}
                    >
                      Check Out
                    </button>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      <div>
        <button
          onClick={() => closeAttendanceForToday(false)}
          className="close-attendance-btn"
        >
          Close Attendance for Today
        </button>
      </div>
    </div>
  );
}
