import type { CSSProperties } from 'react';
import {
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  UsergroupDeleteOutlined,
  BlockOutlined,
  LockOutlined,
  AppstoreOutlined,
  FormOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  LoadingOutlined,
  LogoutOutlined,
  CheckOutlined,
  BellOutlined,
  DownloadOutlined,
  PlusOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  TranslationOutlined,
  ExportOutlined,
  MailOutlined,
  MenuOutlined,
  LeftOutlined,
  FileSearchOutlined,
  MobileOutlined,
  WarningFilled,
  CheckCircleFilled,
  BarChartOutlined,
  PieChartOutlined,
  PrinterOutlined,
  CloseOutlined,
  RightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  MinusOutlined,
  DatabaseOutlined,
  LayoutOutlined,
  ControlOutlined,
  CloudUploadOutlined,
  DeliveredProcedureOutlined
} from '@ant-design/icons';

const iconType = {
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  UsergroupDeleteOutlined,
  BlockOutlined,
  LockOutlined,
  AppstoreOutlined,
  FormOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  LoadingOutlined,
  LogoutOutlined,
  CheckOutlined,
  BellOutlined,
  DownloadOutlined,
  PlusOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  TranslationOutlined,
  ExportOutlined,
  MailOutlined,
  MenuOutlined,
  LeftOutlined,
  FileSearchOutlined,
  MobileOutlined,
  WarningFilled,
  CheckCircleFilled,
  BarChartOutlined,
  PieChartOutlined,
  PrinterOutlined,
  CloseOutlined,
  RightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  MinusOutlined,
  DatabaseOutlined,
  LayoutOutlined,
  ControlOutlined,
  CloudUploadOutlined,
  DeliveredProcedureOutlined
};

Object.assign(Icon, iconType);

export type IconType = keyof typeof iconType;

interface IconProps {
  type?: IconType;
  className?: string;
  style?: CSSProperties;
  rotate?: number;
  spin?: boolean;
  twoToneColor?: string; // (十六进制颜色)
}

export default function Icon({ type, ...iconProps }: Readonly<IconProps>) {
  if (!type) {
    return null;
  }
  const IcomComp = iconType[type];
  return <IcomComp {...iconProps} />;
}
