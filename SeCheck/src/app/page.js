import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-layout">
        <div className="container">
          <Header />
          <section className="hero">
            <div className="hero-text">
              <div>
                <img src="/img/SeCheck.png" alt="Logo" className="secheck" />
              </div>
              <h1 className="h1">Staff Attendance System</h1>
              <p>
                Smart, simple, and secure staff attendance for MediaReach OMD
                Ikeja
              </p>
              {/* <div className="btn">
                <Link href="/login" className="btn btn-secondary">
                  Mark Attendance
                </Link>
                <Link href="/dashboard" className="btn btn-primary">
                  Admin Dashboard
                </Link>
              </div> */}

              <div className="btn">
                <Link href="/login?role=staff" className="btn btn-secondary">
                  Mark Attendance
                </Link>
                <Link href="/login?role=admin" className="btn btn-primary">
                  Admin Dashboard
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img src="/img/note.png" alt="" className="note" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
