import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { omit } from 'lodash-es';
import type { ProColumns } from '@ant-design/pro-components';
import { TableDropdown } from '@ant-design/pro-components';
import Icon from '@/components/Icons';
import {
  CustomModal,
  CustomProTable,
  CustomProTableTheme,
  TagStatus
} from '@/components/proComponents';
import {
  downloadCertificate,
  getBasicCertList,
  updateApprStatus
} from '@/services/user-management';
import { formatExpiration } from '@/utils';
import {
  UpdateApprStatus,
  SearchResponse
} from '@/services/user-management/maintain-user-certificate/type';
import ImportModal from './ImportModal';
import { CertificationTypeItem } from '../type';

interface PropsInterface {
  rowKey: string;
  state: SearchResponse;
  headerTitle: string;
  actionRef: any;
}

const STY_COLOR = { color: '#0074E6' };
export default function CertificateSectionsProTable({
  rowKey,
  state,
  headerTitle,
  actionRef
}: Readonly<PropsInterface>) {
  const navigateTo = useNavigate();
  const store = useStorage();
  const dateFormat = 'YYYY-MM-DD HH:mm:ss'; // useAppSelector(selectDateFormat)='MM-DD-YYYY'
  const [isShow, setIsShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [actionsParam, setActionsParam] = useState<UpdateApprStatus>({});
  //  MENUS_OPTIONS
  const renew = { key: 'renew', name: $t('Renew'), style: STY_COLOR };
  const revoke = { key: 'revoke', name: $t('Revoke'), style: STY_COLOR };
  const remove = { key: 'remove', name: $t('Remove'), style: STY_COLOR };
  const download = { key: 'download', name: $t('Download'), style: STY_COLOR };
  // ①Create, Import, Renew buttons根据 "User Status" = Enable展示
  const userStatusFlag = state?.userStatusLabel === 'Enable';
  // ①g-cert 和 e-cert 不需要create，需要import；rm 和 cm相反
  const isGOrECert = headerTitle.includes('g-') || headerTitle.includes('e-');
  const importDateColumns = {
    title: $t('Import Date'),
    dataIndex: 'creDt',
    sorter: true,
    render: (_: any, row: CertificationTypeItem) =>
      formatExpiration(row.creDt, dateFormat)
  };
  const createDateColumns = {
    title: $t('Create Date'),
    dataIndex: 'creDt',
    sorter: true,
    render: (_: any, row: CertificationTypeItem) =>
      formatExpiration(row.creDt, dateFormat)
  };
  const ImportOrCreateDate = isGOrECert ? importDateColumns : createDateColumns;
  const columns: ProColumns<CertificationTypeItem>[] = [
    {
      title: $t('User Name'),
      dataIndex: 'issueToCn',
      sorter: true
    },
    {
      title: $t('Start Date'),
      dataIndex: 'validFrom',
      sorter: true,
      render: (_, row) => formatExpiration(row.validFrom, dateFormat)
    },
    {
      title: $t('Expiration Date'),
      dataIndex: 'validTo',
      sorter: true,
      render: (_, row) => formatExpiration(row.validTo, dateFormat)
    },
    {
      title: $t('Certificate Type'),
      dataIndex: 'certTypeLabel',
      sorter: true
    },
    {
      title: $t('Certificate Status'),
      dataIndex: 'certStatus',
      sorter: true,
      render: (_, record) => (
        <TagStatus status={record.certStatus}>
          {record.certStatusLabel}
        </TagStatus>
      )
    },
    {
      title: $t('Approval Status'),
      dataIndex: 'apprStatus',
      sorter: true,
      render: (_, record) => (
        <TagStatus status={record.apprStatus}>
          {record.apprStatusLabel}
        </TagStatus>
      )
    },
    ImportOrCreateDate,
    {
      title: $t('Action'),
      dataIndex: 'actions',
      valueType: 'option',
      width: 120,
      render: (_, record) => {
        // ①apprStatus=APPROVED可以按所有功能（download/renew/revoke/remove）；view所有情况可以按
        /* ②5.22
          当cert_status = 'Active' 且 Appr_stauts = 'Approved' 时才能renew, revoke, remove
          对于 g-cert 和 e-cert：不需要renew 
          ③5.28 如果 cert_type = Expired，则让用户单击renew
          gcert 和 ecert 不需要 revoke
          ④7.17 if  cert_status=removed and Appr_stauts=approved，不需要download
        */
        const isShowDropdown = record.apprStatus === 'APPROVED';
        const { certStatusLabel, apprStatusLabel } = record;
        let MENUS_OPTIONS = [
          { key: 'view', name: $t('View'), style: STY_COLOR }
        ];
        if (certStatusLabel !== 'Removed' || apprStatusLabel !== 'Approved') {
          MENUS_OPTIONS.push(download);
        }
        if (certStatusLabel === 'Active' && apprStatusLabel === 'Approved') {
          if (userStatusFlag && !isGOrECert) {
            MENUS_OPTIONS.push(renew);
          }
          !isGOrECert && MENUS_OPTIONS.push(revoke);
          MENUS_OPTIONS.push(remove);
        } else if (certStatusLabel === 'Expired') {
          MENUS_OPTIONS.push(renew);
        }

        return [
          isShowDropdown ? (
            <TableDropdown
              style={{ marginLeft: 15 }}
              key="actionGroup"
              menus={MENUS_OPTIONS}
              onSelect={(key) => handleActions(key, record)}
            />
          ) : (
            <Button
              key="view"
              type="link"
              onClick={() => handleActions('view', record)}
            >
              {$t('View')}
            </Button>
          )
        ];
      }
    }
  ];

  const handleCreate = () => {
    store.set('SECOND_LEVEL_STORAGE', {
      state,
      certType: rowKey,
      certCreateType: 'create'
    });
    navigateTo('./certificate-create');
  };
  const handleImportOpen = () => {
    setIsShow(true);
  };
  const handleImportClose = (flag: string) => {
    setIsShow(false);
    flag && actionRef.current?.reload();
  };
  const handleActions = async (
    action: string,
    record: CertificationTypeItem
  ) => {
    const { userCertId } = record;
    let res;

    switch (action) {
      case 'view':
        store.set('SECOND_LEVEL_USR005_CERT_RECORD', {
          userCertId
        });
        navigateTo('./certificate-detail');
        break;
      case 'download':
        // Exporting the file..
        res = await downloadCertificate(userCertId);
        res.filename &&
          notification.info({
            message: $t('Download Successfully')
          });
        break;
      case 'renew': // 'PENDING_APPR_RENEW' 相当于copy
        store.set('SECOND_LEVEL_STORAGE', {
          state,
          certType: rowKey,
          record,
          certCreateType: 'renew'
        });
        navigateTo('./certificate-create');
        break;
      case 'revoke':
        setActionsParam({ userCertId, apprStatus: 'PENDING_APPR_REVOKE' });
        setIsModalOpen(true);
        setModalTitle($t('Confirm to Revoke?'));
        break;
      case 'remove':
        setActionsParam({ userCertId, apprStatus: 'PENDING_APPR_REMOVE' });
        setIsModalOpen(true);
        setModalTitle($t('Confirm to Remove?'));
        break;
      default:
        break;
    }
  };
  const handleOk = async () => {
    const res = await updateApprStatus(actionsParam);
    if (res.status?.code === 0) {
      setIsModalOpen(false);
      setModalTitle('');
      actionRef.current?.reload();
      const msg =
        actionsParam.apprStatus === 'PENDING_APPR_REVOKE'
          ? $t('Revoke Success')
          : $t('Remove Success');
      notification.success({ message: msg });
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const getDataSource = async (params: any) => {
    const param = {
      userId: state?.userId, // '1000001'
      certType: rowKey, // RM CM G_CERT E_CERT
      ...omit(params, ['current']),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order
    };
    const { data } = await getBasicCertList(param);
    return {
      data: data?.userCertList,
      success: true,
      total: data?.total
    };
  };

  return (
    <CustomProTableTheme>
      <CustomProTable
        style={{ marginTop: 12 }}
        rowKey="userCertId"
        columns={columns}
        headerTitle={headerTitle}
        actionRef={actionRef}
        search={false}
        rowSelection={false}
        request={getDataSource}
        toolBarRender={() => {
          return [
            !isGOrECert && userStatusFlag && (
              <Button
                key="create"
                ghost
                type="primary"
                icon={<Icon type="PlusOutlined" />}
                onClick={handleCreate}
              >
                {$t('Create')}
              </Button>
            ),
            isGOrECert && userStatusFlag && (
              <Button
                key="import"
                ghost
                type="primary"
                icon={<Icon type="DeliveredProcedureOutlined" />}
                onClick={handleImportOpen}
              >
                {$t('Import')}
              </Button>
            )
          ];
        }}
      />
      <ImportModal
        isOpen={isShow}
        onCancel={handleImportClose}
        state={state}
        certType={rowKey}
      />
      {/* revoke/remove统一加个确认框  */}
      <CustomModal
        open={isModalOpen}
        title={modalTitle}
        type="warning"
        onOk={handleOk}
        onCancel={handleCancel}
        zIndex={101}
      />
    </CustomProTableTheme>
  );
}
