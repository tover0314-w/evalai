import * as XLSX from 'xlsx';

export interface FileData {
  [key: string]: any[];
}

export async function parseFile(file: File): Promise<FileData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error('无法读取文件');
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const result: FileData = {};

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
        });

        resolve(result);
      } catch (error) {
        reject(new Error('文件解析失败：' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsBinaryString(file);
  });
}

export function validateFileFormat(file: File): boolean {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    'text/csv', // csv
  ];
  return allowedTypes.includes(file.type);
}

export function exportToExcel(data: any[], fileName: string = 'export.xlsx'): void {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, fileName);
} 