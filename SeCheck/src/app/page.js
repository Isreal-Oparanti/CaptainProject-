import Header from '@/components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="security-home">
      <Header />
      <section className="hero">
        <div className="row">
          <div className="col-1-of-2">
            <div className="hero-content">
              <div><img src="/img/SeCheck.png" alt="Logo" className="secheck" /></div>
              <h1 className="h1">Staff Attendance System</h1>
              <p>Smart, simple, and secure staff attendance for MediaReach OMD Ikeja</p>
              <div className="btn">
                <Link href="/login" className="btn btn-secondary">Mark Attendance</Link>
                <Link href="/dashboard" className="btn btn-primary">Admin Dashboard</Link>
              </div>
            </div>
          </div>
          <div className="col-1-of-2">
            <img src="/img/note.png" alt="" className="note" />
          </div>
        </div>
      </section>
    </div>
  );
}