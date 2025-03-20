

// import React, { useEffect, useState } from 'react';
// import {
//     Layout,
//     Tabs,
//     Input,
//     Button,
//     Space,
//     Typography,
//     Dropdown,
//     Menu,
//     Avatar,
//     message,
//     Checkbox,
//     Divider,
//     Row,
//     Col
// } from 'antd';
// import {
//     SearchOutlined,
//     FilterOutlined,
//     PlusOutlined,
//     ArrowLeftOutlined,
//     UserOutlined,
//     LogoutOutlined,
//     DownOutlined
// } from '@ant-design/icons';
// import styles from './Home.module.css';
// import apiService from '../../services/apiService';
// import { AddGroupForm } from '../components/AddGroupForm';
// import { GroupTable } from '../components/GroupTable';
// import { GroupClassTable } from '../components/GroupClassTable';
// import { useNavigate } from 'react-router-dom';
// import { AddClassForm } from '../components/AddClassForm';
// import axios from 'axios';
// const endPoint: string = import.meta.env.VITE_APP_URL;
// const { Header, Content } = Layout;
// const { TabPane } = Tabs;
// const { Text } = Typography;

// const Home: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<'group' | 'groupClass'>('group');
//     const [groupData, setGroupData] = useState<any[]>([]);
//     const [classData, setClassData] = useState<any[]>([]);
//     const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
//     const [isClassDrawerVisible, setIsClassDrawerVisible] = useState<boolean>(false);
//     const [editGroupData, setEditGroupData] = useState<any | null>(null);
//     const [editClassID, setEditClassID] = useState<any | null>(null);
//     const [visible, setVisible] = useState<boolean>(false);
//     const [searchText, setSearchText] = useState<string>('');

//     // New states for filtering
//     const [filterDropdownVisible, setFilterDropdownVisible] = useState<boolean>(false);
//     const [groupDropdownData, setGroupDropdownData] = useState<any[]>([]);
//     const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
//     const [filterLoading, setFilterLoading] = useState<boolean>(false);
//     const [filterApplied, setFilterApplied] = useState<boolean>(false);

//     // New states for Group tab filtering
//     const [companyDropdownData, setCompanyDropdownData] = useState<any[]>([]);
//     const [groupListDropdownData, setGroupListDropdownData] = useState<any[]>([]);
//     const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
//     const [selectedGroupList, setSelectedGroupList] = useState<number[]>([]);
//     const [companyFilterApplied, setCompanyFilterApplied] = useState<boolean>(false);

//     const handleTabChange = (key: string) => {
//         setActiveTab(key as 'group' | 'groupClass');
//         // Reset filters when changing tabs
//         setSelectedGroups([]);
//         setSelectedCompanies([]);
//         setSelectedGroupList([]);
//         setFilterApplied(false);
//         setCompanyFilterApplied(false);
//     };

//     const navigate = useNavigate();

//     const handleMenuClick = (e: any) => {
//         if (e.key === "profile") {
//             message.info("Navigating to profile...");
//         } else if (e.key === "logout") {
//             localStorage.clear();
//             navigate("/");
//             message.success("Logged out successfully.");
//         }
//     };

//     const getGroupRecords = async (filterParams = {}) => {
//         try {
//             setFilterLoading(true);
//             const queryParams = new URLSearchParams({
//                 sortField: 'GroupName',
//                 sortBy: 'asc',
//                 page: '3',
//                 pageSize: '5',
//                 searchText: searchText || '',
//                 ...filterParams
//             });

//             const response = await axios.get<Response>(
//                 `https://sandboxgathernexusapi.azurewebsites.net/api/Group/GetGroups?${queryParams}`,
//                 { headers: { Authorization: `Bearer ${localStorage.getItem("BearerToken")}` } }
//             );
//             console.log(response);
//             setGroupData(response.data?.result?.records || []);
//         } catch (error) {
//             message.error(error.message);
//             console.error("Error fetching groups:", error);
//         } finally {
//             setFilterLoading(false);
//         }
//     };

//     const getGroupClassData = async (filterParams = {}) => {
//         try {
//             setFilterLoading(true);
//             const queryParams = new URLSearchParams({
//                 searchText: searchText || '',
//                 sortField: 'CreatedOn',
//                 page: '1',
//                 pageSize: '10',
//                 sortOrder: 'desc',
//                 ...filterParams
//             });

//             const response = await apiService.get(`/api/GRC/GetGRCRecords?${queryParams}`);
//             setClassData(response.result.records || []);
//         } catch (error) {
//             console.error("Error fetching group classes:", error);
//             message.error("Failed to load group class data");
//         } finally {
//             setFilterLoading(false);
//         }
//     };

//     const getGroupDropdownData = async () => {
//         try {
//             setFilterLoading(true);
//             const response = await apiService.get("/api/Group/GetGroupDropdown?groupType=all&reportType=0");
//             setGroupDropdownData(response.result || []);
//         } catch (error) {
//             console.error("Error fetching group dropdown data:", error);
//             message.error("Failed to load filter options");
//         } finally {
//             setFilterLoading(false);
//         }
//     };

//     const getCompanyDropdownData = async () => {
//         try {
//             setFilterLoading(true);
//             const response = await apiService.get("/api/Company/GetCompanyDropdown?isHolding=yes");
//             setCompanyDropdownData(response.result || []);
//         } catch (error) {
//             console.error("Error fetching company dropdown data:", error);
//             message.error("Failed to load company filter options");
//         } finally {
//             setFilterLoading(false);
//         }
//     };

//     const getGroupListDropdownData = async () => {
//         try {
//             setFilterLoading(true);
//             // Use a similar endpoint as group dropdown or modify as needed
//             const response = await apiService.get("/api/Group/GetGroupDropdown?groupType=all&reportType=0");
//             setGroupListDropdownData(response.result || []);
//         } catch (error) {
//             console.error("Error fetching group list dropdown data:", error);
//             message.error("Failed to load group list filter options");
//         } finally {
//             setFilterLoading(false);
//         }
//     };

//     const showDrawer = () => {
//         setIsDrawerVisible(true);
//     };

//     const showClassDrawer = () => {
//         setIsClassDrawerVisible(true);
//     };

//     // Filter button handler
//     const handleFilterClick = () => {
//         setFilterDropdownVisible(true);
//         if (activeTab === 'groupClass') {
//             if (groupDropdownData.length === 0) {
//                 getGroupDropdownData();
//             }
//         } else {
//             if (companyDropdownData.length === 0) {
//                 getCompanyDropdownData();
//             }
//             if (groupListDropdownData.length === 0) {
//                 getGroupListDropdownData();
//             }
//         }
//     };

//     // Apply the filter for GroupClass tab
//     const applyGroupClassFilter = () => {
//         const filterByGroup = selectedGroups.join(',');
//         getGroupClassData({ filterByGroup });
//         setFilterDropdownVisible(false);
//         setFilterApplied(selectedGroups.length > 0);
//     };

//     // Apply the filter for Group tab
//     const applyGroupFilter = () => {
//         const filterByCompany = selectedCompanies.join(',');
//         const filterByGroup = selectedGroupList.join(',');
//         getGroupRecords({ 
//             filterByCompany,
//             filterByGroup
//         });
//         setFilterDropdownVisible(false);
//         setCompanyFilterApplied(selectedCompanies.length > 0 || selectedGroupList.length > 0);
//     };

//     // Reset the filter for GroupClass tab
//     const resetGroupClassFilter = () => {
//         setSelectedGroups([]);
//         getGroupClassData();
//         setFilterDropdownVisible(false);
//         setFilterApplied(false);
//     };

//     // Reset the filter for Group tab
//     const resetGroupFilter = () => {
//         setSelectedCompanies([]);
//         setSelectedGroupList([]);
//         getGroupRecords();
//         setFilterDropdownVisible(false);
//         setCompanyFilterApplied(false);
//     };

//     // Handle checkbox change for group selection in GroupClass tab
//     const handleGroupCheckboxChange = (groupId: number, checked: boolean) => {
//         if (checked) {
//             setSelectedGroups([...selectedGroups, groupId]);
//         } else {
//             setSelectedGroups(selectedGroups.filter(id => id !== groupId));
//         }
//     };

//     // Handle checkbox change for company selection in Group tab
//     const handleCompanyCheckboxChange = (companyId: string, checked: boolean) => {
//         if (checked) {
//             setSelectedCompanies([...selectedCompanies, companyId]);
//         } else {
//             setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
//         }
//     };

//     // Handle checkbox change for group list selection in Group tab
//     const handleGroupListCheckboxChange = (groupId: number, checked: boolean) => {
//         if (checked) {
//             setSelectedGroupList([...selectedGroupList, groupId]);
//         } else {
//             setSelectedGroupList(selectedGroupList.filter(id => id !== groupId));
//         }
//     };

//     // Handle search input change
//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchText(e.target.value);
//     };

//     // Perform search
//     const performSearch = () => {
//         if (activeTab === 'groupClass') {
//             const filterByGroup = selectedGroups.join(',');
//             getGroupClassData({ filterByGroup });
//         } else {
//             const filterByCompany = selectedCompanies.join(',');
//             const filterByGroup = selectedGroupList.join(',');
//             getGroupRecords({ 
//                 filterByCompany,
//                 filterByGroup
//             });
//         }
//     };

//     const groupClassFilterDropdownContent = (
//         <div  style={{background:"white","padding":"20px",maxHeight:"200px",overflowY:"scroll"}}>
//             <div className={styles.filterDropdownHeader}>
//                 <Text strong>Filter by Group</Text>
//             </div>

//             <div className={styles.filterDropdownContent}>
//                 {filterLoading ? (
//                     <div className={styles.loadingContainer}>Loading filter options...</div>
//                 ) : (
//                     <div className={styles.checkboxGroup}>
//                         {groupDropdownData.map(group => (
//                             <div key={group.id} className={styles.checkboxItem}>
//                                 <Checkbox 
//                                     checked={selectedGroups.includes(group.id)}
//                                     onChange={(e) => handleGroupCheckboxChange(group.id, e.target.checked)}
//                                 >
//                                     {group.option}
//                                 </Checkbox>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <div className={styles.filterDropdownFooter}>
//                 <Button size="small" onClick={resetGroupClassFilter}>
//                     Reset
//                 </Button>
//                 <Button size="small" type="primary" onClick={applyGroupClassFilter}>
//                     Apply
//                 </Button>
//             </div>
//         </div>
//     );

//     // Filter dropdown content for Group tab
//     const groupFilterDropdownContent = (
//         <div  style={{background:"white","padding":"20px",maxHeight:"200px",overflowY:"scroll"}}>
//             <div className={styles.filterDropdownHeader}>
//                 <Text strong>Filter Groups</Text>
//             </div>

//             <div className={styles.filterDropdownContent}>
//                 {filterLoading ? (
//                     <div className={styles.loadingContainer}>Loading filter options...</div>
//                 ) : (
//                     <Row>
//                         <Col span={12} className={styles.filterColumn}>
//                             <div className={styles.filterColumnHeader}>
//                                 <Text strong>Companies</Text>
//                             </div>
//                             <div className={styles.checkboxGroup}>
//                                 {companyDropdownData.map(company => (
//                                     <div key={company.id} className={styles.checkboxItem}>
//                                         <Checkbox 
//                                             checked={selectedCompanies.includes(company.id)}
//                                             onChange={(e) => handleCompanyCheckboxChange(company.id, e.target.checked)}
//                                         >
//                                             {company.name}
//                                         </Checkbox>
//                                     </div>
//                                 ))}
//                             </div>
//                         </Col>
//                         <Col span={12} className={styles.filterColumn}>
//                             <div className={styles.filterColumnHeader}>
//                                 <Text strong>Groups</Text>
//                             </div>
//                             <div className={styles.checkboxGroup}>
//                                 {groupListDropdownData.map(group => (
//                                     <div key={group.id} className={styles.checkboxItem}>
//                                         <Checkbox 
//                                             checked={selectedGroupList.includes(group.id)}
//                                             onChange={(e) => handleGroupListCheckboxChange(group.id, e.target.checked)}
//                                         >
//                                             {group.option}
//                                         </Checkbox>
//                                     </div>
//                                 ))}
//                             </div>
//                         </Col>
//                     </Row>
//                 )}
//             </div>

//             <div className={styles.filterDropdownFooter}>
//                 <Button size="small" onClick={resetGroupFilter}>
//                     Reset
//                 </Button>
//                 <Button size="small" type="primary" onClick={applyGroupFilter}>
//                     Apply
//                 </Button>
//             </div>
//         </div>
//     );

//     useEffect(() => {
//         getGroupRecords();
//         getGroupClassData();
//     }, []);

//     return (
//         <Layout className={styles.layout}>
//             <Header className={styles.header}>
//                 <div className={styles.logoContainer}>
//                     <span className={styles.logoText}>
//                         <span className={styles.gatherText}>GATHER</span>
//                         <span className={styles.nexusText}>.nexus</span>
//                     </span>
//                 </div>
//                 <div className={styles.profileContainer}>
//                     <Avatar className={styles.avatar}>R</Avatar>
//                     <Dropdown overlay={
//                         <Menu onClick={handleMenuClick}>
//                             <Menu.Item key="profile" icon={<UserOutlined />}>My Profile</Menu.Item>
//                             <Menu.Item key="logout" icon={<LogoutOutlined />}>Log Out</Menu.Item>
//                         </Menu>
//                     } trigger={["click"]} onOpenChange={setVisible} open={visible}>
//                         <div className={styles.profileContainer} onClick={(e) => e.stopPropagation()}>
//                             <div className={styles.profileInfo}>
//                                 <Text strong>Sujal</Text>
//                                 <Text>My Profile</Text>
//                             </div>
//                         </div>
//                     </Dropdown>
//                 </div>
//             </Header>

//             <Content className={styles.content}>
//                 <div className={styles.pageHeader}>
//                     <Button type="text" icon={<ArrowLeftOutlined />} className={styles.backButton}>
//                         <span className={styles.pageTitle}>Multi-Entity & Display</span>
//                     </Button>
//                     <Button type="link" className={styles.addCompanyLink}>
//                         How to Add {activeTab}?
//                     </Button>
//                 </div>

//                 <div className={styles.searchActions}>
//                     <Tabs activeKey={activeTab} onChange={handleTabChange} className={styles.tabs}>
//                         <TabPane tab="Group" key="group" />
//                         <TabPane tab="Group Class" key="groupClass" />
//                     </Tabs>

//                     <div className={styles.filterBox}>
//                         <Input
//                             placeholder="Search here..."
//                             prefix={<SearchOutlined />}
//                             className={styles.searchInput}
//                             value={searchText}
//                             onChange={handleSearchChange}
//                             onPressEnter={performSearch}
//                         />
//                         <div className={styles.tableActions}>
//                             <Space>
//                                 <Dropdown 
//                                     overlay={activeTab === 'groupClass' ? groupClassFilterDropdownContent : groupFilterDropdownContent} 
//                                     trigger={["click"]} 
//                                     open={filterDropdownVisible}
//                                     onOpenChange={setFilterDropdownVisible}
//                                 >
//                                     <Button 
//                                         icon={<FilterOutlined />}
//                                         onClick={handleFilterClick}
//                                         loading={filterLoading}
//                                         type={(activeTab === 'groupClass' && filterApplied) || 
//                                               (activeTab === 'group' && companyFilterApplied) ? "primary" : "default"}
//                                     >
//                                         Filter {activeTab === 'groupClass' && filterApplied ? 
//                                                 `(${selectedGroups.length})` : 
//                                                 activeTab === 'group' && companyFilterApplied ?
//                                                 `(${selectedCompanies.length + selectedGroupList.length})` : ""}
//                                         <DownOutlined />
//                                     </Button>
//                                 </Dropdown>
//                                 <Button
//                                     type="primary"
//                                     icon={<PlusOutlined />}
//                                     onClick={activeTab === "group" ? showDrawer : showClassDrawer}
//                                     className={styles.addButton}
//                                 >
//                                     Add {activeTab === "group" ? " Group" : " Class"}
//                                 </Button>
//                             </Space>
//                         </div>
//                     </div>
//                 </div>

//                 <AddGroupForm
//                     isDrawerVisible={isDrawerVisible}
//                     setIsDrawerVisible={setIsDrawerVisible}
//                     editGroupData={editGroupData}
//                     setEditGroupData={setEditGroupData}
//                     getGroupRecords={getGroupRecords}
//                 />

//                 <AddClassForm
//                     isClassDrawerVisible={isClassDrawerVisible}
//                     setIsClassDrawerVisible={setIsClassDrawerVisible}
//                     editClassID={editClassID}
//                     setEditClassID={setEditClassID}
//                     getGroupClassData={getGroupClassData}
//                 />

//                 {activeTab === "group" ? (
//                     <GroupTable
//                         groupData={groupData}
//                         setEditGroupData={setEditGroupData}
//                         setIsDrawerVisible={setIsDrawerVisible}
//                         loading={filterLoading}
//                     />
//                 ) : (
//                     <GroupClassTable 
//                         classData={classData}
//                         getGroupClassData={getGroupClassData}
//                         setEditClassID={setEditClassID}
//                         setIsClassDrawerVisible={setIsClassDrawerVisible}
//                         loading={filterLoading}
//                     />
//                 )}
//             </Content>
//         </Layout>
//     );
// };

// export default Home;






import React, { useEffect, useState } from 'react';
import {
    Layout,
    Tabs,
    Input,
    Button,
    Space,
    Typography,
    Dropdown,
    Menu,
    Avatar,
    message,
    Checkbox,
    Row,
    Col
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    PlusOutlined,
    ArrowLeftOutlined,
    UserOutlined,
    LogoutOutlined,
    DownOutlined
} from '@ant-design/icons';
import styles from './Home.module.css';
import apiService from '../../services/apiService';
import { AddGroupForm } from '../components/AddGroupForm';
import { GroupTable } from '../components/GroupTable';
import { GroupClassTable } from '../components/GroupClassTable';
import { useNavigate } from 'react-router-dom';
import { AddClassForm } from '../components/AddClassForm';
import axios from 'axios';
const endPoint: string = import.meta.env.VITE_APP_URL;
const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Text } = Typography;

const Home: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'group' | 'groupClass'>('group');
    const [groupData, setGroupData] = useState<any[]>([]);
    const [classData, setClassData] = useState<any[]>([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
    const [isClassDrawerVisible, setIsClassDrawerVisible] = useState<boolean>(false);
    const [editGroupData, setEditGroupData] = useState<any | null>(null);
    const [editClassID, setEditClassID] = useState<any | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [currentGroupClassPage,setCurrentGroupClassPage]=useState(1);
    const [pageGroupClass,setpageGroupClass]=useState(5)
    const [pageSize, setPageSize] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalGroupClass,setGroupClass]=useState(0);

    const [searchText, setSearchText] = useState<string>('');

    const [filterDropdownVisible, setFilterDropdownVisible] = useState<boolean>(false);
    const [groupDropdownData, setGroupDropdownData] = useState<any[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const [filterLoading, setFilterLoading] = useState<boolean>(false);
    const [filterApplied, setFilterApplied] = useState<boolean>(false);

    
    const [companyDropdownData, setCompanyDropdownData] = useState<any[]>([]);
    const [groupListDropdownData, setGroupListDropdownData] = useState<any[]>([]);
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
    const [selectedGroupList, setSelectedGroupList] = useState<number[]>([]);
    const [companyFilterApplied, setCompanyFilterApplied] = useState<boolean>(false);

    const handleTabChange = (key: string) => {
        setActiveTab(key as 'group' | 'groupClass');
        setSelectedGroups([]);
        setSelectedCompanies([]);
        setSelectedGroupList([]);
        setFilterApplied(false);
        setCompanyFilterApplied(false);
    };

    const navigate = useNavigate();

    const handleMenuClick = (e: any) => {
        if (e.key === "profile") {
            message.info("Navigating to profile...");
        } else if (e.key === "logout") {
            localStorage.clear();
            navigate("/");
            message.success("Logged out successfully.");
        }
    };

    const getGroupRecords = async (filterParams = {}) => {
        try {
            setFilterLoading(true);
            const queryParams = new URLSearchParams({
                sortField: 'GroupName',
                sortBy: 'asc',
                page: currentPage.toString(),
                pageSize: pageSize.toString(),
                searchText: searchText || '',
                ...filterParams
            });

            const response = await axios.get<Response>(
                `https://sandboxgathernexusapi.azurewebsites.net/api/Group/GetGroups?${queryParams}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("BearerToken")}` } }
            );
            console.log(response);
            setGroupData(response.data?.result?.records || []);
            setTotalRecords(response.data?.result?.totalRecord || 0);
        } catch (error) {
            message.error(error.message);
            console.error("Error fetching groups:", error);
        } finally {
            setFilterLoading(false);
        }
    };

    const getGroupClassData = async (filterParams = {}) => {
        try {
            setFilterLoading(true);
            const queryParams = new URLSearchParams({
                searchText: searchText || '',
                sortField: 'CreatedOn',
                page: currentGroupClassPage.toString(),
                pageSize: pageGroupClass.toString(),
                sortOrder: 'desc',
                ...filterParams
            });

            const response = await apiService.get(`/api/GRC/GetGRCRecords?${queryParams}`);
            setClassData(response.result.records || []);
            setGroupClass(response.result?.totalRecord || 0)
        } catch (error) {
            console.error("Error fetching group classes:", error);
            message.error("Failed to load group class data");
        } finally {
            setFilterLoading(false);
        }
    };

    const getGroupDropdownData = async () => {
        try {
            setFilterLoading(true);
            const response = await apiService.get("/api/Group/GetGroupDropdown?groupType=all&reportType=0");
            setGroupDropdownData(response.result || []);
        } catch (error) {
            console.error("Error fetching group dropdown data:", error);
            message.error("Failed to load filter options");
        } finally {
            setFilterLoading(false);
        }
    };

    const getCompanyDropdownData = async () => {
        try {
            setFilterLoading(true);
            const response = await apiService.get("/api/Company/GetCompanyDropdown?isHolding=yes");
            setCompanyDropdownData(response.result || []);
        } catch (error) {
            console.error("Error fetching company dropdown data:", error);
            message.error("Failed to load company filter options");
        } finally {
            setFilterLoading(false);
        }
    };

    const getGroupListDropdownData = async () => {
        try {
            setFilterLoading(true);
            const response = await apiService.get("/api/Group/GetGroupDropdown?groupType=all&reportType=0");
            setGroupListDropdownData(response.result || []);
        } catch (error) {
            console.error("Error fetching group list dropdown data:", error);
            message.error("Failed to load group list filter options");
        } finally {
            setFilterLoading(false);
        }
    };

    const showDrawer = () => {
        setIsDrawerVisible(true);
    };

    const showClassDrawer = () => {
        setIsClassDrawerVisible(true);
    };
    const handleFilterClick = () => {
        setFilterDropdownVisible(true);
        if (activeTab === 'groupClass') {
            if (groupDropdownData.length === 0) {
                getGroupDropdownData();
            }
        } else {
            if (companyDropdownData.length === 0) {
                getCompanyDropdownData();
            }
            if (groupListDropdownData.length === 0) {
                getGroupListDropdownData();
            }
        }
    };
    const applyGroupClassFilter = () => {
        const filterByGroup = selectedGroups.join(',');
        getGroupClassData({ filterByGroup });
        setFilterDropdownVisible(false);
        setFilterApplied(selectedGroups.length > 0);
    };

    const applyGroupFilter = () => {
        const filterByCompany = selectedCompanies.join(',');
        const filterByGroup = selectedGroupList.join(',');
        getGroupRecords({
            filterByCompany,
            filterByGroup
        });
        setFilterDropdownVisible(false);
        setCompanyFilterApplied(selectedCompanies.length > 0 || selectedGroupList.length > 0);
    };

    const resetGroupClassFilter = () => {
        setSelectedGroups([]);
        getGroupClassData();
        setFilterDropdownVisible(false);
        setFilterApplied(false);
    };
    const resetGroupFilter = () => {
        setSelectedCompanies([]);
        setSelectedGroupList([]);
        getGroupRecords();
        setFilterDropdownVisible(false);
        setCompanyFilterApplied(false);
    };

    const handleGroupCheckboxChange = (groupId: number, checked: boolean) => {
        if (checked) {
            setSelectedGroups([...selectedGroups, groupId]);
        } else {
            setSelectedGroups(selectedGroups.filter(id => id !== groupId));
        }
    };
    const handleCompanyCheckboxChange = (companyId: string, checked: boolean) => {
        if (checked) {
            setSelectedCompanies([...selectedCompanies, companyId]);
        } else {
            setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
        }
    };


    const handleGroupListCheckboxChange = (groupId: number, checked: boolean) => {
        if (checked) {
            setSelectedGroupList([...selectedGroupList, groupId]);
        } else {
            setSelectedGroupList(selectedGroupList.filter(id => id !== groupId));
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    const performSearch = () => {
        if (activeTab === 'groupClass') {
            const filterByGroup = selectedGroups.join(',');
            getGroupClassData({ filterByGroup });
        } else {
            const filterByCompany = selectedCompanies.join(',');
            const filterByGroup = selectedGroupList.join(',');
            getGroupRecords({
                filterByCompany,
                filterByGroup
            });
        }
    };

    const groupClassFilterDropdownContent = (
        <div style={{ background: "white", "padding": "20px", maxHeight: "200px", overflowY: "scroll" }}>
            <div className={styles.filterDropdownHeader}>
                <Text strong>Filter by Group</Text>
            </div>

            <div className={styles.filterDropdownContent}>
                {filterLoading ? (
                    <div className={styles.loadingContainer}>Loading filter options...</div>
                ) : (
                    <div className={styles.checkboxGroup}>
                        {groupDropdownData.map(group => (
                            <div key={group.id} className={styles.checkboxItem}>
                                <Checkbox
                                    checked={selectedGroups.includes(group.id)}
                                    onChange={(e) => handleGroupCheckboxChange(group.id, e.target.checked)}
                                >
                                    {group.option}
                                </Checkbox>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.filterDropdownFooter}>
                <Button size="small" onClick={resetGroupClassFilter}>
                    Reset
                </Button>
                <Button size="small" type="primary" onClick={applyGroupClassFilter}>
                    Apply
                </Button>
            </div>
        </div>
    );

    // Filter dropdown content for Group tab
    const groupFilterDropdownContent = (
        <div style={{ background: "white", "padding": "20px", maxHeight: "200px", overflowY: "scroll" }}>
            <div className={styles.filterDropdownHeader}>
                <Text strong>Filter Groups</Text>
            </div>

            <div className={styles.filterDropdownContent}>
                {filterLoading ? (
                    <div className={styles.loadingContainer}>Loading filter options...</div>
                ) : (
                    <Row>
                        <Col span={12} className={styles.filterColumn}>
                            <div className={styles.filterColumnHeader}>
                                <Text strong>Companies</Text>
                            </div>
                            <div className={styles.checkboxGroup}>
                                {companyDropdownData.map(company => (
                                    <div key={company.id} className={styles.checkboxItem}>
                                        <Checkbox
                                            checked={selectedCompanies.includes(company.id)}
                                            onChange={(e) => handleCompanyCheckboxChange(company.id, e.target.checked)}
                                        >
                                            {company.name}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </Col>
                        <Col span={12} className={styles.filterColumn}>
                            <div className={styles.filterColumnHeader}>
                                <Text strong>Groups</Text>
                            </div>
                            <div className={styles.checkboxGroup}>
                                {groupListDropdownData.map(group => (
                                    <div key={group.id} className={styles.checkboxItem}>
                                        <Checkbox
                                            checked={selectedGroupList.includes(group.id)}
                                            onChange={(e) => handleGroupListCheckboxChange(group.id, e.target.checked)}
                                        >
                                            {group.option}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                )}
            </div>

            <div className={styles.filterDropdownFooter}>
                <Button size="small" onClick={resetGroupFilter}>
                    Reset
                </Button>
                <Button size="small" type="primary" onClick={applyGroupFilter}>
                    Apply
                </Button>
            </div>
        </div>
    );

    useEffect(() => {
        getGroupRecords();
        getGroupClassData();
    }, [currentPage, pageSize,currentGroupClassPage,pageGroupClass]);

    return (
        <Layout className={styles.layout}>
            <Header className={styles.header}>
                <div className={styles.logoContainer}>
                    <span className={styles.logoText}>
                        <span className={styles.gatherText}>GATHER</span>
                        <span className={styles.nexusText}>.nexus</span>
                    </span>
                </div>
                <div className={styles.profileContainer}>
                    <Avatar className={styles.avatar}>S</Avatar>
                    <Dropdown overlay={
                        <Menu onClick={handleMenuClick}>
                            <Menu.Item key="profile" icon={<UserOutlined />}>My Profile</Menu.Item>
                            <Menu.Item key="logout" icon={<LogoutOutlined />}>Log Out</Menu.Item>
                        </Menu>
                    } trigger={["click"]} onOpenChange={setVisible} open={visible}>
                        <div className={styles.profileContainer} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.profileInfo}>
                                {/* <Text strong>Sujal</Text> */}
                                <Text>My Profile</Text>
                            </div>
                        </div>
                    </Dropdown>
                </div>
            </Header>

            <Content className={styles.content}>
                <div className={styles.pageHeader}>
                    <Button type="text" icon={<ArrowLeftOutlined />} className={styles.backButton}>
                        <span className={styles.pageTitle}>Multi-Entity & Display</span>
                    </Button>
                    <Button type="link" className={styles.addCompanyLink}>
                        How to Add {activeTab}?
                    </Button>
                </div>

                <div className={styles.searchActions}>
                    <Tabs activeKey={activeTab} onChange={handleTabChange} className={styles.tabs}>
                        <TabPane tab="Group" key="group" />
                        <TabPane tab="Group Class" key="groupClass" />
                    </Tabs>

                    <div className={styles.filterBox}>
                        <Input
                            placeholder="Search here..."
                            prefix={<SearchOutlined />}
                            className={styles.searchInput}
                            value={searchText}
                            onChange={handleSearchChange}
                            onPressEnter={performSearch}
                        />
                        <div className={styles.tableActions}>
                            <Space>
                                <Dropdown
                                    overlay={activeTab === 'groupClass' ? groupClassFilterDropdownContent : groupFilterDropdownContent}
                                    trigger={["click"]}
                                    open={filterDropdownVisible}
                                    onOpenChange={setFilterDropdownVisible}
                                >
                                    <Button
                                        icon={<FilterOutlined />}
                                        onClick={handleFilterClick}
                                        loading={filterLoading}
                                        type={(activeTab === 'groupClass' && filterApplied) ||
                                            (activeTab === 'group' && companyFilterApplied) ? "primary" : "default"}
                                    >
                                        Filter {activeTab === 'groupClass' && filterApplied ?
                                            `(${selectedGroups.length})` :
                                            activeTab === 'group' && companyFilterApplied ?
                                                `(${selectedCompanies.length + selectedGroupList.length})` : ""}
                                        <DownOutlined />
                                    </Button>
                                </Dropdown>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={activeTab === "group" ? showDrawer : showClassDrawer}
                                    className={styles.addButton}
                                >
                                    Add {activeTab === "group" ? " Group" : " Class"}
                                </Button>
                            </Space>
                        </div>
                    </div>
                </div>

                <AddGroupForm
                    isDrawerVisible={isDrawerVisible}
                    setIsDrawerVisible={setIsDrawerVisible}
                    editGroupData={editGroupData}
                    setEditGroupData={setEditGroupData}
                    getGroupRecords={getGroupRecords}
                />

                <AddClassForm
                    isClassDrawerVisible={isClassDrawerVisible}
                    setIsClassDrawerVisible={setIsClassDrawerVisible}
                    editClassID={editClassID}
                    setEditClassID={setEditClassID}
                    getGroupClassData={getGroupClassData}
                />

                {activeTab === "group" ? (
                    <GroupTable
                        getGroupRecords={getGroupRecords}
                        setActiveTab={setActiveTab}
                        groupData={groupData}
                        setEditGroupData={setEditGroupData}
                        setIsDrawerVisible={setIsDrawerVisible}
                        loading={filterLoading}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalRecords={totalRecords}
                        onPageChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                    />
                ) : (
                    <GroupClassTable
                        classData={classData}
                        getGroupClassData={getGroupClassData}
                        setEditClassID={setEditClassID}
                        setIsClassDrawerVisible={setIsClassDrawerVisible}
                        loading={filterLoading}
                        pageGroupClass={pageGroupClass}
                        currentGroupClassPage={currentGroupClassPage}
                        totalGroupClass={totalGroupClass}
                        onPageChange={(page,size)=>{
                            setCurrentGroupClassPage(page);
                            setpageGroupClass(size);
                        }}
                    />
                )}
            </Content>
        </Layout>
    );
};

export default Home;








