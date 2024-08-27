import { SearchProps } from '../type';
import { Input, InputRef } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';

const { Search } = Input;
const handleFilter = (confirm: FilterDropdownProps['confirm']) => confirm();

export const SearchCom = forwardRef<InputRef, SearchProps>(
  ({ selectedKeys, confirm, setSelectedKeys }, ref) => (
    <Search
      style={{ padding: 8 }}
      onKeyDown={(e) => e.stopPropagation()}
      enterButton
      allowClear
      ref={ref}
      placeholder={$t('Please search')}
      value={selectedKeys[0]}
      onSearch={() => handleFilter(confirm)}
      onChange={(e) => {
        setSelectedKeys(e.target.value ? [e.target.value] : []);
        if (!e.target.value) handleFilter(confirm);
      }}
    />
  )
);
