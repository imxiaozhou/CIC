import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      className="site-footer"
      copyright={false}
      links={[
        {
          key: '',
          title: '',
          href: '',
          blankTarget: false
        }
      ]}
    />
  );
};

export default Footer;
