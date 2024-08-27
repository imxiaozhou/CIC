import { Button, InputNumber, Space, Typography, Col } from 'antd';
import Icon from '@/components/Icons';
import '../index.less';

const { Text } = Typography;

interface ICounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
}
const Counter = (props: ICounterProps) => {
  const { label, suffix, value, onChange } = props;
  const [v, setValue] = useState<number>(0);
  const $t = useTranslations();

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <Col>
      <Space direction="vertical" style={{ marginBottom: 10 }}>
        <Text color="#666869">{$t(label)}</Text>
        <Space direction="horizontal">
          <Button
            disabled={value <= 0}
            onClick={() => {
              onChange(value - 1);
            }}
          >
            <Icon type="MinusOutlined" />
          </Button>
          <InputNumber
            controls={false}
            precision={0}
            min={0}
            value={v}
            onChange={(value: number | null) => {
              onChange(value ?? 0);
            }}
            className="inputAlign"
          />
          <Button
            onClick={() => {
              onChange(value + 1);
            }}
          >
            <Icon type="PlusOutlined" />
          </Button>
          {suffix && <Text>{$t(suffix)}</Text>}
        </Space>
      </Space>
    </Col>
  );
};

export default Counter;
