import type { ReactNode, CSSProperties } from 'react';
import { Layout, theme } from 'antd';
const { Header } = Layout;

export default function LayoutHeaderContainer({
  children,
  style = {}
}: {
  readonly children: ReactNode;
  readonly style?: CSSProperties;
}) {
  const isFixedHeader = useAppSelector(selectIsFixedHeader);
  const {
    token: { colorBgContainer, colorBorderSecondary }
  } = theme.useToken();
  const headerStyle: CSSProperties = isFixedHeader
    ? { position: 'sticky', top: 0, zIndex: 100 }
    : {};
  return (
    <Header
      style={{
        padding: '0 16px',
        backgroundColor: colorBgContainer,
        borderBottom: `1px solid ${colorBorderSecondary}`,
        display: 'flex',
        ...headerStyle,
        ...style
      }}
    >
      {children}
    </Header>
  );
}
