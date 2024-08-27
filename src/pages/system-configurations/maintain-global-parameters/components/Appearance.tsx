import { Divider } from 'antd';
import { AppearanceProps } from '../type';
import UploadItem from './UploadItem';
import { ForwardedRef, forwardRef, useImperativeHandle } from 'react';

interface Props {
  values: AppearanceProps;
  ref: ForwardedRef<AppearanceProps>;
}
const Index = forwardRef((prop: Props, ref: ForwardedRef<AppearanceProps>) => {
  const { values } = prop;
  const [detailsValue, setDetailsValue] = useState(values);

  const $t = useTranslations();

  useImperativeHandle(
    ref,
    () => {
      return detailsValue;
    },
    [detailsValue]
  );

  return (
    <>
      <UploadItem
        label={$t('Web App')}
        value={values?.webApp}
        onChange={(value) => {
          let v = {
            ...detailsValue,
            webApp: value
          };
          setDetailsValue(v);
        }}
      />
      <Divider />
      <UploadItem
        label={$t('Mobile App')}
        value={values?.mobileApp}
        onChange={(value) => {
          let v = {
            ...detailsValue,
            mobileApp: value
          };
          setDetailsValue(v);
        }}
      />
    </>
  );
});

export default Index;
