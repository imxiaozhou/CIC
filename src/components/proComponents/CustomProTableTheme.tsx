import { theme } from 'antd';
import type { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

const { useToken } = theme;

const ProTableTheme = styled.div`
  .ant-pro-table-search,
  .ant-pro-card {
    background-color: ${(props) => props.theme.bg};
  }
  .ant-pro-table-list-toolbar-title,
  .ant-pro-table-list-toolbar-setting-item {
    color: ${(props) => props.theme.textColor};
  }
`;

const CustomProTableTheme = ({
  children
}: {
  children: ReactNode;
}): ReactElement => {
  const { token } = useToken();
  return (
    <ProTableTheme
      theme={{
        bg: token.colorBgContainer,
        textColor: token.colorText
      }}
    >
      {children}
    </ProTableTheme>
  );
};

export default CustomProTableTheme;
