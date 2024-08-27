import { ReactNode } from 'react';
import { Tooltip, Drawer, Button, Card, theme } from 'antd';
import Icon from '@/components/Icons';
import type { DrawerProps } from 'antd';
import { DarkModeSwitch } from '@/components/DarkModeSwitch';
import { ThemeColorsSelect } from '@/components/ThemeColors';
import SwitchFixedWidth from '@/components/SwitchFixedWidth';
import SwitchFixedHeader from '@/components/SwitchFixedHeader';
import LayoutToggle from './LayoutToggle';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsOpenSetting,
  setIsOpenSetting
} from '@/store/reducer/layoutSlice';

const { useToken } = theme;

export default function LocalSettingsBtn() {
  const dispatch = useDispatch();
  return (
    <Tooltip placement="bottomRight" title={$t('Local Settings')} arrow>
      <Button
        type="text"
        icon={<Icon type="LayoutOutlined" />}
        onClick={() => dispatch(setIsOpenSetting(true))}
      />
    </Tooltip>
  );
}

export function LocalSettingsDrawer(props: DrawerProps) {
  const isOpenSetting = useSelector(selectIsOpenSetting);
  const dispatch = useDispatch();
  return (
    <Drawer
      styles={{ body: { padding: '16px' } }}
      title={$t('System Local Settings')}
      placement="right"
      open={isOpenSetting}
      onClose={() => dispatch(setIsOpenSetting(false))}
    >
      <ConfigItem title={$t('Dark Mode')} content={<DarkModeSwitch />} />
      <ConfigItem title={$t('Layout Mode')} content={<LayoutToggle />} />
      <ConfigItem title={$t('Theme color')} content={<ThemeColorsSelect />} />
      <ConfigItem
        title={$t('Fixed Top Content')}
        content={<SwitchFixedHeader />}
      />
      <ConfigItem
        title={$t('Fixed Content Width')}
        content={<SwitchFixedWidth />}
      />
    </Drawer>
  );
}

function ConfigItem({
  title,
  content
}: {
  readonly title: ReactNode | string;
  readonly content: ReactNode;
}) {
  const {
    token: { boxShadow }
  } = useToken();
  return (
    <Card
      size="small"
      bordered={false}
      style={{
        width: '100%',
        marginBottom: 16,
        boxShadow
      }}
      styles={{ body: { padding: '8px 16px' } }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <div style={{ margin: '8px 0', fontSize: 15 }}>{title}</div>
        {content}
      </div>
    </Card>
  );
}
