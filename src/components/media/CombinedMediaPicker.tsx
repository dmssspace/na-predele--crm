"use client";

import { Tabs, Space } from "antd";
import { MediaUploader } from "./MediaUploader";
import { MediaSelector } from "./MediaSelector";
import { UploadOutlined, FileImageOutlined } from "@ant-design/icons";

interface MediaFile {
  id: string;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
}

interface CombinedMediaPickerProps {
  value?: string[];
  onChange?: (selectedIds: string[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxUploadCount?: number;
  uploaderMode?: "picture-card" | "picture" | "dragger";
}

export const CombinedMediaPicker: React.FC<CombinedMediaPickerProps> = ({
  value = [],
  onChange,
  multiple = true,
  accept,
  maxSize = 10,
  maxUploadCount,
  uploaderMode = "picture-card",
}) => {
  const handleUploadSuccess = (files: MediaFile[]) => {
    const newIds = files.filter((f) => f && f.id).map((f) => f.id);

    if (newIds.length === 0) {
      return;
    }

    if (multiple) {
      onChange?.([...value, ...newIds]);
    } else {
      onChange?.(newIds.slice(0, 1));
    }
  };

  const handleSelectChange = (selectedIds: string[]) => {
    onChange?.(selectedIds);
  };

  const items = [
    {
      key: "select",
      label: (
        <span>
          <FileImageOutlined /> Выбрать из библиотеки
        </span>
      ),
      children: (
        <div style={{ padding: "16px 0" }}>
          <MediaSelector
            value={value}
            onChange={handleSelectChange}
            multiple={multiple}
            accept={accept}
            buttonText="Выбрать файлы"
            showPreview={true}
          />
        </div>
      ),
    },
    {
      key: "upload",
      label: (
        <span>
          <UploadOutlined /> Загрузить новые
        </span>
      ),
      children: (
        <div style={{ padding: "16px 0" }}>
          <MediaUploader
            mode={uploaderMode}
            maxCount={maxUploadCount || (multiple ? 10 : 1)}
            accept={accept}
            maxSize={maxSize}
            onUploadSuccess={handleUploadSuccess}
            uploadText="Загрузить файлы"
            uploadHint={
              accept
                ? `Разрешены: ${accept}. Максимальный размер: ${maxSize}МБ`
                : `Максимальный размер: ${maxSize}МБ`
            }
          />
        </div>
      ),
    },
  ];

  return <Tabs defaultActiveKey="select" items={items} />;
};
