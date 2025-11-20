"use client";
// import { useState } from "react";
import "./statusDropdown.scss";

export default function StatusDropdown({ defaultStatus }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(defaultStatus);

  const options = ["Present", "Absent", "Late", "On-Leave"];

  const handleSelect = (value) => {
    setStatus(value);
    setOpen(false);
  };

  return (
    <div className="status-dropdown">
      <div className="dropdown-display" onClick={() => setOpen(!open)}>
        <span>{status}</span>
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <ul className="dropdown-menu">
          {options.map((item) => (
            <li key={item} onClick={() => handleSelect(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
