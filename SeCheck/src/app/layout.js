import '../styles/main.scss';

export const metadata = {
  title: 'SeCheck | Home Page',
  description: 'Staff Attendance System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}