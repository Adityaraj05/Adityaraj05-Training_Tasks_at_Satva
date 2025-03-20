import { Button, Dropdown, Menu, message, Table } from "antd";
import { DownOutlined, CopyOutlined, EditOutlined } from "@ant-design/icons";
import React, { useCallback } from "react";
import apiService from "../../services/apiService";

interface GroupData {
  id: string;
  groupName: string;
  erpCompanyData: { erpCompanyId: string; erpCompanyName: string }[];
  groupClass: string;
  financialYear: string;
  currencyName: string;
  groupTranferStatus: boolean;
}

interface GroupTableProps {
  groupData: GroupData[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number, size: number) => void;
}

export const GroupTable: React.FC<GroupTableProps> = ({
  groupData,
  loading,
  getGroupRecords,
  currentPage,
  setActiveTab,
  setIsDrawerVisible,
  setEditGroupData,
  pageSize,
  totalRecords,
  onPageChange,
}) => {
  const getCompanyMenu = (companies: { erpCompanyId: string; erpCompanyName: string }[]) => (
    <Menu>
      {companies.map((company) => (
        <Menu.Item key={company.erpCompanyId}>{company.erpCompanyName}</Menu.Item>
      ))}
    </Menu>
  );

  // const handleClick = useCallback(() => setActiveTab("groupClass"), [setActiveTab]);

  const Groupcolumns = [
    {
      title: "Group Name",
      dataIndex: "groupName",
      key: "groupName",
      sorter: (a: GroupData, b: GroupData) => a.groupName.localeCompare(b.groupName),
    },
    {
      title: "Companies",
      key: "companies",
      render: (record: GroupData) => (
        <Dropdown overlay={getCompanyMenu(record.erpCompanyData)} trigger={["click"]}>
          <Button type="link">
            {record.erpCompanyData.length} Companies <DownOutlined />
          </Button>
        </Dropdown>
      ),
      sorter: (a: GroupData, b: GroupData) => a.erpCompanyData.length - b.erpCompanyData.length,
    },
    {
      title: "Group Class",
      dataIndex: "groupClass",
      key: "groupClass",
      render: () => {
        return <span
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => setActiveTab("groupClass")}
        >
          Group Class
        </span>
      }
    },
    {
      title: "Financial Year",
      dataIndex: "financialYear",
      key: "financialYear",
      sorter: (a: GroupData, b: GroupData) => a.financialYear.localeCompare(b.financialYear),
    },
    {
      title: "Currency",
      dataIndex: "currencyName",
      key: "currencyName",
      sorter: (a: GroupData, b: GroupData) => a.currencyName.localeCompare(b.currencyName),
    },
    {
      title: "Transfer Ownership",
      key: "transferOwnership",
      render: () => "-",
    },
    {
      title: "Action",
      key: "action",
      render: (record: GroupData) => (
        <>
          <Button type="link" onClick={() => {
            setIsDrawerVisible(true);
            setEditGroupData(record)
          }}><EditOutlined /></Button>
          <Button type="link" onClick={async () => {
            const transformedData = {
              groupId: record.id || 0,
              groupName: record.groupName || "string",
              currencyCode: record.currencyCode || "string",
              currencyName: record.currencyName || "string",
              financialYear: record.financialYear || "string",
              groupMappedCompaniesReqModel: record.erpCompanyData?.map((company) => ({
                erpCompanyId: company.erpCompanyId || "string",
                erpCompanyName: company.erpCompanyName || "string",
                erpCompanyCurrencyCode: company.currencyCode || "string",
              })) || [],
            };

            const res = await apiService.post(`/api/Group/CloneGroup`, transformedData);
            if (res.responseStatus === 3) {
              message.success('Group cloned successfully');
              await getGroupRecords();
            } else {
              message.error('Failed to clone group.');
            }
          }}><CopyOutlined /></Button>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={groupData}
      columns={Groupcolumns}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: totalRecords,
        showSizeChanger: true,
        onChange: (page, size) => onPageChange(page, size),
      }}
    />
  );
};
