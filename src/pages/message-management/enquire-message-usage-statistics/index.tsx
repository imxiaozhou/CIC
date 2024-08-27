import type { ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Favorites } from '@/components/business';
import {
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable
} from '@/components/proComponents';
import { searchMessageUsage } from '@/services/message-management/enquire-message-usage-statistics';
import { EnquireColumnsInterface } from './type';

const sessionKey = 'MESSAGE_STATISTICS';

const EnquireMessageUsageStatistics = () => {
  const navigation = useNavigate();
  const store = useStorage();
  const userInfo = useAppSelector(selectUserInfo);
  const storage = store.get(sessionKey);
  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      value: storage?.tenantName ?? userInfo.tenantName
    }
  ]);
  const getDataSource = async (params: any) => {
    const searchParams = {
      tenantName: params?.tenantName,
      displayName: params?.displayName?.trim(),
      email: params?.email?.trim(),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order
    };

    store.set(sessionKey, {
      ...searchParams,
      tenantNameLabel:
        store.get(sessionKey)?.tenantNameLabel ?? userInfo.tenantNameLabel
    });

    const { data, total } = await searchMessageUsage(searchParams);

    return {
      data,
      success: true,
      total
    };
  };

  const columns: ProColumns<EnquireColumnsInterface>[] = [
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      initialValue: storage?.tenantName ?? userInfo.tenantName,
      sorter: true,
      renderFormItem(schema, config, form, action) {
        return (
          <SelectSearchable
            defaultValue={tenantObj}
            disabled={!userInfo.userRole!.includes('SUPER_ADM')}
            onValueChange={(newValue: LabelValue[]) => {
              form.setFieldsValue({
                tenantName: newValue[0]?.value
              });
              store.set(sessionKey, {
                ...storage,
                tenantName: newValue[0]?.value,
                tenantNameLabel: newValue[0]?.label
              });
            }}
          />
        );
      }
    },
    {
      title: $t('Display Name'),
      dataIndex: 'displayName',
      initialValue: storage?.displayName,
      sorter: true
    },
    {
      title: $t('Email'),
      dataIndex: 'email',
      initialValue: storage?.email,
      sorter: true
    },
    {
      title: $t('Action'),
      valueType: 'option',
      fixed: 'right',
      key: 'option',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              store.set('FIRST_LEVEL_STORAGE', record.email);
              navigation('./detail');
            }}
          >
            {$t('View')}
          </Button>
        );
      }
    }
  ];

  const onResetCallback = () => {
    setTenantObj([
      { label: userInfo.tenantNameLabel, value: userInfo.tenantName }
    ]);
    store.set(sessionKey, {
      ...storage,
      tenantNameLabel: userInfo.tenantNameLabel
    });
  };

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-MSG-002"
        label={$t('Enquire Message Usage Statistics')}
      />
      <CustomProTable
        columns={columns}
        headerTitle={$t('Message Usage Lists')}
        searchTitle={$t('Search User')}
        rowKey="id"
        rowSelection={false}
        request={getDataSource}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        initParams={[
          { name: 'tenantName', value: userInfo.tenantName as string }
        ]}
        onResetCallback={onResetCallback}
      />
    </CustomProTableTheme>
  );
};

export default EnquireMessageUsageStatistics;
