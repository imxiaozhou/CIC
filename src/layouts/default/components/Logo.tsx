import { Link } from 'react-router-dom';
import { Typography } from 'antd';

const { Title } = Typography;

export default function LayoutLogo() {
  return (
    <Link className="logo" to="/">
      <Title className="logo_text" level={5}>
        {$t('Secure Messaging Application')}
      </Title>
    </Link>
  );
}
