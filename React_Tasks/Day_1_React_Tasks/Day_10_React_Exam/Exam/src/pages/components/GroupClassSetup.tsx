import React, { useEffect, useState } from 'react';
import { getGroupClassRecordById, getERPCompanyListByGroupId, getERPClassList } from '../api/dataapi';
import { Row, Col, Card, List, Typography, message, Select, Skeleton, Button, Modal } from 'antd';
// import AddGroupClassDrawer from '../components/AddGroupClassDrawer';
import styles from './GroupClassSetup.module.scss';

const { Title } = Typography;
const { Option } = Select;

interface ClassValue {
  id: string;
  name: string;
  mappedAccounts: any[];
}

interface Company {
  id: string;
  name: string;
}

interface ERPClass {
  id: string;
  name: string;
}

const GroupClassSetup: React.FC = ({ visible, onClose, groupclassId:id }) => {
//   const { id } = useParams<{ id: string }>();
  const [classValues, setClassValues] = useState<ClassValue[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [erpClasses, setERPClasses] = useState<ERPClass[]>([]);
  const [unmappedClasses, setUnmappedClasses] = useState<ERPClass[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching group class record by ID...");
        const groupClassRecord = await getGroupClassRecordById(Number(id));
        console.log("Group Class Record By ID Response:", groupClassRecord);

        if (groupClassRecord?.responseStatus === 3 && groupClassRecord.result.length > 0) {
          const groupClass = groupClassRecord.result[0];
          console.log("Fetching ERP company list by group ID...");
          const companyList = await getERPCompanyListByGroupId(groupClass.groupId);
          console.log("ERP Company List By Group ID Response:", companyList);

          if (companyList?.responseStatus === 3) {
            setClassValues(groupClass.classValues.map((cv: any) => ({
              id: cv.classValueId,
              name: cv.classValue,
              mappedAccounts: cv.mappedAccounts,
            })));
            setCompanies(companyList.result.map((company: any) => ({
              id: company.tenantId,
              name: company.organisationName,
            })));
            setGroupName(groupClass.groupName);
            setClassName(groupClass.className);
            message.success(groupClassRecord.message);

            // Auto-select the first company
            if (companyList.result.length > 0) {
              handleCompanyChange(companyList.result[0].tenantId);
            }
          } else {
            message.error(companyList.message || 'Failed to fetch company list.');
          }
        } else {
          message.error(groupClassRecord.message || 'Invalid group ID.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCompanyChange = async (value: string) => {
    setSelectedCompany(value);
    setLoading(true);
    setERPClasses([]); // Clear old data
    setUnmappedClasses([]); // Clear old data
    try {
      console.log("Fetching ERP class list...");
      const erpClassList = await getERPClassList(value, 2); // Assuming connectionType is 2
      console.log("ERP Class List Response:", erpClassList);

      if (erpClassList?.responseStatus === 3) {
        const groupClassRecord = await getGroupClassRecordById(Number(id));
        console.log("Group Class Record By ID Response:", groupClassRecord);

        if (groupClassRecord?.responseStatus === 3 && groupClassRecord.result.length > 0) {
          const groupClass = groupClassRecord.result[0];
          setClassValues(groupClass.classValues.map((cv: any) => ({
            id: cv.classValueId,
            name: cv.classValue,
            mappedAccounts: cv.mappedAccounts,
          })));

          const mappedClassIds = groupClass.classValues.flatMap(cv => cv.mappedAccounts.map(ma => ma.classId));
          const unmapped = erpClassList.result.filter((erpClass: any) => !mappedClassIds.includes(erpClass.id));
          setERPClasses(erpClassList.result.map((erpClass: any) => ({
            id: erpClass.id,
            name: erpClass.className,
          })));
          setUnmappedClasses(unmapped.map((erpClass: any) => ({
            id: erpClass.id,
            name: erpClass.className,
          })));
          message.success(erpClassList.message);
        } else {
          message.error(groupClassRecord.message || 'Invalid group ID.');
        }
      } else {
        message.error(erpClassList.message || 'Failed to fetch ERP class list.');
      }
    } catch (error) {
      console.error('Error fetching ERP class list:', error);
      message.error('Failed to fetch ERP class list.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
    className={styles.fullscreenmodal}
    open={visible}
    style={{ top: 0, left: 0, width: "100%" }}
    onCancel={onClose}
    footer={[
        <Button key="cancel" onClick={onClose}>
            Cancel
        </Button>,
        <Button key="update" type="primary">
            Update
        </Button>,
    ]}
>
      <Title level={2}>Setup or Mapping for {groupName} - {className}</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Class Values">
            {loading ? (
              <Skeleton active />
            ) : (
              <List
                dataSource={classValues}
                renderItem={item => (
                  <List.Item style={{ height: `${item.mappedAccounts.length * 50}px` }}>
                    {item.name}
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Mapping Area">
            {loading ? (
              <Skeleton active />
            ) : (
              <List
                dataSource={classValues.flatMap(cv => cv.mappedAccounts)}
                renderItem={account => (
                  <List.Item>
                    {account.className}
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="ERP Class List">
            <Select
              placeholder="Select a company"
              style={{ width: '100%' }}
              onChange={handleCompanyChange}
              value={selectedCompany}
            >
              {companies.map(company => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
            {loading ? (
              <Skeleton active />
            ) : (
              <List
                dataSource={unmappedClasses}
                renderItem={item => (
                  <List.Item>
                    {item.name}
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
      {/* <Button type="primary" onClick={() => setDrawerVisible(true)}>
        Add Group Class
      </Button>
      <AddGroupClassDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSuccess={() => handleCompanyChange(selectedCompany!)}
      /> */}
    </Modal>
  );
};

export default GroupClassSetup;