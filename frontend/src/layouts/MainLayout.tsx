import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GridBackground from '../components/GridBackground';

const MainLayout = () => {
  return (
    <>
      <GridBackground />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
