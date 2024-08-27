import { FilterDropdownProps } from 'antd/es/table/interface';

export interface FunctionItem {
  screenid: string;
  functionname: string;
  recommendedrole?: string[];
  recommendedroleLable?: string[];
}

export interface DataType {
  screenid: string;
  functionname: string;
  recommendedroleLables: number;
}

export interface SearchProps {
  setSelectedKeys: (params: string[]) => {};
  selectedKeys: string[];
  confirm: FilterDropdownProps['confirm'];
}

export interface FilterIconProps {
  filtered: boolean;
}
