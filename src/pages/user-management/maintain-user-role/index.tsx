import { Button, Typography, Card, InputRef } from 'antd';
import { useSelector } from 'react-redux';
import { Flex } from 'antd/lib';
import {
  type ProColumns,
  QueryFilter,
  ProFormSelect,
  ProForm
} from '@ant-design/pro-components';
import { pagination } from '@/config/common';
import { deepCompareArrays, showMultipleLabel, sortFun } from '@/utils';
import { Favorites } from '@/components/business';
import Icon from '@/components/Icons';
import { CustomFormButton, CustomProTable } from '@/components/proComponents';
import {
  saveFunctionRoleApi,
  searchUserRoleApi
} from '@/services/user-management';
import { getUserRoleOptions } from '@/services/common';
import { RootState } from '@/store';
import { notification } from '@/hooks/useGlobalTips';
import './index.less';
import { DataType, FunctionItem, SearchProps } from './type';
import { SearchCom } from './components/SearchCom';
import { FilterIcon } from './components/FilterIcon';

type DataIndex = keyof DataType;

const { Title } = Typography;

export default function MaintainUserRole() {
  const [oAssignableData, setOAssignableData] = useState<FunctionItem[]>([]);
  const [oAssignedData, setOAssignedData] = useState<FunctionItem[]>([]);
  const [assignableData, setAssignableData] = useState<FunctionItem[]>([]);
  const [assignedData, setAssignedData] = useState<FunctionItem[]>([]);
  const [selectedAssignable, setSelectedAssignable] = useState<React.Key[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<React.Key[]>([]);
  const [isOperate, setIsOperate] = useState(false);
  const [userRoleIDOptions, setUserRoleIDOptions] = useState<LabelValue[]>([]);
  const [searchLocale, setSearchLocale] = useState('');
  const searchInputRef = useRef<InputRef>(null);
  const lang = useSelector((store: RootState) => store.language.lang);

  const [form] = ProForm.useForm();

  useEffect(() => {
    form.setFieldsValue({
      userRoleID: 'TENANT_ADM'
    });
  }, [form]);

  useEffect(() => {
    setSearchLocale($t('Search'));
  }, [lang]);

  useEffect(() => {
    handleSearchRole({
      userRoleID: 'TENANT_ADM'
    });
    getRoleOptions();
  }, []);

  useEffect(() => {
    if (
      !deepCompareArrays(assignableData, oAssignableData) ||
      !deepCompareArrays(assignedData, oAssignedData)
    ) {
      setIsOperate(true);
    } else {
      setIsOperate(false);
    }
  }, [assignableData, oAssignableData, assignedData, oAssignedData]);

  const getRoleOptions = async () => {
    const options = await getUserRoleOptions();
    setUserRoleIDOptions(options);
  };

  const getFilteredIcon = (filtered: boolean) => (
    <FilterIcon filtered={filtered} />
  );

  const filterDropdown = ({
    setSelectedKeys,
    selectedKeys,
    confirm
  }: SearchProps) => (
    <SearchCom
      setSelectedKeys={setSelectedKeys}
      selectedKeys={selectedKeys}
      confirm={confirm}
      ref={searchInputRef}
    />
  );

  const getColumnSearchProps = (dataIndex: DataIndex): any => ({
    filterDropdown: filterDropdown,
    filterIcon: getFilteredIcon,

    onFilter: (
      value: string,
      record: { [x: string]: { toString: () => string } }
    ) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInputRef.current?.select(), 100);
      }
    },
    render: (text: { toString: () => string }) => showMultipleLabel(text)
  });

  const columns: ProColumns<any>[] = [
    {
      title: $t('Screen ID'), // 'Screen ID'
      dataIndex: 'screenid',
      key: 'screenid',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'screenid'),
        multiple: 3
      },
      ...getColumnSearchProps('screenid')
    },
    {
      title: $t('Function Name'), // 'Function Name'
      dataIndex: 'functionname',
      key: 'functionname',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'functionname'),
        multiple: 2
      },
      ...getColumnSearchProps('functionname')
    },
    {
      title: $t('Recommended Role'), // 'Recommended Role'
      dataIndex: 'recommendedroleLables',
      key: 'recommendedroleLables',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'recommendedroleLables'),
        multiple: 1
      },
      ...getColumnSearchProps('recommendedroleLables')
    }
  ];

  const moveToAssignable = () => {
    setAssignableData([
      ...assignedData.filter((data) =>
        selectedAssigned.includes(data.screenid)
      ),
      ...assignableData
    ]);
    setAssignedData(
      assignedData.filter((item) => !selectedAssigned.includes(item.screenid))
    );
  };

  const moveToAssigned = () => {
    setAssignableData(
      assignableData.filter(
        (item) => !selectedAssignable.includes(item.screenid)
      )
    );
    setAssignedData([
      ...assignableData.filter((data) =>
        selectedAssignable.includes(data.screenid)
      ),
      ...assignedData
    ]);
  };

  const moveAllToAssigned = () => {
    setAssignableData([]);
    setAssignedData([...assignableData, ...assignedData]);
  };

  const moveAllToAssignable = () => {
    setAssignableData([...assignedData, ...assignableData]);
    setAssignedData([]);
  };

  const handleSearchRole = async (values: any) => {
    const res = await searchUserRoleApi(values);
    const assignableData = res.data.find(
      (data: { type: string }) => data.type === 'assignableFunction'
    ).data;
    const assignedData = res.data.find(
      (data: { type: string }) => data.type === 'assignedFunction'
    ).data;
    setAssignableData(assignableData);
    setAssignedData(assignedData);
    setOAssignableData(assignableData);
    setOAssignedData(assignedData);
  };

  const assignableRowSelection = {
    selectedAssignable,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedAssignable(newSelectedRowKeys);
    }
  };

  const assignedSelection = {
    selectedAssigned,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedAssigned(newSelectedRowKeys);
    }
  };

  const handleSave = async () => {
    const finalAssignable = assignableData.map((data) => {
      return {
        screenId: data.screenid,
        functionName: data.functionname,
        recommendedRole: data.recommendedrole?.join()
      };
    });
    const finalAssigned = assignedData.map((data) => {
      return {
        screenId: data.screenid,
        functionName: data.functionname,
        recommendedRole: data.recommendedrole?.join()
      };
    });
    const res = await saveFunctionRoleApi([
      { type: 'assignableFunction', data: finalAssignable },
      { type: 'assignedFunction', data: finalAssigned }
    ]);
    if (res.status.code === 0) {
      notification.success({
        message: $t('Save successfully')
      });
      setIsOperate(false);
    }
  };

  return (
    <>
      <Favorites code="FD-S-USR-004" label={$t('Maintain User Role')} />
      <Card styles={{ body: { padding: '16px 24px 24px' } }}>
        <Title level={5} style={{ marginBottom: 0 }}>
          {$t('Search User Role')}
        </Title>

        <QueryFilter
          layout="vertical"
          style={{ padding: 0, marginTop: '16px' }}
          form={form}
          onFinish={handleSearchRole}
          onReset={handleSearchRole}
          submitter={{ searchConfig: { submitText: searchLocale } }}
        >
          <ProFormSelect
            rules={[
              {
                required: true,
                message: $t('Please Select User Role')
              }
            ]}
            initialValue="TENANT_ADM"
            name="userRoleID"
            label={$t('User Role ID')}
            options={userRoleIDOptions}
          />
        </QueryFilter>
      </Card>

      <Card className="maintain-user-role">
        <Flex justify="space-between">
          <Title level={5} style={{ marginBottom: 0 }}>
            {$t('User Role Function')}
          </Title>

          <CustomFormButton
            key="save"
            onConfirm={handleSave}
            disabled={!isOperate}
          >
            {$t('Save')}
          </CustomFormButton>
        </Flex>
        <Flex>
          <CustomProTable
            rowKey="screenid"
            headerTitle={$t('Assignable Function')}
            columns={columns}
            dataSource={assignableData}
            search={false}
            cardBordered={false}
            rowSelection={assignableRowSelection}
            style={{ width: 'calc((100% - 70px)/2)' }}
            pagination={pagination}
            scroll={{ x: 'max-content' }}
            options={{
              reload: false
            }}
            tableAlertRender={false}
          />
          <Flex
            vertical
            justify="center"
            gap="small"
            style={{ marginInline: '12px' }}
          >
            <Button onClick={moveToAssigned} type="primary" ghost>
              <Icon type="RightOutlined" />
            </Button>
            <Button onClick={moveAllToAssigned} type="primary" ghost>
              <Icon type="DoubleRightOutlined" />
            </Button>
            <Button onClick={moveToAssignable} type="primary" ghost>
              <Icon type="LeftOutlined" />
            </Button>
            <Button onClick={moveAllToAssignable} type="primary" ghost>
              <Icon type="DoubleLeftOutlined" />
            </Button>
          </Flex>
          <CustomProTable
            rowKey="screenid"
            headerTitle={$t('Assigned Function')}
            columns={columns}
            dataSource={assignedData}
            search={false}
            cardBordered={false}
            rowSelection={assignedSelection}
            style={{ width: 'calc((100% - 70px)/2)' }}
            pagination={pagination}
            options={{ reload: false }}
            scroll={{ x: 'max-content' }}
            tableAlertRender={false}
          />
        </Flex>
      </Card>
    </>
  );
}
