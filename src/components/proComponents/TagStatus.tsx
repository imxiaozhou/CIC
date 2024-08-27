import { Tag, Typography } from 'antd';
import type { TagStatusProps, TagColorProps } from '@/types/proComponents';

const { Text } = Typography;

const SUCCESS: TagColorProps = {
  color: '#E3FCEB',
  fontColor: '#006644'
};

const PENDING: TagColorProps = {
  color: '#FFF0B3',
  fontColor: '#6D5003'
};

const ERROR: TagColorProps = {
  color: '#F9EBEB',
  fontColor: '#B80000'
};

const DISABLE: TagColorProps = {
  color: '#E6E6E7',
  fontColor: '#171717'
};

const REVOKED: TagColorProps = {
  color: '#EAE6FF',
  fontColor: '#403294'
};

const RUNNING: TagColorProps = {
  color: '#D9EEFB',
  fontColor: '#0A3984'
};

const colors = {
  ENABLE: SUCCESS,
  ENABLED: SUCCESS,
  ACTIVE: SUCCESS,
  REGISTERED: SUCCESS,
  APPROVED: SUCCESS,
  COMPLETED: SUCCESS,
  PENDING,
  PENDING_APPR_CREATE: PENDING,
  PENDING_APPR_IMPORT: PENDING,
  PENDING_APPR_REMOVE: PENDING,
  PENDING_APPR_RENEW: PENDING,
  PENDING_APPR_REVOKE: PENDING,
  PAUSE: PENDING,
  REJECTED: ERROR,
  LOCKED: ERROR,
  EXPIRED: ERROR,
  UNREGISTERED: ERROR,
  FAILED: ERROR,
  DISABLE,
  DISABLED: DISABLE,
  NA: DISABLE,
  INACTIVE: DISABLE,
  RUNNING,
  REVOKED
};

const TagStatus: React.FC<TagStatusProps> = (props) => {
  const $t = useTranslations();
  const { status } = props;
  const currentColor = colors[status as keyof typeof colors] ?? {};
  return props.children ? (
    <Tag
      bordered={false}
      {...props}
      color={currentColor.color}
      style={{ color: currentColor.fontColor }}
    >
      {$t(props.children as string)}
    </Tag>
  ) : (
    <Text>-</Text>
  );
};

export default TagStatus;
