import { ChangeEvent, DragEvent, useMemo, useRef, useState } from 'react';
import { CloudUpload, FileText, CheckCircle2, LoaderCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUploadedFile, setColumns, setSelectedTextColumn } from '@/redux/uploadSlice';
import { toast } from '@/redux/toastSlice';
import { useUploadCsvMutation } from '@/services/api/upload';
import { BASE_URL } from '@/services/api/endpoints';
import type { ICsvColumn } from '@/services/types/upload';

function readCsvColumns(file: File): Promise<ICsvColumn[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split(/\r?\n/).filter(Boolean);
      const header = lines[0]?.split(',').map((column) => column.trim()) ?? [];
      const columns = header.map((name) => ({ name, sample: [] }));
      resolve(columns);
    };
    reader.readAsText(file);
  });
}

export default function UploadZone() {
  const dispatch = useAppDispatch();
  const uploadedFile = useAppSelector((state) => state.upload.uploadedFile);
  const [uploadCsv] = useUploadCsvMutation();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isCsv = file.name.toLowerCase().endsWith('.csv');
    if (!isCsv) {
      dispatch(toast.error({ message: 'Please upload a valid CSV file.' }));
      return;
    }

    if (!BASE_URL) {
      dispatch(toast.error({ message: 'Missing backend endpoint: VITE_REACT_APP_MTSTUDIO_ENDPOINT is not set.' }));
      event.target.value = '';
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadCsv(formData).unwrap();
      console.log('upload.response', response);
      const fileId = response.file_id ?? response.id ?? response.fileId ?? response.name ?? response.filename;

      if (!fileId) {
        throw new Error('Upload response did not include a file id.');
      }

      const fileRecord = {
        name: file.name,
        size: file.size,
        type: file.type || 'text/csv',
        lastModified: file.lastModified,
        base64: '',
        fileId,
      };

      const columns = await readCsvColumns(file);
      dispatch(setUploadedFile(fileRecord));
      dispatch(setColumns(columns));
      if (columns[0]?.name) {
        dispatch(setSelectedTextColumn(columns[0].name));
      }
      dispatch(toast.success({ message: `CSV uploaded successfully. File ID: ${fileId}` }));
    } catch (error: any) {
      const details = error as {
        status?: number;
        data?: { message?: string; error?: string };
        message?: string;
      };

      const serverMessage = details?.data?.message || details?.data?.error;
      const message = serverMessage || details?.message || 'Unable to upload the CSV file.';
      const statusInfo = details?.status ? ` (status: ${details.status})` : '';
      dispatch(toast.error({ message: `Unable to upload the CSV file.${statusInfo} ${message}` }));
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = async (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    const fileList = event.dataTransfer.files;
    if (!fileList?.length) return;

    const fakeInputEvent = {
      target: { files: fileList, value: '' },
      currentTarget: { value: '' },
    } as unknown as ChangeEvent<HTMLInputElement>;

    await handleFileSelection(fakeInputEvent);
  };

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };

  const statusLabel = useMemo(() => {
    if (isUploading) return 'Uploading…';
    if (uploadedFile) return 'Verified';
    return 'Awaiting file';
  }, [isUploading, uploadedFile]);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
          1
        </div>
        <h3 className="font-semibold text-lg text-gray-900">File Handling</h3>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${isDragActive ? 'border-primary-500 bg-primary-100/30' : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50/30'} group cursor-pointer`}
      >
        <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileSelection} />
        <motion.div
          whileHover={{ scale: 1.08 }}
          className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 mb-4"
        >
          {isUploading ? <LoaderCircle size={24} className="animate-spin" /> : <CloudUpload size={24} />}
        </motion.div>
        <p className="font-semibold text-sm text-gray-700">Drop your CSV files here</p>
        <p className="text-xs text-gray-400 mt-1">or click to browse · max 50 MB</p>
      </button>

      <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 text-primary-500 rounded-lg">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{uploadedFile?.name ?? 'No CSV selected'}</p>
            <p className="text-[10px] text-gray-400">{uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB` : 'Waiting for upload'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-accent-600">
          <CheckCircle2 size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{statusLabel}</span>
        </div>
      </div>
    </div>
  );
}
