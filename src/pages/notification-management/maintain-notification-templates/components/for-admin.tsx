import { CustomFormButton, CustomProTable } from '@/components/proComponents';
import {
  ActionType,
  ProFormSelect,
  ProFormText,
  type ProColumns
} from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/Icons';
import {
  deleteNotificationTemplateApi,
  searchNotificationTemplateApi
} from '@/services/notification-management/maintain-notification-templates';
import { omit } from 'lodash-es';
import { getCommonOptions } from '@/services/common';
import { showMultipleLabel, translationAllLabel } from '@/utils';
import { SearchNotificationTemplateParams } from '@/services/notification-management/maintain-notification-templates/type';
import { NotificationTemplateItem } from '../type';
const sessionKey = 'NOTIFICATION_TEMPLATES';

export default function ForAdmin() {
  const store = useStorage();
  const storage = store.get(sessionKey);
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();
  const userInfo = useAppSelector(selectUserInfo);
  const [type, setType] = useState(storage?.type ?? 'TENANT');
  const [tenantLabel, setTenantLabel] = useState(
    storage?.associatedTenantLabel ?? userInfo.tenantNameLabel
  );
  const [typeOptions, setTypeOptions] = useState<LabelValue[]>([]);

  const getTypeOptions = async () => {
    const data = await getCommonOptions({
      mstType: 'NOTIFICATION_TEMPLATE_TYPE'
    });
    setTypeOptions(data);
  };

  useEffect(() => {
    getTypeOptions();
  }, []);

  const columns: ProColumns<NotificationTemplateItem>[] = [
    {
      title: $t('Type'),
      dataIndex: 'type',
      key: 'type',
      sorter: true,
      initialValue: type,
      render: (_, record: NotificationTemplateItem) => $t(record.typeLabel),
      renderFormItem: (schema, config, form) => (
        <ProFormSelect
          options={translationAllLabel(typeOptions)}
          onChange={(value: string) => {
            form.setFieldValue('type', value);
            setType(value);
            setTenantLabel(value === 'TENANT' ? userInfo.tenantNameLabel : '');
          }}
        />
      )
    },
    {
      title: $t('Template Name'),
      dataIndex: 'templateName',
      key: 'templateName',
      sorter: true,
      initialValue: storage?.templateName
    },
    {
      title: $t('Associated Tenant'),
      dataIndex: 'associatedTenant',
      key: 'associatedTenant',
      initialValue: storage?.associatedTenant ?? userInfo.tenantName,
      sorter: true,
      render: (_, record: NotificationTemplateItem) =>
        showMultipleLabel(record.associatedTenantLabel),
      renderFormItem: () => (
        <ProFormText disabled fieldProps={{ value: tenantLabel }} />
      )
    },
    {
      title: $t('Action'),
      dataIndex: 'action',
      fixed: 'right',
      valueType: 'option',
      render: (_, record: NotificationTemplateItem) => [
        <Space key="action">
          <Button
            key="edit"
            type="link"
            onClick={() => {
              navigate('./edit-notification-template');
              store.set('FIRST_LEVEL_STORAGE', { record, isEdit: true });
            }}
          >
            {$t('Edit')}
          </Button>
          {record.type !== 'SYSTEM' && (
            <CustomFormButton
              key="delete"
              type="link"
              danger
              title={$t('Are you sure to delete a notification template?')}
              onConfirm={() => handleDelete(record.id)}
            >
              {$t('Delete')}
            </CustomFormButton>
          )}
        </Space>
      ]
    }
  ];

  const handleDelete = (id: string): void => {
    deleteNotificationTemplateApi({ id }).then(() => {
      actionRef.current?.reload();
    });
  };

  const getNotificationTemplateData = async (params: any) => {
    const param: SearchNotificationTemplateParams = {
      ...omit(params, ['current']),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order,
      templateName: params.templateName?.trim()
    };
    param.associatedTenant = param.type === 'TENANT' ? userInfo.tenantName : '';

    store.set(sessionKey, {
      ...param,
      associatedTenantLabel:
        param.type === 'TENANT' ? userInfo.tenantNameLabel : ''
    });
    const result = await searchNotificationTemplateApi(param);

    return {
      data: result.data,
      success: true,
      total: result.total
    };
  };

  return (
    <CustomProTable
      headerTitle={$t('Notification Template List')}
      searchTitle={$t('Search Notification Template')}
      columns={columns}
      actionRef={actionRef}
      request={getNotificationTemplateData}
      rowKey="id"
      rowSelection={false}
      pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
      sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
      initParams={[
        { name: 'type', value: 'TENANT' },
        {
          name: 'associatedTenant',
          value: userInfo.tenantName as unknown as string
        }
      ]}
      onResetCallback={() => setTenantLabel(userInfo.tenantNameLabel)}
      toolBarRender={() => [
        <Button
          onClick={() => {
            navigate('./edit-notification-template');

            store.set('FIRST_LEVEL_STORAGE', { isEdit: false });
          }}
          key="createTemplate"
          type="primary"
        >
          <Icon type="PlusOutlined" />
          {$t('Create Template')}
        </Button>
      ]}
    />
  );
}
