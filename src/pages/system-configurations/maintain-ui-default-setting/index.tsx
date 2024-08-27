import type { ProColumns } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { Favorites } from '@/components/business';
import {
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable,
  TagStatus
} from '@/components/proComponents';
import { searchMaintainUiDefaultSetting } from '@/services/system-configurations';
import { MaintainUiDefaultSettingResponse } from '@/services/system-configurations/maintain-ui-default-setting/type';

const sessionKey = 'MAINTAIN_UI';

const MaintainUiDefaultSetting: React.FC = () => {
  const navigate = useNavigate();
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

    const { data, total } = await searchMaintainUiDefaultSetting(searchParams);

    return {
      data,
      success: true,
      total
    };
  };

  const columns: ProColumns<MaintainUiDefaultSettingResponse>[] = [
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      key: 'tenantName',
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
      title: $t('Organisation Status'),
      dataIndex: 'organisationStatus',
      sorter: true,
      hideInSearch: true,
      render: (_, record) => (
        <TagStatus status={record.organisationStatus}>
          {record.organisationStatusLabel}
        </TagStatus>
      )
    },
    {
      title: $t('Action'),
      dataIndex: 'action',
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              '/system-configurations/maintain-ui-default-setting/maintain-ui-default-setting-edit'
            );
            store.set('FIRST_LEVEL_STORAGE', {
              tntId: record.tntId,
              tenantName: record.tenantName
            });
          }}
        >
          {$t('Edit')}
        </Button>
      )
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
        code="FD-S-SYS-001"
        label={$t('Maintain UI Default Setting')}
      />
      <CustomProTable
        columns={columns}
        searchTitle={$t('Search for Organisation')}
        headerTitle={$t('Organisation Information')}
        rowKey="tntId"
        request={getDataSource}
        rowSelection={false}
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

export default MaintainUiDefaultSetting;
