import { Favorites } from '@/components/business';
import { Spin } from 'antd';
import {
  getMessageParamDef,
  adjustMessageParameters
} from '@/services/system-configurations';
import { useNavigate } from 'react-router-dom';
import AdjustParameters from './AdjustParameters';
import { CustomModal } from '@/components/proComponents';

export interface MessageParametersItem {
  id?: string;
  selectedGroup: LabelValue[];
  maxRecipients: string | number;
  predefinedPeriod: string | number;
  maxEmail: string | number;
}

const AdjustMessageParameters = () => {
  const navigate = useNavigate();
  const store = useStorage();
  const state = store.get('FIRST_LEVEL_STORAGE');

  const [adjustMessageData, setAdjustMessageData] =
    useState<MessageParametersItem>();
  const [successVisible, setSuccessVisible] = useState(false);

  const handleUpdate = async (fields: MessageParametersItem) => {
    const userIds = fields.selectedGroup?.map((item) => item.value);
    const param = {
      userIds,
      maxRecipients: fields.maxRecipients as string,
      predefinedPeriod: fields.predefinedPeriod as string,
      maxEmail: fields.maxEmail as string
    };
    await adjustMessageParameters(param).then((res) => {
      if (res.status.code === 0) setSuccessVisible(true);
    });
  };

  const initData = async () => {
    const selectedGroup = state?.map((item: any) => {
      return { label: item.displayName, value: item.userId };
    });
    // detail数据：选一个的话state从table带过去，选多个调详情接口查默认值
    if (state?.length === 1) {
      const item = state[0];
      const maxRecipients = Number(item.maxRecipients);
      const predefinedPeriod = Number(item.predefinedPeriod);
      const maxEmail = Number(item.maxEmail);
      const getInitData = {
        selectedGroup,
        maxRecipients,
        predefinedPeriod,
        maxEmail
      };
      setAdjustMessageData(getInitData);
    } else {
      const param = state?.map((item: any) => item.userId);
      const res = await getMessageParamDef(param);
      const { maxRecipients, predefinedPeriod, maxEmail } = res.data;
      const getInitData = {
        selectedGroup,
        maxRecipients: Number(maxRecipients),
        predefinedPeriod: Number(predefinedPeriod),
        maxEmail: Number(maxEmail)
      };
      setAdjustMessageData(getInitData);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <>
      <Favorites
        code="FD-S-SYS-007"
        label={$t('Maintain Message Parameters')}
      />
      {adjustMessageData ? (
        <AdjustParameters
          selectedTitle="Selected User"
          data={adjustMessageData}
          onUpdate={handleUpdate}
        />
      ) : (
        <Spin spinning={!adjustMessageData} />
      )}

      <CustomModal
        open={successVisible}
        title={$t('Message Parameter is updated successfully')}
        type="info"
        okText={$t('Ok')}
        onOk={() => navigate(-1)}
        onCancel={() => setSuccessVisible(false)}
      />
    </>
  );
};

export default AdjustMessageParameters;
