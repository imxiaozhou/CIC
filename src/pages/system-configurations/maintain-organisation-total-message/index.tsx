import {
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable
} from '@/components/proComponents';
import { type ProColumns } from '@ant-design/pro-components';
import { Favorites } from '@/components/business';
import { Button } from 'antd';
import Icon from '@/components/Icons';
import { useNavigate } from 'react-router-dom';
import { searchOrganizationApi } from '@/services/system-configurations';
import { omit } from 'lodash-es';
import { formatAddBG } from '../utils';
import { OrganizationItem } from './type';

const sessionKey = 'ORGANIZATION_TOTAL_MESSAGE';

export default function MaintainOrganizationTotalMessage() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<OrganizationItem[]>();
  const userInfo = useAppSelector(selectUserInfo);
  const store = useStorage();
  const storage = store.get(sessionKey);
  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      value: storage?.tenantName ?? userInfo.tenantName
    }
  ]);
  const [hasData, setHasData] = useState(true);

  const columns: ProColumns<OrganizationItem>[] = [
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      sorter: true,
      initialValue: storage?.tenantName ?? userInfo.tenantName,
      renderFormItem(schema, config, form) {
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
      title: $t('Warning Level'),
      dataIndex: 'warningLevel',
      search: false,
      sorter: true
    },
    {
      title: $t('Cannot Send Limit'),
      dataIndex: 'cannotSendLimit',
      search: false,
      sorter: true
    },
    {
      title: $t('Cannot Receive Limit'),
      dataIndex: 'cannotReceiveLimit',
      search: false,
      sorter: true
    }
  ];
  const getOrganizationData = async (params: any) => {
    const param = {
      ...omit(params, ['current']),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order
    };
    store.set(sessionKey, {
      ...param,
      tenantNameLabel:
        store.get(sessionKey)?.tenantNameLabel ?? userInfo.tenantNameLabel
    });

    const { data, total } = await searchOrganizationApi(param);
    setHasData(!data?.length);
    const list = formatAddBG(data);
    return {
      data: list,
      success: true,
      total
    };
  };

  const goAdjustMessageStorageQuota = (): void => {
    if (selectedRows?.length) {
      navigate(`./adjust-message-storage-quota`);
      store.set('FIRST_LEVEL_STORAGE', selectedRows);
    } else {
      notification.error({
        message: $t(
          'Please select at least one user from the list to Adjust Mailbox Storage Quota.'
        ),
        placement: 'bottom'
      });
    }
  };

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
        code="FD-S-SYS-004"
        label={$t('Maintain Organisation Setting of Mailbox Storage Quota')}
      />
      <CustomProTable
        className="organization"
        headerTitle={$t('Organisation List')}
        searchTitle={$t('Search Organisation')}
        columns={columns}
        rowKey="id"
        request={getOrganizationData}
        tableAlertRender={false}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        initParams={[
          { name: 'tenantName', value: userInfo.tenantName as string }
        ]}
        onResetCallback={onResetCallback}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows)
        }}
        toolBarRender={() => [
          <Button
            disabled={hasData}
            onClick={goAdjustMessageStorageQuota}
            key="adjustMessageStorageQuota"
            type="primary"
          >
            <Icon type="SettingOutlined" />
            {$t('Adjust Mailbox Storage Quota')}
          </Button>
        ]}
      />
    </CustomProTableTheme>
  );
}
