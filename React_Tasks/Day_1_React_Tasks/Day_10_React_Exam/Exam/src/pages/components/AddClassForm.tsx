import { Button, Drawer, Flex, Form, Input, message, Select, Space } from "antd";
import { useEffect, useState, useCallback } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import apiService from "../../services/apiService";

interface GroupData {
    id?: number;
    groupId?: number;
    groupName: string;
    className?: string;
    financialYear?: string;
    gRCValuesDetails?: { classValue: string }[];
}

interface AddClassFormProps {
    isClassDrawerVisible: boolean;
    setIsClassDrawerVisible: (visible: boolean) => void;
    editClassID?: number | null;
    setEditClassID: (data: number | null) => void;
    getGroupClassData: () => Promise<void>;
}

export const AddClassForm: React.FC<AddClassFormProps> = ({
    isClassDrawerVisible,
    setIsClassDrawerVisible,
    editClassID = null,
    setEditClassID,
    getGroupClassData,
}) => {
    const [form] = Form.useForm();
    const [group, setGroup] = useState<{ id: number; option: string }[]>([]);
    const [classValues, setClassValues] = useState<{ classValue: string }[]>([{ classValue: "" }]);
    const [editClassData, setEditClassData] = useState<GroupData | null>(null);

    const closeDrawer = () => {
        setIsClassDrawerVisible(false);
        setEditClassID(null);
        setEditClassData(null);
        form.resetFields();
        setClassValues([{ classValue: "" }]);
    };

    const getGroupDropDown = useCallback(async () => {
        try {
            const res = await apiService.get("/api/Group/GetGroupDropdown?groupType=all&reportType=0");
            setGroup(res.result);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    }, []);

    const getGroupDropDownByID = useCallback(async () => {
        if (!editClassID) return;
        try {
            const response = await apiService.get(`/api/GRC/GetGRCRecordById?id=${editClassID}`);
            if (response.responseStatus === 3) {
                const data = response.result[0];
                console.log("Fetched Edit Data:", data);

                setEditClassData(data);
                const extractedClassValues = data.classValues?.map((item) => ({
                    classValue: item.classValue || "",
                    classValueId: item.classValueId || null,
                })) || [{ classValue: "", classValueId: null }];

                setClassValues(extractedClassValues);

                form.setFieldsValue({
                    group: data.groupId,
                    className: data.className,
                    classValues: extractedClassValues,
                });
            }
        } catch (error) {
            console.error("Error fetching group class data:", error);
        }
    }, [editClassID, form]);

    useEffect(() => {
        getGroupDropDown();
    }, [getGroupDropDown]);

    useEffect(() => {
        if (editClassID) {
            getGroupDropDownByID();
        }
    }, [editClassID, getGroupDropDownByID]);

    const addClassValueField = () => {
        setClassValues([...classValues, { classValue: "" }]);
    };

    const handleClassValueChange = (index: number, value: string) => {
        setClassValues((prev) => {
            const updatedValues = [...prev];
            updatedValues[index] = { ...updatedValues[index], classValue: value };
            return updatedValues;
        });

        form.setFieldsValue({
            classValues: classValues.map((item, i) =>
                i === index ? { ...item, classValue: value } : item
            ),
        });
    };

    const removeClassValueField = (index: number) => {
        setClassValues((prev) => prev.filter((_, i) => i !== index));
    };


    const onSubmit = async (values: any) => {
        if (classValues.some((val) => val.classValue.trim() === "")) {
            return message.error("All class values must be filled.");
        }

        try {

            const payload = {
                ...(editClassID && { id: editClassID }),
                groupId: values.group,
                className: values.className,
                classValues: classValues.map((val) => ({ fullData: null, classValue: val.classValue })),
                gRCValuesDetails: classValues.map((val) => ({ fullData: null, classValue: val.classValue })),
            };

            const response = await apiService.post("/api/GRC/InsertUpdateGRCDetail", payload);
            if (response.responseStatus === 3) {
                message.success(response.message);
                closeDrawer();
                await getGroupClassData();
            } else {
                message.error("Failed to save group class.");
            }
        } catch (error) {
            message.error("An error occurred while saving the group class.");
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Drawer
            title={editClassData ? "Edit Group Class" : "Add Group Class"}
            width={400}
            onClose={closeDrawer}
            open={isClassDrawerVisible}
            footer={
                <Space style={{ display: "flex", justifyContent: "flex-start" }}>
                    <Button type="primary" onClick={() => form.submit()}>
                        {editClassData ? "Update" : "Add"}
                    </Button>
                    <Button onClick={closeDrawer}>Cancel</Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item
                    label="Group"
                    name="group"
                    rules={[{ required: true, message: "Please select a Group" }]}
                >
                    <Select placeholder="Select Group" disabled={editClassID ? true : false}>
                        {group.map((item) => (
                            <Select.Option key={item.id} value={item.id}>
                                {item.option}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Class Name"
                    name="className"
                    rules={[{ required: true, message: "Please enter a Class Name" }]}
                >
                    <Input placeholder="Enter Class Name" />
                </Form.Item>

                <div style={{ marginBottom: "5px" }}>Class Values:</div>
                {classValues.map((item, index) => (
                    <Form.Item
                        key={index}
                        style={{ width: "100%" }}
                        name={["classValues", index, "classValue"]}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[{ required: true, message: `Class Value ${index + 1} is required` }]}
                    >
                        <Flex align="center" gap="small">
                            <Input
                                value={item.classValue}
                                onChange={(e) => handleClassValueChange(index, e.target.value)}
                                placeholder={`Enter Class Value ${index + 1}`}
                            />
                            <Button type="text" icon={<MinusCircleOutlined />} onClick={() => removeClassValueField(index)} />
                        </Flex>
                    </Form.Item>

                ))}
                <div style={{ display: "flex", gap: "5px", cursor: "pointer" }} onClick={addClassValueField}>
                    <PlusOutlined />
                    <span style={{ marginLeft: "5px" }}>Add Class Value</span>
                </div>
            </Form>
        </Drawer>
    );
};
