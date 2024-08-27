import Editor from './Editor';

const Index = (props: any) => {
  const { values, onChange } = props;

  return (
    <>
      <Editor
        value={values?.english}
        label={$t('English')}
        onChange={(value) => {
          onChange(Object.assign(values, { english: value }));
        }}
      />
      <Editor
        value={values?.traditionalChinese}
        label={$t('Traditional Chinese')}
        onChange={(value) => {
          onChange(Object.assign(values, { traditionalChinese: value }));
        }}
      />
      <Editor
        value={values?.simplifiedChinese}
        label={$t('Simplified Chinese')}
        onChange={(value) => {
          onChange(Object.assign(values, { simplifiedChinese: value }));
        }}
      />
    </>
  );
};

export default Index;
