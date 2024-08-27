import type { ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { ProFormDateRangePicker } from '@ant-design/pro-components';
import {
  CustomProTable,
  CustomProTableTheme
} from '@/components/proComponents';
import { Favorites } from '@/components/business';
import {
  getMobileDeviceLog,
  downloadMobileDeviceLog
} from '@/services/device-management';
import { MobileDeviceLogResponse } from '@/services/device-management/download-mobile-device-log/type';
import { formatExpiration } from '@/utils';

const getDataSource = async (params: any) => {
  const { data, total } = await getMobileDeviceLog({
    deviceId: params?.deviceId?.trim(),
    deviceModel: params?.deviceModel?.trim(),
    deviceVersion: params?.deviceVersion?.trim(),
    mobileLogUploadTime: params?.mobileLogUploadTime,
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

const DownloadMobileDeviceLog: React.FC = () => {
  const timeFormat = useAppSelector(selectTimeFormat);
  const $t = useTranslations();

  const columns: ProColumns<MobileDeviceLogResponse>[] = [
    {
      title: $t('Upload Date and Time'),
      dataIndex: 'uploadDt',
      order: 2,
      sorter: true,
      search: false,
      render: (_, record) => formatExpiration(record.uploadDt, timeFormat)
    },
    {
      title: $t('Uploaded By'),
      dataIndex: 'uploadBy',
      order: 2,
      search: false,
      sorter: true
    },
    {
      title: $t('Device ID'),
      dataIndex: 'deviceId',
      order: 2,
      sorter: true
    },
    {
      title: $t('Model'),
      dataIndex: 'deviceModel',
      sorter: true,
      order: 1,
      formItemProps: { label: $t('Device Model') }
    },
    {
      title: $t('Version'),
      dataIndex: 'deviceVersion',
      sorter: true,
      formItemProps: { label: $t('Device Version') }
    },
    {
      title: $t('Mobile Log Upload Time'),
      dataIndex: 'mobileLogUploadTime',
      sorter: true,
      valueType: 'date',
      hideInTable: true,
      renderFormItem: () => (
        <ProFormDateRangePicker name="mobileLogUploadTime" />
      )
    },
    {
      title: $t('Action'),
      dataIndex: 'action',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" onClick={() => handleDownload(record?.dvcLogId)}>
          {$t('Download')}
        </Button>
      )
    }
  ];

  const handleDownload = async (key: string) => {
    const res = await downloadMobileDeviceLog(key);
    res.filename &&
      notification.info({
        message: $t('Exporting the file...'),
        placement: 'bottom'
      });
  };

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-DVM-002" label={$t('Download Mobile Device Log')} />
      <CustomProTable
        columns={columns}
        headerTitle={$t('Mobile Device Log List')}
        searchTitle={$t('Search Mobile Device Log')}
        rowKey="dvcLogId"
        rowSelection={false}
        request={getDataSource}
      />
    </CustomProTableTheme>
  );
};
export default DownloadMobileDeviceLog;
