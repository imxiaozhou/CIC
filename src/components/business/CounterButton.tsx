import { Button, InputNumber, Space } from 'antd';
import Icon from '../Icons';
import type { CounterButtonProps } from '@/types/business';

const limitDecimalPlaces = (value: number, maxDecimalPlaces = 3) => {
  const decimalPart = String(value).split('.')[1];
  const currentDecimalPlaces = decimalPart?.length || 0;

  if (currentDecimalPlaces > maxDecimalPlaces) {
    return parseFloat(value.toFixed(maxDecimalPlaces));
  }

  return value;
};

const CounterButton = ({
  value,
  precision = 3,
  onChange
}: CounterButtonProps) => (
  <Space>
    <Button
      onClick={() => onChange(Math.max(limitDecimalPlaces(value - 1), 0))}
    >
      <Icon type="MinusOutlined" />
    </Button>
    <InputNumber
      value={value}
      controls={false}
      onChange={onChange}
      className="inputAlign"
      precision={precision}
    />
    <Button onClick={() => onChange(limitDecimalPlaces(value + 1))}>
      <Icon type="PlusOutlined" />
    </Button>
  </Space>
);

export default CounterButton;
