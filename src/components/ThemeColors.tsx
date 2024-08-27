import React from 'react';
import { Button, ConfigProvider, Space } from 'antd';
import Icon from '@/components/Icons';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppHooks';
import { selectThemeColor, setThemeColor } from '@/store/reducer/layoutSlice';
import config from '@/config';

export function ThemeColorConfigProvider({
  children
}: {
  readonly children: React.ReactNode;
}) {
  const themeColor = useAppSelector(selectThemeColor);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeColor
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export function ThemeColorsSelect() {
  const dispatch = useAppDispatch();
  const themeColor = useAppSelector(selectThemeColor);
  return (
    <Space wrap size="small" direction="horizontal">
      {config.themeColors.map((color) => (
        <ColorBlockItem
          key={color}
          color={color}
          isActive={themeColor === color}
          onClick={() => {
            dispatch(setThemeColor(color));
          }}
        />
      ))}
    </Space>
  );
}

interface ColorBlockItemParams {
  color: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  isActive: boolean;
}

function ColorBlockItem({
  color,
  isActive,
  onClick
}: Readonly<ColorBlockItemParams>) {
  return (
    <Button
      style={{
        borderRadius: 6,
        width: 26,
        height: 26,
        overflow: 'hidden',
        backgroundColor: color
      }}
      onClick={onClick}
    >
      <ColorItemActive isShow={isActive} />
    </Button>
  );
}

function ColorItemActive({ isShow }: { readonly isShow: boolean }) {
  return (
    <div
      style={{
        display: isShow ? 'block' : 'none',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,.3)',
        textAlign: 'center',
        lineHeight: '26px'
      }}
    >
      <Icon type="CheckOutlined" style={{ color: '#fff' }} />
    </div>
  );
}
