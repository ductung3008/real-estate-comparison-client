import Header from '@/common/Homepage/Header';
import { Outlet } from 'react-router-dom';

const HomepageLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default HomepageLayout;
