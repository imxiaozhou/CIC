import { Spin, Row, Col } from 'antd';
import { useKeycloak } from '@react-keycloak/web';
import { Navigate, useLocation } from 'react-router-dom';

export default function AuthRoute({
  children
}: Readonly<{ children: React.ReactElement }>) {
  const { initialized } = useKeycloak();
  const location = useLocation();
  const isLogin = useAppSelector(selectIsLogin);

  if (!initialized) return <Loading />;

  if (!isLogin) {
    return <Navigate to="/login" state={location} replace />;
  }

  return children;
}

function Loading() {
  return (
    <Row justify="center" align="middle" style={{ flex: 1 }}>
      <Col span={24}>
        <Spin tip="正在进行权限认证...">
          <></>
        </Spin>
      </Col>
    </Row>
  );
}
