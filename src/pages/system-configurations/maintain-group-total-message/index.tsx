import {
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable,
  TagStatus
} from '@/components/proComponents';
import { type ProColumns } from '@ant-design/pro-components';
import { Favorites } from '@/components/business';
import { EmailGroupItem } from './type';
import { Button } from 'antd';
import Icon from '@/components/Icons';
import { useNavigate } from 'react-router-dom';
import { getCommonOptions, getEmailGroupsOptions } from '@/services/common';
import { searchEmailGroupApi } from '@/services/system-configurations';
import { omit } from 'lodash-es';
import { formatAddBG } from '../utils';
import { translationAllLabel } from '@/utils';

const sessionKey = 'GROUP_TOTAL_MESSAGE';

export default function MaintainGroupTotalMessage() {
  const navigateTo = useNavigate();
  const [emailGroupOpts, setEmailGroupOpts] = useState<LabelValue[]>([]);
  const [groupStatusOpts, setGroupStatusOpts] = useState<LabelValue[]>([]);
  const [selectedRows, setSelectedRows] = useState<EmailGroupItem[]>([]);
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

  const columns: ProColumns<EmailGroupItem>[] = [
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
      title: $t('Email Group'),
      dataIndex: 'emailGroupName',
      sorter: true,
      valueType: 'select',
      initialValue: storage?.emailGroupName,
      fieldProps: {
        options: emailGroupOpts
      }
    },
    {
      title: $t('Group Status'),
      dataIndex: 'groupStatus',
      initialValue: storage?.groupStatus,
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(groupStatusOpts)
      },
      render: (_: any, record: EmailGroupItem) => (
        <TagStatus status={record.groupStatus}>
          {record.groupStatusLabel}
        </TagStatus>
      )
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
      sorter: true,
      search: false
    }
  ];
  const getEmailGroupData = async (params: any) => {
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

    const { data, total } = await searchEmailGroupApi(param);
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
      navigateTo(`./adjust-message-storage-quota`);
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

  const getOptions = async (mstType: string): Promise<void> => {
    switch (mstType) {
      case 'emailGroup':
        setEmailGroupOpts(await getEmailGroupsOptions());
        break;
      case 'EMAIL_GROUP_STATUS':
        setGroupStatusOpts(await getCommonOptions({ mstType }));
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    getOptions('emailGroup');
    getOptions('EMAIL_GROUP_STATUS');
  }, []);

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
        code="FD-S-SYS-003"
        label={$t('Maintain Group Setting of Mailbox Storage Quota')}
      />
      <CustomProTable
        headerTitle={$t('Email Group List')}
        searchTitle={$t('Search Email Group')}
        columns={columns}
        rowKey="id"
        request={getEmailGroupData}
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
