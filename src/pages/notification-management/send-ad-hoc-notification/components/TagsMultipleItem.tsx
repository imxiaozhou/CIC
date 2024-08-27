import {
  Collapse,
  Button,
  theme,
  Col,
  type CollapseProps,
  FormInstance
} from 'antd';
import { TagMultiple } from '@/components/proComponents';
import { INotificationForm } from '../type';
const { useToken } = theme;

const TagsMultipleItem = ({
  value,
  form
}: {
  value: LabelValue[];
  form: FormInstance<INotificationForm>;
}) => {
  const [str, setStr] = useState<string>(value.length > 0 ? 'Less' : 'More');
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Col>
          {$t('Selected User')} ({value.length})
        </Col>
      ),
      style: { margin: '0px -8px' },
      children: (
        <TagMultiple
          items={value}
          onChange={(tags: LabelValue[]) => {
            form.setFieldValue('selectedUsers', tags);
          }}
        />
      )
    }
  ];
  const {
    token: { colorPrimary }
  } = useToken();

  const showContent = (): React.ReactNode => (
    <div>
      <Button type="link" style={{ color: colorPrimary }}>
        {`${$t('Show')} ${$t(str)}`}
      </Button>
    </div>
  );

  return (
    <Collapse
      expandIconPosition="end"
      items={items}
      bordered={false}
      ghost
      defaultActiveKey={['1']}
      onChange={(key: string | string[]) => {
        setStr(key.length === 0 ? 'More' : 'Less');
      }}
      collapsible="icon"
      expandIcon={showContent}
    />
  );
};

export default TagsMultipleItem;
