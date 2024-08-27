import { printStreamFile } from '@/utils';

export const usePrint = function () {
  const [url, setUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [pdfWin, setPdfWin] = useState<Window>();
  const [csvWin, setCsvWin] = useState<Window>();

  const openPrint = (data: Blob, fileName: string, fileType: string) => {
    const newUrl = printStreamFile(data, fileName, fileType);
    setUrl(newUrl);
    setFileType(fileType);
  };

  useEffect(() => {
    if (url) {
      if (fileType === 'application/pdf') {
        pdfWin?.close();
        const newPdfWin = window.open(url);
        setPdfWin(newPdfWin as Window);
      } else if (fileType.includes('application/csv')) {
        csvWin?.close();
        const newCsvWin = window.open('/print?' + url);
        setCsvWin(newCsvWin as Window);
      }
    }

    return () => {
      window.URL.revokeObjectURL(url);
    };
  }, [url]);

  return openPrint;
};
