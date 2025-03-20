import React, { useState, useEffect } from "react";
import { Modal, Button, Select, Table, message, Spin, Card, Typography, Empty, Tag, Space, Row, Col, Divider } from "antd";
import { PreviewGroupClassModal } from "./PreviewGroupClassModal";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { DragOutlined } from "@ant-design/icons";
import apiService from "../../services/apiService";
import styles from "./MapGroupClassModal.module.scss"

const { Title, Text } = Typography;

interface ClassValue {
  classValueId: number;
  classValue: string;
  mappedAccounts?: MappedAccount[];
}

interface MappedAccount {
  mappedClassId: number;
  companyAccountId: string;
  classId: string;
  className: string;
  trackingCategoryId: string;
}

interface GroupClass {
  groupclassId: number;
  groupId: number;
  groupName: string;
  className: string;
  classValues: ClassValue[];
}

interface ERPCompany {
  _id: string;
  tenantId: string;
  organisationName: string;
  connectionType: number;
}

interface ERPClass {
  id: string;
  className: string;
  inUse?: boolean;
  companyId?: string;
  companyName?: string;
}

interface MappedERPClass {
  erpClassId: string;
  erpClassName: string;
  erpCompanyId: string;
  erpCompanyName: string;
  trackingCategoryId: string;
  id?: number;
}

interface MappedValue {
  classValueId: number;
  classValue: string;
  mappedERPClasses: MappedERPClass[];
}

interface SaveMappingItem {
  groupClassValueId: number;
  id?: number;
  erpCompanyId: string;
  erpClassId: string;
  erpClassName: string;
  trackingCategoryId: string;
}

interface SaveMappingPayload {
  gRCValuesDetails: SaveMappingItem[];
  groupClassId: number;
  groupId: number;
}

export const MapGroupClassModal = ({ visible, onClose, groupclassId }: { visible: boolean, onClose: () => void, groupclassId: number }) => {
  const [loading, setLoading] = useState(true);
  const [groupClass, setGroupClass] = useState<GroupClass | null>(null);
  const [erpCompanies, setErpCompanies] = useState<ERPCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const [selectedCompanyConnectionType, setSelectedCompanyConnectionType] = useState<number | null>(null);
  const [erpClasses, setErpClasses] = useState<ERPClass[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [erpLoading, setErpLoading] = useState(false);
  const [mappedValues, setMappedValues] = useState<MappedValue[]>([]);
  const [availableErpClasses, setAvailableErpClasses] = useState<ERPClass[]>([]);
  const [companiesWithMappings, setCompaniesWithMappings] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (visible) {
      fetchData();
    } else {
      // Reset state when modal closes
      setSelectedCompany(null);
      setSelectedCompanyName(null);
      setSelectedCompanyConnectionType(null);
      setErpClasses([]);
      setAvailableErpClasses([]);
    }
  }, [visible]);

  useEffect(() => {
    if (groupClass?.classValues && erpCompanies.length > 0) {
      // Create initial mapped values
      const initialMappedValues = groupClass.classValues.map(cv => {
        const mappedERPClasses: MappedERPClass[] = (cv.mappedAccounts || []).map(ma => ({
          erpClassId: ma.classId,
          erpClassName: ma.className,
          erpCompanyId: ma.companyAccountId,
          erpCompanyName: erpCompanies.find(c => c.tenantId === ma.companyAccountId)?.organisationName || '',
          trackingCategoryId: ma.trackingCategoryId || '',
          id: ma.mappedClassId
        }));

        return {
          classValueId: cv.classValueId,
          classValue: cv.classValue,
          mappedERPClasses
        };
      });

      setMappedValues(initialMappedValues);

      // Find all unique companies that have mappings
      const companiesSet = new Set<string>();
      initialMappedValues.forEach(mv => {
        mv.mappedERPClasses.forEach(mc => {
          companiesSet.add(mc.erpCompanyId);
        });
      });
      setCompaniesWithMappings(companiesSet);
      if (companiesSet.size > 0 && !selectedCompany) {
        const firstCompanyId = Array.from(companiesSet)[0];
        const company = erpCompanies.find(c => c.tenantId === firstCompanyId);

        if (company) {
          setSelectedCompany(company.tenantId);
          setSelectedCompanyName(company.organisationName);
          setSelectedCompanyConnectionType(company.connectionType);
          fetchERPClasses(company.tenantId, company.connectionType, company.organisationName);
        }
      }
    }
  }, [groupClass, erpCompanies]);

  useEffect(() => {
    updateAvailableErpClasses();
  }, [mappedValues, erpClasses]);

  const updateAvailableErpClasses = () => {
    if (!selectedCompany) return;
    const mappedClassIds = mappedValues.flatMap(mv =>
      mv.mappedERPClasses
        .filter(mc => mc.erpCompanyId === selectedCompany)
        .map(mc => mc.erpClassId)
    );
    const available = erpClasses.filter(cls => !mappedClassIds.includes(cls.id));
    setAvailableErpClasses(available);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const grcRes = await apiService.get(`/api/GRC/GetGRCRecordById?id=${groupclassId}`);
      console.log("GRC Response:", grcRes);

      if (grcRes.responseStatus === 3 && grcRes.result && grcRes.result.length > 0) {
        setGroupClass(grcRes.result[0]);
        const erpRes = await apiService.get(`/api/Company/GetERPCompanyList?groupId=${grcRes.result[0].groupId}`);
        if (erpRes.responseStatus === 3) {
          setErpCompanies(erpRes.result);
        } else {
          message.error("Failed to fetch ERP companies.");
        }
      } else {
        message.error("Failed to fetch group class details.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching data.");
    }
    setLoading(false);
  };

  const fetchERPClasses = async (tenantId: string, connectionType: number, companyName: string) => {
    setErpLoading(true);
    try {
      const res = await apiService.get(`/api/Company/GetERPClassList?companyAccountId=${tenantId}&connectionType=${connectionType}`);

      if (res.responseStatus === 3) {
        const formattedClasses = res.result.map((cls: any, index: number) => ({
          id: cls.id || `erp-class-${index}`,
          className: cls.className || cls,
          inUse: false,
          companyId: tenantId,
          companyName: companyName
        }));
        setErpClasses(formattedClasses);
      } else {
        message.error("Failed to fetch ERP class list.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching ERP classes.");
    }
    setErpLoading(false);
  };

  const handleCompanyChange = async (tenantId: string, option: any) => {
    setSelectedCompany(tenantId);
    setSelectedCompanyName(option.children);
    setSelectedCompanyConnectionType(option.connectionType);

    await fetchERPClasses(tenantId, option.connectionType, option.children);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the droppable area
    if (!destination) return;
    if (source.droppableId === 'erp-classes' && destination.droppableId.startsWith('mapping-area-')) {
      const targetClassValueId = parseInt(destination.droppableId.split('-')[2]);
      const draggedERPClass = availableErpClasses[source.index];

      if (!selectedCompany) {
        message.warning("Please select an ERP company first");
        return;
      }
      const targetMappedValue = mappedValues.find(mv => mv.classValueId === targetClassValueId);
      const alreadyMapped = targetMappedValue?.mappedERPClasses.some(
        mc => mc.erpClassId === draggedERPClass.id && mc.erpCompanyId === selectedCompany
      );

      if (alreadyMapped) {
        message.warning("This ERP class is already mapped to this value");
        return;
      }
      const isClassAlreadyMapped = mappedValues.some(mv =>
        mv.mappedERPClasses.some(mc =>
          mc.erpClassId === draggedERPClass.id && mc.erpCompanyId === selectedCompany
        )
      );

      if (isClassAlreadyMapped) {
        message.warning("This ERP class is already mapped to another value");
        return;
      }

      setMappedValues(prev => prev.map(mv => {
        if (mv.classValueId === targetClassValueId) {
          return {
            ...mv,
            mappedERPClasses: [
              ...mv.mappedERPClasses,
              {
                erpClassId: draggedERPClass.id,
                erpClassName: draggedERPClass.className,
                erpCompanyId: selectedCompany,
                erpCompanyName: selectedCompanyName || '',
                trackingCategoryId: ''
              }
            ]
          };
        }
        return mv;
      }));

      message.success(`Mapped "${draggedERPClass.className}" to class value successfully`);
    }
  };

  const removeMappedClass = (classValueId: number, erpClassId: string, erpCompanyId: string) => {
    setMappedValues(prev => prev.map(mv => {
      if (mv.classValueId === classValueId) {
        return {
          ...mv,
          mappedERPClasses: mv.mappedERPClasses.filter(
            mc => !(mc.erpClassId === erpClassId && mc.erpCompanyId === erpCompanyId)
          )
        };
      }
      return mv;
    }));
    message.info("Mapping removed");
  };

  const onUpdateMapping = async () => {
    // Prepare the data for saving
    const mappingsToSave: SaveMappingPayload = {
      gRCValuesDetails: [],
      groupClassId: groupClass?.groupclassId || 0,
      groupId: groupClass?.groupId || 0
    };

    // Collect all mappings
    mappedValues.forEach(mv => {
      mv.mappedERPClasses.forEach(mc => {
        mappingsToSave.gRCValuesDetails.push({
          groupClassValueId: mv.classValueId,
          id: mc.id || 123, // Use existing ID if available
          erpCompanyId: mc.erpCompanyId,
          erpClassId: mc.erpClassId,
          erpClassName: mc.erpClassName,
          trackingCategoryId: mc.trackingCategoryId || ''
        });
      });
    });

    if (mappingsToSave.gRCValuesDetails.length === 0) {
      message.warning("No mappings have been created");
      return;
    }

    try {
      setLoading(true);
      console.log(mappingsToSave, "Mappings to save");
      // Uncomment when ready to save
      const res = await apiService.post('/api/GRC/InsertUpdateGroupClassMappingDetail', mappingsToSave);
      if (res.responseStatus === 3) {
        message.success("Mappings updated successfully");
        onClose();
      } else {
        message.error("Failed to update mappings");
      }
    } catch (error) {
      console.error("Error saving mappings:", error);
      message.error("Error saving mappings");
    } finally {
      setLoading(false);
    }
  };

  const renderMappingsByCompany = () => {
    if (!selectedCompany) return null;
    const filteredMappedValues = mappedValues.map(mv => ({
      ...mv,
      mappedERPClasses: mv.mappedERPClasses.filter(mc => mc.erpCompanyId === selectedCompany)
    }));

    return filteredMappedValues;
  };

  const handlePreviewClick = () => {
    setPreviewVisible(true);
  };

  // Add function to close preview modal
  const handlePreviewClose = () => {
    setPreviewVisible(false);
  };


  return (<>
    <Modal
      className={styles.fullscreenmodal}
      open={visible}
      style={{
        top: 20,
        padding: 0,
        maxWidth: "95%",
        width: "90%",
      }}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="update" type="primary"
          onClick={onUpdateMapping}
          disabled={!mappedValues.some(mv => mv.mappedERPClasses.length > 0)}
          loading={loading}
        >
          Update Mappings
        </Button>,
      ]}
    >
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={styles.mainDiv}>
            <Title level={3}>Map Group Class</Title>
            <Divider />
            <div style={{ "display": "flex", "justifyContent": "space-between", "alignContent": "center" }}>
              <Title level={4} style={{ marginTop: 8 }}>
                {groupClass?.groupName} : {groupClass?.className}
              </Title>
              <Button onClick={handlePreviewClick}>Preview</Button>
            </div>


            <Row gutter={16} style={{ marginTop: 5 }}>
              {/* First column - Class Values */}
              <Col span={8}>
                <Card
                  title="Class Values"
                  headStyle={{ backgroundColor: "#f5f5f5" }}
                  style={{ height: "100%" }}>
                  <Table
                    dataSource={groupClass?.classValues || []}
                    columns={[{
                      dataIndex: "classValue",
                      key: "classValue",
                      render: (text) => <Text strong>{text}</Text>
                    }]}
                    rowKey="classValueId"
                    pagination={false}
                    size="small"
                    bordered
                  />
                </Card>
              </Col>
              {/* Second column - Mapped Values */}
              <Col span={8}>
                <Card
                  title={
                    <Space>
                      <span>Mapped Values</span>
                      {selectedCompany && (
                        <Tag color="blue">{selectedCompanyName}</Tag>
                      )}
                    </Space>
                  }
                  headStyle={{ backgroundColor: "#f5f5f5" }}
                  style={{ height: "100%" }}
                >
                  {!selectedCompany ? (
                    <Empty description="Select a company to view mappings" />
                  ) : (
                    <div style={{ minHeight: "100px" }}>
                      {renderMappingsByCompany()?.map((item) => (
                        <Droppable
                          key={`mapping-${item.classValueId}`}
                          droppableId={`mapping-area-${item.classValueId}`}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              style={{
                                padding: "5px",
                                paddingBottom: "10px",
                                marginBottom: "5px",
                                border: "1px dashed #d9d9d9",
                                borderRadius: "4px",
                                backgroundColor: item.mappedERPClasses.length > 0 ? "#f0f5ff" : "#fafafa",
                                minHeight: "35px",
                                height: `${Math.max(35, item.mappedERPClasses.length * 35)}px`,
                                transition: "height 0.3s ease"
                              }}
                            >
                              {item.classValue}
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <div>
                                  {item.mappedERPClasses.length > 0 ? (
                                    item.mappedERPClasses.map((mappedClass, index) => (
                                      <div
                                        key={`${mappedClass.erpClassId}-${mappedClass.erpCompanyId}-${index}`}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          marginBottom: "4px"
                                        }}
                                      >
                                        <Space>
                                          <Tag
                                            closable
                                            onClose={() => removeMappedClass(item.classValueId, mappedClass.erpClassId, mappedClass.erpCompanyId)}
                                          >
                                            <Space>
                                              {mappedClass.erpClassName}
                                            </Space>
                                          </Tag>
                                        </Space>
                                      </div>
                                    ))
                                  ) : (
                                    <Text type="secondary"></Text>
                                  )}
                                </div>
                                {provided.placeholder}
                              </div>
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </div>
                  )}
                </Card>
              </Col>

              {/* Third column - ERP Classes */}
              <Col span={8}>
                <Card
                  title={
                    <Space>
                      <span>ERP Classes</span>
                    </Space>
                  }
                  extra={
                    <Select
                      style={{ width: 220 }}
                      placeholder="Select ERP Company"
                      onChange={(value, option) => handleCompanyChange(value, option)}
                      loading={erpLoading}
                      value={selectedCompany}
                    >
                      {erpCompanies.map((company) => (
                        <Select.Option
                          key={company.tenantId}
                          value={company.tenantId}
                          connectionType={company.connectionType}
                        >
                          {company.organisationName}
                          {/* {companiesWithMappings.has(company.tenantId) && (
                            <Tag color="green" style={{ marginLeft: 8 }}>Has Mappings</Tag>
                          )} */}
                        </Select.Option>
                      ))}
                    </Select>
                  }
                  bordered
                  style={{ height: "100%" }}
                  headStyle={{ backgroundColor: "#f5f5f5" }}
                >
                  {erpLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                      <Spin />
                    </div>
                  ) : (
                    <Droppable droppableId="erp-classes">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{ minHeight: "300px" }}
                        >
                          {!selectedCompany ? (
                            <Empty description="Select a company to view classes" />
                          ) : availableErpClasses.length > 0 ? (
                            availableErpClasses.map((cls, index) => (
                              <Draggable
                                key={cls.id}
                                draggableId={cls.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                      padding: "8px 16px",
                                      margin: "8px 0",
                                      border: "1px solid #d9d9d9",
                                      borderRadius: "4px",
                                      backgroundColor: snapshot.isDragging ? "#e6f7ff" : "#fff",
                                      cursor: "move",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center"
                                    }}
                                  >
                                    <span>{cls.className}</span>
                                    <DragOutlined style={{ color: "#1890ff" }} />
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <Empty
                              description={
                                erpClasses.length > 0
                                  ? "All ERP classes are mapped"
                                  : "No ERP classes available"
                              }
                            />
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </DragDropContext>
      )}

    </Modal>

    <PreviewGroupClassModal
      visible={previewVisible}
      onClose={handlePreviewClose}
      groupclassId={groupclassId}
    />
  </>
  );
};