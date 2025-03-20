import { Button, Checkbox, Drawer, Form, Input, message, Select, Space } from "antd";
import { useEffect, useState, useCallback, useMemo } from "react";
import apiService from "../../services/apiService";
import styles from "./../Home/Home.module.css";

interface Currency {
    code: string;
    name: string;
}

interface Company {
    id: string;
    name: string;
    xeroTenantId?: string;
}

interface GroupData {
    id?: number;
    groupName: string;
    currencyCode: string;
    currencyName: string;
    financialYear: string;
    erpCompanyData?: { erpCompanyId: string }[];
}

interface AddGroupFormProps {
    isDrawerVisible: boolean;
    setIsDrawerVisible: (visible: boolean) => void;
    editGroupData?: GroupData | null;
    setEditGroupData: (data: GroupData | null) => void;
    getGroupRecords: () => Promise<void>;
}

export const AddGroupForm: React.FC<AddGroupFormProps> = ({
    isDrawerVisible,
    setIsDrawerVisible,
    editGroupData = null,
    setEditGroupData,
    getGroupRecords,
}) => {
    const [form] = Form.useForm();
    const [currency, setCurrency] = useState<Currency[]>([]);
    const [company, setCompany] = useState<Company[]>([]);

    const financialYears = useMemo(() => [
        "Jan - Dec", "Feb - Jan", "Mar - Feb", "Apr - Mar",
        "May - Apr", "Jun - May", "Jul - Jun", "Aug - Jul",
        "Sep - Aug", "Oct - Sep", "Nov - Oct", "Dec - Nov",
    ], []);


    const closeDrawer = () => {
        setIsDrawerVisible(false);
        setEditGroupData(null);
        form.resetFields();
    };

    const getCompanyDropdown = useCallback(async () => {
        try {
            const res = await apiService.get("/api/Company/GetCompanyDropdown?isHolding=yes");
            setCompany(res.result);
        } catch (error) {
            message.error("Error fetching companies.");
            console.error("Error fetching companies:", error);
        }
    }, []);

    const getCurrency = useCallback(async () => {
        try {
            const res = await apiService.get("/api/Configuration/GetCurrencyDropdown");
            setCurrency(res.result[0]?.currencies || []);
        } catch (error) {
            message.error("Error fetching currencies.");
            console.error("Error fetching currencies:", error);
        }
    }, []);

    const onSubmit = async (values: any) => {
        try {
            const selectedCurrency = currency.find((item) => item.code === values.currency);
            const selectedCompanies = company
                .filter((item) => values.companies.includes(item.id))
                .map((item) => ({
                    checked: true,
                    currencyCode: selectedCurrency?.code || "",
                    erpCompanyCurrencyCode: selectedCurrency?.code || "",
                    erpCompanyId: item.id,
                    erpCompanyName: item.name,
                    id: item.id,
                    name: item.name,
                    xeroTenantId: item.xeroTenantId || "",
                }));
            console.log(editGroupData)
            const payload = {
                ...(editGroupData?.id && { groupId: editGroupData.id }),
                groupName: values.groupName,
                currencyCode: selectedCurrency?.code || "",
                currencyName: selectedCurrency?.name || "",
                financialYear: values.financialYear,
                GroupMappedCompaniesReqModel: selectedCompanies,
            };

            console.log(payload)

            const response = await apiService.post("/api/Group/AddOrUpdateGroup", payload);
            if (response.responseStatus === 3) {
                console.log(response)
                message.success(response.message);
                closeDrawer();
                await getGroupRecords();
            } else {
                message.error("Failed to save group.");
            }
        } catch (error) {
            message.error("An error occurred while saving the group.");
            console.error("Error submitting form:", error);
        }
    };

    useEffect(() => {
        getCurrency();
        getCompanyDropdown();
    }, [getCurrency, getCompanyDropdown]);

    useEffect(() => {
        if (editGroupData) {
            form.setFieldsValue({
                groupName: editGroupData.groupName,
                currency: editGroupData.currencyCode,
                financialYear: editGroupData.financialYear,
                companies: editGroupData.erpCompanyData?.map((comp) => comp.erpCompanyId) || [],
            });
        }
    }, [editGroupData, form]);

    return (
        <Drawer
            title={editGroupData ? "Edit Group" : "Add Group"}
            width={400}
            onClose={closeDrawer}
            open={isDrawerVisible}
            footer={
                <Space style={{ display: "flex", justifyContent: "flex-start" }}>
                    <Button type="primary" onClick={() => form.submit()}>
                        {editGroupData ? "Update" : "Add"}
                    </Button>
                    <Button onClick={closeDrawer}>Cancel</Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item
                    label="Group Name"
                    name="groupName"
                    rules={[{ required: true, message: "Please enter Group Name" }]}
                >
                    <Input placeholder="Enter Group Name" />
                </Form.Item>

                {/* Currency & Financial Year */}
                <div className={styles.inputGroup}>
                    <Form.Item
                        label="Currency"
                        style={{ width: "50%" }}
                        name="currency"
                        rules={[{ required: true, message: "Please select Currency" }]}
                    >
                        <Select placeholder="Select Currency" disabled={editGroupData==null?false:true}>
                            {currency.map((item) => (
                                <Select.Option key={item.code} value={item.code}>
                                    {item.code} - {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Choose FY Period"
                        style={{ width: "50%" }}
                        name="financialYear"
                        rules={[{ required: true, message: "Please select Financial Year" }]}
                    >
                        <Select placeholder="Select Financial Year" disabled={editGroupData==null?false:true}>
                            {financialYears.map((item) => (
                                <Select.Option key={item} value={item}>
                                    {item}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                {/* Companies Checkbox Group */}
                <Form.Item
                    label="Companies"
                    name="companies"
                    rules={[{ required: true, message: "Please select at least one company" }]}
                >
                    <Checkbox.Group
                        style={{ display: "flex", flexDirection: "column" }}
                        options={company.map((c) => ({ label: c.name, value: c.id }))}
                    />
                </Form.Item>
            </Form>
        </Drawer>   
    );
};
