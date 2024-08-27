import { omit, isBoolean, keys } from 'lodash-es';
import { type ActionType, ProTable } from '@ant-design/pro-components';
import { Typography, theme } from 'antd';
import classNames from 'classnames';
import type {
  CustomProTableProps,
  TableOnChange,
  TableSorts
} from '@/types/proComponents';
import { pagination, tableSearch } from '@/config/common';
import Icon from '@/components/Icons';

const { Title } = Typography;
const { useToken } = theme;

const CustomProTable = (props: CustomProTableProps) => {
  const actionRef = props.actionRef ?? (useRef<ActionType>() as any);
  const { searchTitle, cardBordered } = props;
  const [sortedInfo, setSortedInfo] = useState<TableSorts>({ ...props.sorter });
  const initPagination = props.pagination;
  const formRef = useRef<any>();
  const isPageBooleanType = isBoolean(initPagination);
  const [tablePagination, setTablePagination] = useState(
    initPagination ? { ...pagination, ...initPagination } : pagination
  );

  const { token } = useToken();

  const handleChange: TableOnChange = (pagination, _, sorter: any) => {
    !isPageBooleanType &&
      setTablePagination({
        ...tablePagination,
        current: pagination.current,
        pageSize: pagination.pageSize
      });
    setSortedInfo(
      Object.assign(sorter, {
        columnKey: sorter.order ? sorter.columnKey : undefined,
        order: sorter.order ?? undefined
      }) as TableSorts
    );
  };

  const handleSubmit = () => {
    setTablePagination({
      ...tablePagination,
      current: 1,
      pageSize: 10
    });
    setSortedInfo({});
  };

  const handleReset = () => {
    handleSubmit();
    if (props.initParams?.length) {
      const currentForm = formRef.current;
      const getParamsKeys = keys(currentForm.getFieldFormatValueObject());
      const initData = getParamsKeys.map((key) => ({
        name: key,
        value: props.initParams?.find((item) => item.name === key)?.value
      }));
      currentForm.setFields(initData);
      props?.onResetCallback!();
      currentForm.submit();
    } else {
      actionRef?.current.reloadAndRest!();
    }
  };

  return (
    <>
      {searchTitle && (
        <Title
          level={5}
          className={classNames(
            'customProTableTitle',
            cardBordered === false ? 'customProTableBorderNo' : ''
          )}
          style={{
            background: token.colorBgContainer,
            borderColor: token.colorSplit,
            marginBottom: 0
          }}
        >
          {searchTitle}
        </Title>
      )}
      <ProTable
        search={{
          ...tableSearch,
          searchText: $t(tableSearch.searchText as string)
        }}
        pagination={isPageBooleanType ? initPagination : tablePagination}
        params={{
          columnKey: sortedInfo?.columnKey,
          order: sortedInfo?.order,
          current: isPageBooleanType ? undefined : tablePagination.current,
          pageSize: isPageBooleanType ? undefined : tablePagination.pageSize
        }}
        formRef={formRef}
        rowSelection={{}}
        scroll={{ x: 'max-content' }}
        cardBordered
        onChange={handleChange}
        {...omit(props, [
          'columns',
          'actionRef',
          'pagination',
          'searchTitle',
          'sorter',
          'initParams',
          'onResetCallback'
        ])}
        columns={props.columns?.map((item) =>
          Object.assign(item, {
            sortOrder:
              sortedInfo.columnKey === item.dataIndex ? sortedInfo.order : null
          })
        )}
        className={classNames(
          props?.className,
          searchTitle ? 'customProTableSearchTitle' : ''
        )}
        onSubmit={handleSubmit}
        onReset={handleReset}
        actionRef={actionRef}
        options={{
          ...props?.options,
          setting: {
            settingIcon: <Icon type="ControlOutlined" />
          }
        }}
      />
    </>
  );
};

export default CustomProTable;
