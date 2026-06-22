export interface IUploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  base64: string;
}

export interface ICsvColumn {
  name: string;
  sample: string[]; // first few values from the column for preview
}

export interface ICsvPreviewRow {
  [columnName: string]: string;
}
