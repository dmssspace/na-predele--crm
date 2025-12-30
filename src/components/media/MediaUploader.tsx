"use client";

import { useState } from "react";
import { Upload, message, Modal, Button, Progress } from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import axios from "axios";
import { API_URL } from "@providers/constants";
import type { Media } from "@/types/media";

interface MediaUploaderProps {
  mode?: "picture-card" | "picture" | "dragger";
  maxCount?: number;
  accept?: string;
  maxSize?: number;
  showPreview?: boolean;
  onUploadSuccess?: (files: Media[]) => void;
  defaultFiles?: Media[];
  uploadText?: string;
  uploadHint?: string;
  showUploadMessages?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  mode = "picture-card",
  maxCount = 1,
  accept,
  maxSize = 10,
  showPreview = true,
  onUploadSuccess,
  defaultFiles = [],
  uploadText = "Загрузить",
  uploadHint,
  showUploadMessages = true,
}) => {
  // Нормализуем accept для корректной работы с HTML input
  const normalizedAccept = accept === "image" ? "image/*" : accept;

  const [fileList, setFileList] = useState<UploadFile[]>(
    defaultFiles.map((file) => ({
      uid: file.id,
      name: file.id,
      status: "done",
      url: file.public_url,
    }))
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  const beforeUpload = (file: RcFile) => {
    console.log("beforeUpload called:", file.name, file.type, file.size);

    // Проверка размера файла
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`Файл должен быть меньше ${maxSize}МБ!`);
      return false;
    }

    // Проверка типа файла
    if (accept) {
      const acceptTypes = accept.split(",").map((type) => type.trim());
      const fileType = file.type;
      const fileName = file.name;

      console.log("Checking file type:", {
        accept,
        acceptTypes,
        fileType,
        fileName,
      });

      const isAccepted = acceptTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileName.endsWith(type);
        }
        if (type === "image" || type === "image/*") {
          return fileType.startsWith("image/");
        }
        if (type.endsWith("/*")) {
          const mainType = type.split("/")[0];
          return fileType.startsWith(mainType);
        }
        return fileType === type;
      });

      if (!isAccepted) {
        message.error(`Недопустимый тип файла. Разрешены: ${accept}`);
        return false;
      }
    }

    console.log("beforeUpload returning true");
    return true;
  };

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;
    const formData = new FormData();
    formData.append("files", file);

    try {
      setUploadProgress((prev) => ({ ...prev, [file.uid]: 0 }));

      const response = await axios.post(`${API_URL}/media/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress((prev) => ({
            ...prev,
            [file.uid]: percentCompleted,
          }));
          onProgress({ percent: percentCompleted });
        },
      });

      // Проверяем структуру ответа
      const uploadedMedia = response.data?.data?.uploaded_media;

      if (
        !uploadedMedia ||
        !Array.isArray(uploadedMedia) ||
        uploadedMedia.length === 0
      ) {
        throw new Error("Некорректный ответ от сервера");
      }

      const uploadedFile: Media = uploadedMedia[0];

      if (!uploadedFile.id) {
        throw new Error("Загруженный файл не имеет ID");
      }

      if (showUploadMessages) {
        message.success(`${file.name} успешно загружен`);
      }

      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[file.uid];
        return newProgress;
      });

      // Обновляем fileList с правильными данными
      setFileList((prevList) =>
        prevList.map((f) =>
          f.uid === file.uid
            ? {
                ...f,
                status: "done" as const,
                url: uploadedFile.public_url,
                uid: uploadedFile.id,
              }
            : f
        )
      );

      onSuccess(uploadedFile, file);

      // Callback с информацией о загруженных файлах
      if (onUploadSuccess) {
        onUploadSuccess([uploadedFile]);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      message.error(`Ошибка загрузки ${file.name}: ${error.message}`);

      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[file.uid];
        return newProgress;
      });

      onError(error);
    }
  };

  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!showPreview) return;

    let preview = file.url || file.preview;

    if (!preview && file.originFileObj) {
      preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(preview || "");
    setPreviewOpen(true);
  };

  const handleRemove = (file: UploadFile) => {
    // Удаление файла из списка
    return true;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{uploadText}</div>
    </div>
  );

  // Для режима dragger
  if (mode === "dragger") {
    return (
      <>
        <Upload.Dragger
          fileList={fileList}
          customRequest={handleUpload}
          onChange={handleChange}
          onPreview={handlePreview}
          onRemove={handleRemove}
          beforeUpload={beforeUpload}
          maxCount={maxCount}
          accept={normalizedAccept}
          multiple={maxCount > 1}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{uploadText}</p>
          {uploadHint && <p className="ant-upload-hint">{uploadHint}</p>}
        </Upload.Dragger>
        <Modal
          open={previewOpen}
          title="Предпросмотр"
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </>
    );
  }

  // Для режимов picture-card и picture
  return (
    <>
      <Upload
        listType={mode}
        fileList={fileList}
        customRequest={handleUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
        accept={normalizedAccept}
        multiple={maxCount > 1}
      >
        {fileList.length >= maxCount ? null : mode === "picture-card" ? (
          uploadButton
        ) : (
          <Button icon={<PlusOutlined />}>{uploadText}</Button>
        )}
      </Upload>
      {uploadHint && (
        <div style={{ marginTop: 8, color: "#999", fontSize: 12 }}>
          {uploadHint}
        </div>
      )}
      <Modal
        open={previewOpen}
        title="Предпросмотр"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

// Вспомогательная функция для preview
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
