import { Space } from 'antd';
import NoticeHeaderButton from './NoticeIcon';
import PersonalCenter from './PersonalCenter';
import LanguageSetting from './LanguageSetting';

export default function HeaderActions() {
  return (
    <Space>
      <NoticeHeaderButton />
      <PersonalCenter />
      <LanguageSetting />
    </Space>
  );
}
