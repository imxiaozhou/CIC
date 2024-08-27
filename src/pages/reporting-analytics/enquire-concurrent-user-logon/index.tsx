import type { ProColumns } from '@ant-design/pro-components';
import { Favorites } from '@/components/business';
import {
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable
} from '@/components/proComponents';
import { getCommonOptions } from '@/services/common';
import { translationAllLabel, formatExpiration } from '@/utils';
import { getConcurrentUserLogon } from '@/services/reporting-analytics';
import { SerLogonResponse } from '@/services/reporting-analytics/enquire-concurrent-user-logon/type';

const getDataSource = async (params: any) => {
  const { data, total } = await getConcurrentUserLogon({
    tenantName: params?.tenantName,
    deviceType: params?.deviceType,
    displayName: params?.displayName,
    ip: params?.ip,
    pageNum: params.current,
    pageSize: params.pageSize,
    sortField: params.columnKey,
    sortOrder: params.order
  });

  return {
    data,
    success: true,
    total
  };
};

const EnquireConcurrentUserLogon: React.FC = () => {
  const userInfo = useAppSelector(selectUserInfo);
  const [deviceType, setDeviceType] = useState<LabelValue[]>([]);
  const timeFormat = useAppSelector(selectTimeFormat);
  const $t = useTranslations();

  const columns: ProColumns<SerLogonResponse>[] = [
    {
      title: $t('Tenant Name'),
      key: 'tenantName',
      dataIndex: 'tenantName',
      initialValue: userInfo.tenantName,
      order: 4,
      sorter: true,
      renderFormItem(schema, config, form, action) {
        return (
          <SelectSearchable
            defaultValue={[
              {
                label: userInfo.tenantNameLabel,
                value: userInfo.tenantName
              }
            ]}
            disabled={!userInfo.userRole!.includes('SUPER_ADM')}
            onValueChange={(newValue: LabelValue[]) => {
              form.setFieldsValue({
                tenantName: newValue[0]?.value
              });
            }}
          />
        );
      }
    },
    {
      title: $t('Logon Time'),
      dataIndex: 'logonTime',
      sorter: true,
      hideInSearch: true,
      render: (_, record) => formatExpiration(record.logonTime, timeFormat)
    },
    {
      title: $t('Duration'),
      dataIndex: 'duration',
      sorter: true,
      hideInSearch: true
    },
    {
      title: $t('Display Name'),
      dataIndex: 'displayName',
      sorter: true,
      order: 3
    },
    {
      title: $t('Device Type'),
      dataIndex: 'deviceType',
      sorter: true,
      valueType: 'select',
      order: 2,
      fieldProps: {
        options: translationAllLabel(deviceType)
      },
      render: (_, record) => $t(record.deviceType)
    },
    {
      title: $t('Mobile ID'),
      dataIndex: 'mobileId',
      sorter: true,
      hideInSearch: true
    },
    {
      title: $t('IP'),
      dataIndex: 'ip',
      sorter: true,
      order: 1
    }
  ];

  const getDeviceType = (): void => {
    getCommonOptions({
      mstType: 'LOGON_DEVICE_TYPE'
    }).then((options) => {
      setDeviceType(options);
    });
  };

  useEffect(() => {
    getDeviceType();
  }, []);

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-RPT-004"
        label={$t('Enquire Concurrent User Logon')}
      />
      <CustomProTable
        columns={columns}
        headerTitle={$t('Concurrent User Logon Records')}
        searchTitle={$t('Search Concurrent User Logon Records')}
        rowKey="id"
        rowSelection={false}
        request={getDataSource}
      />
    </CustomProTableTheme>
  );
};

export default EnquireConcurrentUserLogon;
