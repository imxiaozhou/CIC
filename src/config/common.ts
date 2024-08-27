import type { PaginationProps, DrawerProps, ModalProps } from 'antd';
import type { BaseQueryFilterProps } from '@ant-design/pro-components';

export const pagination: PaginationProps = {
  // position: ['topRight'],
  showSizeChanger: true,
  showTotal: (total: number) => $t('Total (0) items', [total]),
  defaultPageSize: 10
};

export type TableSearch = BaseQueryFilterProps & {
  filterType?: 'query' | 'light';
};

export const tableSearch: TableSearch = {
  layout: 'vertical',
  searchText: 'Search'
};

export const modalProps: ModalProps = {
  destroyOnClose: true,
  maskClosable: false
};

export const drawerProps: DrawerProps = {
  destroyOnClose: true
};
