import { Button, message, Space, Table } from 'antd';
import { EditOutlined, CopyOutlined } from '@ant-design/icons';
import apiService from '../../services/apiService';
import { FC, useState, useCallback } from 'react';
import { MapGroupClassModal } from './MapGroupClassModal';

interface ClassData {
    groupclassId: number;
    groupName: string;
    className: string;
    mappedAccountsCount: number;
}

interface GroupClassTableProps {
    classData: ClassData[];
    setEditClassID: (id: number | null) => void;
    setIsClassDrawerVisible: (visible: boolean) => void;
    getGroupClassData: () => Promise<void>;
    currentGroupClassPage: number;
    pageGroupClass: number;
    totalGroupClass: number;
    onPageChange: (page: number, size: number) => void;
}

export const GroupClassTable: FC<GroupClassTableProps> = ({
    classData,
    setEditClassID,
    pageGroupClass,
    currentGroupClassPage,
    totalGroupClass,
    setIsClassDrawerVisible,
    getGroupClassData,
    onPageChange
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedGroupClassId, setSelectedGroupClassId] = useState<number | null>(null);

    const handleEdit = (record: ClassData) => {
        setEditClassID(record.groupclassId);
        setIsClassDrawerVisible(true);
    };

    const handleCopy = async (record: ClassData) => {
        try {
            const res = await apiService.post(`/api/GRC/CloneGRC?groupclassId=${record.groupclassId}`);
            if (res?.data?.responseStatus === 3) {
                message.success('Group class cloned successfully');
                await getGroupClassData();
            } else {
                message.error('Failed to clone group class.');
            }
        } catch (error) {
            console.error("Error cloning group class:", error);
            message.error('An error occurred while cloning the group class.');
        }
    };

    const handleOpenModal = (groupclassId: number) => {
        setSelectedGroupClassId(groupclassId);
        setIsModalVisible(true);
    };

    const handlePageChange = useCallback((page: number, size: number) => {
        onPageChange(page, size);
    }, [onPageChange]);

    const columns = [
        {
            title: "Group Name",
            dataIndex: "groupName",
            key: "groupName",
            sorter: (a: ClassData, b: ClassData) => a.groupName.localeCompare(b.groupName),
        },
        {
            title: "Class Name",
            dataIndex: "className",
            key: "className",
            sorter: (a: ClassData, b: ClassData) => a.className.localeCompare(b.className),
        },
        {
            title: "Setup or Mapping",
            key: "setupOrMapping",
            render: (_, record: ClassData) => (
                <Button type="link" onClick={() => handleOpenModal(record.groupclassId)}>
                    Map Class
                </Button>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record: ClassData) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button type="text" icon={<CopyOutlined />} onClick={() => handleCopy(record)} />
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                dataSource={classData}
                columns={columns}
                rowKey="groupclassId"
                pagination={{
                    current: currentGroupClassPage,
                    pageSize: pageGroupClass,
                    total: totalGroupClass,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, // ✅ Helps debug total items
                    onChange: handlePageChange,
                }}
            />


            <MapGroupClassModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                groupclassId={selectedGroupClassId}
            />
        </>
    );
};
