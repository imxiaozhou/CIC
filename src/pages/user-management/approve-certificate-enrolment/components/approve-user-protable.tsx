import { Button } from 'antd';
import { CustomProTable, TagStatus } from '@/components/proComponents';
import { getSMAUserApproveCertPage } from '@/services/user-management';
import { ApproveCertPageDataResponse } from '@/services/user-management/approve-certificate-enrollment/type';
import { type ProColumns, TableDropdown } from '@ant-design/pro-components';
import { formatExpiration } from '@/utils';

interface PropsInterface {
  headerTitle: string;
  certificationType: string;
  id: string;
  actionRef?: any;
  onSelect: (
    key: string,
    record: ApproveCertPageDataResponse,
    headerTitle: string
  ) => void;
}

const STY_COLOR = { color: 'rgb(22, 119, 255)' };

const ApproveUserProtable = ({
  headerTitle,
  actionRef,
  onSelect,
  certificationType,
  id
}: PropsInterface) => {
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const $t = useTranslations();
  const MENUS_COLUMNS_OPTIONS = [
    { key: 'Approve', name: $t('Approve'), style: STY_COLOR },
    { key: 'Reject', name: $t('Reject'), style: STY_COLOR },
    { key: 'View', name: $t('View'), style: STY_COLOR }
    // { key: 'Download', name: $t('Download'), style: STY_COLOR }
  ];
  const isGOrECert = headerTitle.includes('g-') || headerTitle.includes('e-');
  const importDateColumns = {
    title: $t('Import Date'),
    dataIndex: 'creDt',
    sorter: true,
    render: (_: any, row: ApproveCertPageDataResponse) =>
      formatExpiration(row.creDt, dateFormat)
  };
  const createDateColumns = {
    title: $t('Create Date'),
    dataIndex: 'creDt',
    sorter: true,
    render: (_: any, row: ApproveCertPageDataResponse) =>
      formatExpiration(row.creDt, dateFormat)
  };
  const ImportOrCreateDate = isGOrECert ? importDateColumns : createDateColumns;
  const columns: ProColumns<ApproveCertPageDataResponse>[] = [
    {
      title: $t('User Name'),
      dataIndex: 'issueToCn',
      sorter: true
    },
    {
      title: $t('Start Date'),
      dataIndex: 'validFrom',
      sorter: true,
      render: (_, record) => formatExpiration(record.validFrom, dateFormat)
    },
    {
      title: $t('Expiration Date'),
      dataIndex: 'validTo',
      sorter: true,
      render: (_, record) => formatExpiration(record.validTo, dateFormat)
    },
    {
      title: $t('Certificate Type'),
      dataIndex: 'certificateTypeLabel',
      sorter: true
    },
    {
      title: $t('Certificate Status'),
      dataIndex: 'certificationStatus',
      render: (_, record) => {
        return (
          <TagStatus status={record.certificationStatus}>
            {record.certStatusLabel}
          </TagStatus>
        );
      },
      sorter: true
    },
    {
      title: $t('Approval Status'),
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: (_, record) => {
        return (
          <TagStatus status={record.approvalStatus}>
            {record.certApprovalStatusLabel}
          </TagStatus>
        );
      },
      sorter: true
    },
    ImportOrCreateDate,
    {
      title: $t('Action'),
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => {
        //  view所有情况可以按；可以按approve/reject: 'PENDING_APPR_REVOKE'/'PENDING_APPR_REMOVE'/'PENDING_APPR_RENEWAL'/'PENDING_APPR_IMPORT'/'PENDING_APPR_CREATION'；
        const statusArr = [
          'PENDING_APPR_CREATE',
          'PENDING_APPR_REMOVE',
          'PENDING_APPR_RENEW',
          'PENDING_APPR_IMPORT',
          'PENDING_APPR_REVOKE'
        ];
        const isShowDropdown = statusArr.includes(record.approvalStatus);
        return isShowDropdown ? (
          <TableDropdown
            style={{ marginLeft: 15 }}
            key="actionGroup"
            onSelect={(key) => {
              onSelect(key, record, headerTitle);
            }}
            menus={MENUS_COLUMNS_OPTIONS}
          />
        ) : (
          <Button
            key="view"
            type="link"
            onClick={() => onSelect('View', record, headerTitle)}
          >
            {$t('View')}
          </Button>
        );
      }
    }
  ];

  const getDataSource = async (params: any) => {
    const searchParams = {
      ...params,
      pageNum: params.current,
      sortField: params.columnKey,
      sortOrder: params.order
    };
    delete searchParams.current;
    const { data, total } = await getSMAUserApproveCertPage(searchParams);

    return {
      data,
      success: true,
      total
    };
  };

  return (
    <CustomProTable
      key={headerTitle}
      style={{ marginBottom: 12 }}
      columns={columns}
      headerTitle={headerTitle}
      rowKey="id"
      actionRef={actionRef}
      rowSelection={false}
      search={false}
      params={{ certificationType, id }}
      request={getDataSource}
    />
  );
};

export default ApproveUserProtable;
