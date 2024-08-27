import { Tabs } from 'antd';
import FAQsConfigItem from './FAQsConfigItem';

const { TabPane } = Tabs;

const Index = (props: any) => {
  const { values, onChange } = props;
  const $t = useTranslations();

  return (
    <Tabs>
      <TabPane tab={$t('FAQs')} key="1">
        <FAQsConfigItem
          values={values?.faq}
          onChange={(value: any) => {
            onChange(Object.assign(values, { faq: value }));
          }}
        />
      </TabPane>
      <TabPane tab={$t('Customer Support Page')} key="2">
        <FAQsConfigItem
          values={values?.customerSupPage}
          onChange={(value: any) => {
            onChange(Object.assign(values, { customerSupPage: value }));
          }}
        />
      </TabPane>
      <TabPane tab={$t('Mobile FAQs')} key="3">
        <FAQsConfigItem
          values={values?.mobileFaq}
          onChange={(value: any) => {
            onChange(Object.assign(values, { mobileFaq: value }));
          }}
        />
      </TabPane>
      <TabPane tab={$t('Password Policy')} key="4">
        <FAQsConfigItem
          values={values?.passwordPolicy}
          onChange={(value: any) => {
            onChange(Object.assign(values, { passwordPolicy: value }));
          }}
        />
      </TabPane>
    </Tabs>
  );
};

export default Index;
