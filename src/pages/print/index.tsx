import { useState, useEffect } from 'react';
import Papa from 'papaparse'; // 引入PapaParse库来解析CSV
import { useLocation } from 'react-router-dom';
import './index.less';
import Icon from '@/components/Icons';
import { Button } from 'antd';

function CsvTable({ data }: any) {
  return (
    <table className="csv-table">
      <thead>
        <tr>
          {data[0] &&
            Object.keys(data[0]).map((header, index) => (
              <th
                key={`header-${header}`}
                className={
                  index === 0 && data.length - 1 === 0
                    ? 'hide-first-column-last-row'
                    : ''
                }
              >
                {header}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {data.map(
          (
            row: { [s: string]: unknown } | ArrayLike<unknown>,
            rowIndex: number // 更改any为number类型
          ) => (
            <tr key={`row-${JSON.stringify(row)}`}>
              {Object.values(row).map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className={
                    rowIndex === data.length - 1 && cellIndex === 0
                      ? 'hide-first-column-last-row'
                      : ''
                  }
                >
                  {cell as any}
                </td>
              ))}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export default function Print() {
  const location = useLocation();
  const { search } = location;
  const url = decodeURIComponent(search.slice(1));
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    async function fetchAndParseCsv() {
      try {
        const response = await fetch(url);
        const text = await response.text();
        const parsedData = Papa.parse(text, { header: true }).data; // 解析CSV为对象数组
        setCsvData(parsedData);
      } catch (error) {
        console.error('Failed to load or parse CSV:', error);
      }
    }

    if (url) {
      fetchAndParseCsv();
    }
  }, [url]);

  const handleClick = () => {
    window.print();
  };

  return (
    <>
      {csvData.length > 0 && (
        <div className="print">
          <div className="header">
            <Button onClick={handleClick} type="text" className="print-btn">
              <Icon type="PrinterOutlined" className="print-icon" />
            </Button>
          </div>
          <div className="container">
            <CsvTable data={csvData} />
          </div>
        </div>
      )}
    </>
  );
}
