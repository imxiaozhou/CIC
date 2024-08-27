import { Select, Tooltip } from 'antd';
import type { SelectProps } from 'antd';
import { isArray } from 'lodash-es';
import { getSelectSearchableApi } from '@/services/common';
import type { SelectSearchableProps } from '@/types/proComponents';

export default function SelectSearchable(props: SelectSearchableProps) {
  const {
    url = 'sma-adm/api/common/search-tenant-name',
    mode,
    defaultValue = [],
    onValueChange
  } = props;

  const [value, setValue] = useState<LabelValue[]>(defaultValue);
  const [options, setOptions] = useState<LabelValue[]>([]);

  async function fetchUserList(keyword = '') {
    const res = await getSelectSearchableApi(url, { keyword });
    setOptions(res.data);
  }

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <DebounceSelect
      mode={mode}
      value={value}
      placeholder={$t('Please search')}
      disabled={props.disabled}
      options={options}
      onChange={(newValue = []) => {
        const values = isArray(newValue) ? newValue : [newValue];
        setValue(values as LabelValue[]);
        onValueChange(values as LabelValue[]);
      }}
      style={{ width: '100%' }}
    />
  );
}

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  options: LabelValue[];
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any
>({ options, ...props }: Readonly<DebounceSelectProps<ValueType>>) {
  const maxTagPlaceholder = (omittedValues: any[]): React.ReactNode => (
    <Tooltip title={omittedValues.map(({ label }) => label).join(' | ')}>
      <span>+ {omittedValues.length} ...</span>
    </Tooltip>
  );

  return (
    <Select
      showSearch
      labelInValue
      allowClear
      {...props}
      options={options}
      maxTagCount="responsive"
      maxTagPlaceholder={maxTagPlaceholder}
      optionFilterProp="label"
    />
  );
}
