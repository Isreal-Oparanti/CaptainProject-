// // Employees
// // attendanceStore.js
export function getEmployees() {
  return JSON.parse(localStorage.getItem("employees") || "[]");
}

export function saveEmployees(employees) {
  localStorage.setItem("employees", JSON.stringify(employees));
}

// Attendance
export const getAttendance = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("attendanceData") || "[]");
};

export const saveAttendance = (attendance) => {
  localStorage.setItem("attendanceData", JSON.stringify(attendance));
};

// // Employees Store
// export function getEmployees() {
//   if (typeof window === "undefined") return [];
//   return JSON.parse(localStorage.getItem("employees") || "[]");
// }

// export function saveEmployees(employees) {
//   if (typeof window === "undefined") return;
//   localStorage.setItem("employees", JSON.stringify(employees));
// }

// // Attendance Store
// export function getAttendance() {
//   if (typeof window === "undefined") return [];
//   return JSON.parse(localStorage.getItem("attendanceData") || "[]");
// }

// export function saveAttendance(attendance) {
//   if (typeof window === "undefined") return;
//   localStorage.setItem("attendanceData", JSON.stringify(attendance));
// }

// // Helper: Get today's attendance only
// export function getTodayAttendance() {
//   const today = new Date().toISOString().split("T")[0];
//   return getAttendance().filter((a) => a.date === today);
// }
