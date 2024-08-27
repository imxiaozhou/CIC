import { AdjustMessageStorageQuota, Favorites } from '@/components/business';
import { MessageStorageQuotaItem } from '@/types/business';
import {
  adjustMessageStorageQuotaOrganizationApi,
  organizationMessageStorageQuotaDetailApi
} from '@/services/system-configurations/maintain-organisation-total-message';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { OrganizationItem } from '../type';
import { CustomModal } from '@/components/proComponents';

const AdjustOrganizationMessageParameters = () => {
  const navigate = useNavigate();
  const store = useStorage();
  const state = store.get('FIRST_LEVEL_STORAGE');

  const userInfo = useAppSelector(selectUserInfo);
  const [adjustMessageData, setAdjustMessageData] =
    useState<MessageStorageQuotaItem>();
  const [successVisible, setSuccessVisible] = useState(false);
  const initData = async () => {
    const selectedGroup = state?.map((item: OrganizationItem) => {
      return { label: item.tenantName, value: item.id };
    });
    if (state?.length === 1) {
      const item = state[0];
      const warningLevel = item.warningLevel?.slice(0, -2);
      const cannotSendLimit = item.cannotSendLimit?.slice(0, -2);
      const cannotReceiveLimit = item.cannotReceiveLimit?.slice(0, -2);
      const getInitData = {
        selectedGroup,
        warningLevel: { number: Number(warningLevel), unit: 'GB' },
        cannotSendLimit: { number: Number(cannotSendLimit), unit: 'GB' },
        cannotReceiveLimit: { number: Number(cannotReceiveLimit), unit: 'GB' }
      };
      setAdjustMessageData(getInitData);
    } else {
      const param = state?.map((item: OrganizationItem) => item.id);
      const res = await organizationMessageStorageQuotaDetailApi(param);
      const { warningLevel, cannotSendLimit, cannotReceiveLimit } = res.data;
      const getInitData = {
        selectedGroup,
        warningLevel: { number: Number(warningLevel.number), unit: 'GB' },
        cannotSendLimit: { number: Number(cannotSendLimit.number), unit: 'GB' },
        cannotReceiveLimit: {
          number: Number(cannotReceiveLimit.number),
          unit: 'GB'
        }
      };
      setAdjustMessageData(getInitData);
    }
  };

  useEffect(() => {
    initData();
  }, []);
  const handleUpdate = (fields: MessageStorageQuotaItem) => {
    const selectdGroup = fields.selectedGroup.map((item: LabelValue) => {
      return { id: item.value };
    });
    const param = {
      selectdGroup,
      warningLevel: fields?.warningLevel,
      cannotReceiveLimit: fields?.cannotReceiveLimit,
      cannotSendLimit: fields?.cannotSendLimit,
      userId: userInfo.id
    };
    adjustMessageStorageQuotaOrganizationApi(param).then((res) => {
      if (res.status.code === 0) setSuccessVisible(true);
    });
  };

  return (
    <>
      <Favorites
        code="FD-S-SYS-004"
        label={$t('Maintain Organisation Setting of Mailbox Storage Quota')}
      />
      {adjustMessageData ? (
        <AdjustMessageStorageQuota
          selectedTitle="Tenant"
          data={adjustMessageData}
          onUpdate={(fields) => handleUpdate(fields)}
        />
      ) : (
        <Spin spinning={!adjustMessageData} />
      )}

      <CustomModal
        open={successVisible}
        title={$t('Message Storage Quota is updated successfully')}
        type="info"
        okText={$t('Ok')}
        onOk={() => navigate(-1)}
        onCancel={() => setSuccessVisible(false)}
      />
    </>
  );
};

export default AdjustOrganizationMessageParameters;
