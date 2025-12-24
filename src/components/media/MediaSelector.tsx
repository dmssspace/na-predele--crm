"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Image,
  Input,
  Spin,
  Empty,
  Pagination,
  Space,
  Card,
  Tag,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FileImageOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useList } from "@refinedev/core";

interface MediaFile {
  id: string;
  user_id: string;
  type: string;
  status: string;
  public_url: string;
  metadata: object;
  created_at: string;
  updated_at: string;
}

interface MediaSelectorProps {
  value?: string[];
  onChange?: (selectedIds: string[]) => void;
  multiple?: boolean;
  accept?: string;
  buttonText?: string;
  showPreview?: boolean;
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  value = [],
  onChange,
  multiple = true,
  accept,
  buttonText = "Выбрать медиа",
  showPreview = true,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const { query } = useList<MediaFile>({
    resource: "media",
    pagination: {
      currentPage,
      pageSize,
    },
    filters: searchText
      ? [
          {
            field: "filename",
            operator: "contains",
            value: searchText,
          },
        ]
      : [],
  });

  const { data, isLoading } = query;
  const mediaFiles = data?.data || [];

  const total = data?.pagination?.total || 0;

  useEffect(() => {
    if (modalOpen) {
      setSelectedIds(value || []);
    }
  }, [modalOpen]);

  const handleSelect = (id: string) => {
    let newSelected: string[];

    if (multiple) {
      if (selectedIds.includes(id)) {
        newSelected = selectedIds.filter((selectedId) => selectedId !== id);
      } else {
        newSelected = [...selectedIds, id];
      }
    } else {
      newSelected = [id];
    }

    setSelectedIds(newSelected);
  };

  const handleOk = () => {
    onChange?.(selectedIds);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setSelectedIds(value);
    setModalOpen(false);
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  const filterByAccept = (file: MediaFile) => {
    if (!accept) return true;

    return file.type === accept;
  };

  const filteredFiles = mediaFiles.filter(filterByAccept);

  const getSelectedPreviews = () => {
    if (!showPreview || selectedIds.length === 0) return null;

    const selectedFiles = mediaFiles.filter((file) =>
      selectedIds.includes(file.id)
    );

    return (
      <Space wrap style={{ marginTop: 8 }}>
        {selectedFiles.map((file) => (
          <Card
            key={file.id}
            size="small"
            style={{ width: 100 }}
            cover={
              file.type === "image" ? (
                <Image
                  src={file.public_url}
                  alt={"Изображение"}
                  height={80}
                  style={{ objectFit: "cover" }}
                  preview={false}
                />
              ) : (
                <div
                  style={{
                    height: 80,
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
            <Card.Meta
              description={
                <div
                  style={{
                    fontSize: 11,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {file.id}
                </div>
              }
            />
          </Card>
        ))}
      </Space>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <>
      <div>
        <Button icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          {buttonText}
        </Button>
        {selectedIds.length > 0 && (
          <Tag color="blue" style={{ marginLeft: 8 }}>
            Выбрано: {selectedIds.length}
          </Tag>
        )}
        {getSelectedPreviews()}
      </div>

      <Modal
        title="Выбрать медиа файлы"
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        okText="Подтвердить"
        cancelText="Отмена"
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Поиск по названию файла..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            allowClear
          />
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <Empty description="Медиа файлы не найдены" />
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 12,
                maxHeight: 500,
                overflowY: "auto",
                padding: 4,
              }}
            >
              {filteredFiles.map((file) => {
                const selected = isSelected(file.id);
                return (
                  <Card
                    key={file.id}
                    size="small"
                    hoverable
                    onClick={() => handleSelect(file.id)}
                    style={{
                      border: selected
                        ? "2px solid #1890ff"
                        : "1px solid #d9d9d9",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    cover={
                      file.type === "image" ? (
                        <div
                          style={{
                            height: 120,
                            width: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src={file.public_url}
                            alt={"Изображение"}
                            height={120}
                            width={"100%"}
                            style={{ objectFit: "cover", width: "100%" }}
                            preview={false}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: 120,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#f0f0f0",
                          }}
                        >
                          <FileOutlined
                            style={{ fontSize: 40, color: "#999" }}
                          />
                        </div>
                      )
                    }
                  >
                    {selected && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "#1890ff",
                          color: "white",
                          borderRadius: "50%",
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </div>
                    )}
                    <Card.Meta
                      description={
                        <div style={{ fontSize: 11 }}>
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={file.id}
                          >
                            {file.id}
                          </div>
                          {/* <div style={{ color: "#999", marginTop: 4 }}>
                            {formatFileSize(file.size)}
                          </div> */}
                        </div>
                      }
                    />
                  </Card>
                );
              })}
            </div>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
};
