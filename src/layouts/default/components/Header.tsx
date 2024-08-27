import { Menu, Row, Col } from 'antd';
import Logo from './Logo';
import HeaderActions from './HeaderActions';
import useMenu from '../useMenu';
import HeaderContainer from './HeaderContainer';

export default function LayoutHeader() {
  const menu = useMenu();
  const layoutMode = useAppSelector(selectLayoutMode);

  return (
    <HeaderContainer>
      <Logo />
      <Row
        justify={layoutMode === 'topmenu' ? 'space-between' : 'end'}
        align="middle"
        style={{ flex: 1 }}
      >
        {layoutMode === 'topmenu' && (
          <Col style={{ display: 'flex', width: 'calc(100% - 320px)' }}>
            <Menu
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none'
              }}
              mode="horizontal"
              theme="light"
              items={menu.items}
              selectedKeys={[menu.selectKey || '']}
              onClick={({ key, keyPath, domEvent }) => menu.onSelectKey(key)}
            />
          </Col>
        )}
        <Col style={{ maxWidth: 320 }}>
          <HeaderActions />
        </Col>
      </Row>
    </HeaderContainer>
  );
}
