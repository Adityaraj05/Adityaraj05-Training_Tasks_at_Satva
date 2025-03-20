import { Table, Tag, Space, Button, message, Modal } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../../Context/ProductContext/ProductWrapper";
import { ProductType } from "../../Context/ProductContext/ProductWrapper";

export const Products = () => {
    const { products, deleteProduct } = useProductContext(); 
    const navigate = useNavigate();

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: "Are you sure you want to delete this product?",
            content: "This action cannot be undone.",
            okText: "Yes, delete it",
            okType: "danger",
            cancelText: "No, cancel",
            onOk() {
                deleteProduct(id);
                message.success("Product deleted successfully");
            },
        });
    };

    const columns: TableProps<ProductType>["columns"] = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image) =>
                image ? (
                    <img src={image || "https://placehold.co/400"} alt="Product" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
                ) : (
                    "No Image"
                ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (category) => <Tag color="blue">{category}</Tag>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price}`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => navigate(`/dashboard/products/view-product/${record.id}`)}>
                        <EyeOutlined />
                    </Button>
                    <Button type="primary" onClick={() => navigate(`/dashboard/products/edit-product/${record.id}`)}>
                        <EditOutlined />
                    </Button>
                    <Button type="default" danger onClick={() => handleDelete(record.id!)}>
                        <DeleteOutlined />
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => navigate("/dashboard/products/add-product")} style={{ marginBottom: "10px" }}>
                Add Product
            </Button>
            <Table<ProductType> columns={columns} dataSource={products} rowKey="id" />
        </div>
    );
};
