import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = ({ dark, setDark }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar dark={dark} setDark={setDark} />
      <Outlet />
    </div>
  );
};

export default MainLayout;
