import { Outlet } from 'react-router-dom';
import GridBackground from '../components/GridBackground';

const AuthLayout = () => {
  return (
    <>
      <GridBackground />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
