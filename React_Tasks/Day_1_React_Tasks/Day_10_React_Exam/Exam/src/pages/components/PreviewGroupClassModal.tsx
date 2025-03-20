import React, { useState, useEffect } from "react";
import { Modal, Spin, Card, Typography, Table, Tag, Space, Row, Col, Divider, Empty } from "antd";
import apiService from "../../services/apiService";
import styles from "./MapGroupClassModal.module.scss";

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

export const PreviewGroupClassModal = ({ visible, onClose, groupclassId }: { visible: boolean, onClose: () => void, groupclassId: number }) => {
  const [loading, setLoading] = useState(true);
  const [groupClass, setGroupClass] = useState<GroupClass | null>(null);
  const [erpCompanies, setErpCompanies] = useState<ERPCompany[]>([]);
  const [mappedValues, setMappedValues] = useState<MappedValue[]>([]);
  const [companiesWithMappings, setCompaniesWithMappings] = useState<Set<string>>(new Set());
  const [companiesList, setCompaniesList] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (visible) {
      fetchData();
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
      
      // Create list of companies with mappings
      const companies = Array.from(companiesSet).map(companyId => {
        const company = erpCompanies.find(c => c.tenantId === companyId);
        return {
          id: companyId,
          name: company?.organisationName || 'Unknown Company'
        };
      });
      
      setCompaniesList(companies);
    }
  }, [groupClass, erpCompanies]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch group class details which includes existing mappings
      const grcRes = await apiService.get(`/api/GRC/GetGRCRecordById?id=${groupclassId}`);
      
      if (grcRes.responseStatus === 3 && grcRes.result && grcRes.result.length > 0) {
        setGroupClass(grcRes.result[0]);

        // Fetch ERP companies
        const erpRes = await apiService.get(`/api/Company/GetERPCompanyList?groupId=${grcRes.result[0].groupId}`);
        if (erpRes.responseStatus === 3) {
          setErpCompanies(erpRes.result);
        } else {
          console.error("Failed to fetch ERP companies.");
        }
      } else {
        console.error("Failed to fetch group class details.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Filter mappings for a specific company
  const getMappingsForCompany = (companyId: string) => {
    return mappedValues.map(mv => ({
      ...mv,
      mappedERPClasses: mv.mappedERPClasses.filter(mc => mc.erpCompanyId === companyId)
    }));
  };

  return (
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
      footer={null}
    >
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.mainDiv}>
          <Title level={3}>Group Class Mapping Preview</Title>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
            <Title level={4} style={{ marginTop: 8 }}>
              {groupClass?.groupName} : {groupClass?.className}
            </Title>
          </div>

          {companiesList.length > 0 ? (
            companiesList.map((company) => (
              <div key={company.id} style={{ marginBottom: 40 }}>
                <Title level={5} style={{ margin: "16px 0" }}>
                  <Tag color="blue">{company.name}</Tag>
                </Title>
                
                <Row gutter={16}>
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
                  
                  <Col span={16}>
                    <Card
                      title="Mapped ERP Classes"
                      headStyle={{ backgroundColor: "#f5f5f5" }}
                      style={{ height: "100%" }}
                    >
                      <div>
                        {getMappingsForCompany(company.id).map((item) => (
                          <div
                            key={`mapping-${item.classValueId}`}
                            style={{
                              padding: "10px",
                              marginBottom: "10px",
                              border: "1px solid #d9d9d9",
                              borderRadius: "4px",
                              backgroundColor: item.mappedERPClasses.length > 0 ? "#f0f5ff" : "#fafafa",
                            }}
                          >
                            <Text strong>{item.classValue}</Text>
                            <div style={{ marginTop: 5 }}>
                              {item.mappedERPClasses.length > 0 ? (
                                <Space wrap>
                                  {item.mappedERPClasses.map((mappedClass) => (
                                    <Tag 
                                      key={`${mappedClass.erpClassId}`} 
                                      color="blue"
                                    >
                                      {mappedClass.erpClassName}
                                    </Tag>
                                  ))}
                                </Space>
                              ) : (
                                <Text type="secondary">No mappings</Text>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <Empty description="No mappings have been created yet" />
          )}
        </div>
      )}
    </Modal>
  );
};