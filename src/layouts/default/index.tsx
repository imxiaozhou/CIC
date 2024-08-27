import { useSelector } from 'react-redux';
import { selectLayoutMode } from '@/store/reducer/layoutSlice';
import { LocalSettingsDrawer } from './components/LocalSettings';
import { Layout } from 'antd';
import Header from './components/Header';
import Sider from './components/Sider';
import Content from './components/Content';
import Footer from './components/Footer';
import { IdleTimer } from '@/components/business';

export type LayoutModeType = 'sidemenu' | 'topmenu';

export default function DefaultLayout() {
  const layoutMode = useSelector(selectLayoutMode);

  const { userId } = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  useEffect(() => {
    userId && dispatch(loadMenus({ userId }));
  }, [userId]);

  return (
    <>
      <Header />
      <Layout hasSider={layoutMode === 'sidemenu'}>
        <Sider />
        <Layout>
          <Content />
          <Footer />
          <LocalSettingsDrawer />
        </Layout>
      </Layout>
      {userId && <IdleTimer />}
    </>
  );
}
