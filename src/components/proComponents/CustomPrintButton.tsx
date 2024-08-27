import Icon from '@/components/Icons';
import { CustomPrintButtonProps } from '@/types/proComponents';
import { Button, Space } from 'antd';

const CustomPrintButton = ({
  handlePrintInCSV,
  handlePrintInPDF
}: CustomPrintButtonProps) => {
  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const CSV_PDF_TEXT = {
    csv: $t('Export in CSV'),
    pdf: $t('Export in PDF')
  };

  const printInCSV = async () => {
    setCsvLoading(true);
    try {
      handlePrintInCSV?.();
    } finally {
      setCsvLoading(false);
    }
  };

  const printInPDF = async () => {
    setPdfLoading(true);
    try {
      handlePrintInPDF?.();
    } finally {
      setPdfLoading(false);
    }
  };
  return (
    <Space key="space">
      <Button
        ghost
        type="primary"
        icon={<Icon type="DownloadOutlined" />}
        onClick={printInCSV}
        key="csv"
        loading={csvLoading}
      >
        {CSV_PDF_TEXT.csv}
      </Button>
      <Button
        ghost
        type="primary"
        icon={<Icon type="DownloadOutlined" />}
        onClick={printInPDF}
        key="pdf"
        loading={pdfLoading}
      >
        {CSV_PDF_TEXT.pdf}
      </Button>
    </Space>
  );
};

export default CustomPrintButton;
