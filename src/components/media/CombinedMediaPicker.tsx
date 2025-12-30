"use client";

import { Tabs, Space, Image, Card, Button } from "antd";
import { MediaUploader } from "./MediaUploader";
import { MediaSelector } from "./MediaSelector";
import {
  UploadOutlined,
  FileImageOutlined,
  CloseOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useMany } from "@refinedev/core";
import { Media } from "@/types/media";

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
  const {
    query: { data: mediaData },
  } = useMany<Media>({
    resource: "media",
    ids: value,
    queryOptions: {
      enabled: value.length > 0,
    },
  });

  const selectedMedia = mediaData?.data || [];

  const handleUploadSuccess = (files: Media[]) => {
    const newIds = files.filter((f) => f && f.id).map((f) => f.id);

    if (newIds.length === 0) {
      return;
    }

    if (multiple) {
      const uniqueIds = Array.from(new Set([...value, ...newIds]));
      onChange?.(uniqueIds);
    } else {
      onChange?.(newIds.slice(0, 1));
    }
  };

  const handleSelectChange = (selectedIds: string[]) => {
    onChange?.(selectedIds);
  };

  const handleRemove = (idToRemove: string) => {
    const newIds = value.filter((id) => id !== idToRemove);
    onChange?.(newIds);
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
            showPreview={false}
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

  return (
    <>
      <Tabs defaultActiveKey="select" items={items} />

      {selectedMedia.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            Выбрано файлов: {selectedMedia.length}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 8,
            }}
          >
            {selectedMedia.map((media) => (
              <Card
                key={media.id}
                size="small"
                style={{ position: "relative" }}
                bodyStyle={{ padding: 0 }}
                cover={
                  media.type === "image" ? (
                    <div style={{ height: 100, overflow: "hidden" }}>
                      <Image
                        src={media.public_url}
                        alt={"Media"}
                        height={100}
                        width="100%"
                        style={{ objectFit: "cover" }}
                        preview={true}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f0f0f0",
                      }}
                    >
                      <FileOutlined style={{ fontSize: 32, color: "#999" }} />
                    </div>
                  )
                }
              >
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleRemove(media.id)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "rgba(255, 255, 255, 0.9)",
                  }}
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
