import { Select } from 'antd';
import type { UnitSelectProps } from '@/types/business';

const UnitSelect = ({
  value,
  onChange,
  keyId,
  unitOptions
}: UnitSelectProps) => {
  return (
    <Select
      key={keyId}
      value={value}
      onChange={onChange}
      style={{ marginLeft: 8 }}
      options={unitOptions}
    />
  );
};

export default UnitSelect;
