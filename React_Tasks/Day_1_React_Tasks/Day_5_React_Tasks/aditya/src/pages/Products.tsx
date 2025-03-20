import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Select } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string;
}

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const openModal = (product?: Product) => {
    setEditingProduct(product || null);
    form.setFieldsValue(product || { name: "", price: "", category: "", description: "" });
    setIsModalOpen(true);
  };

  const openViewModal = (product: Product) => {
    setViewProduct(product);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (values: Omit<Product, "id">) => {
    if (editingProduct) {
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...values } : p
      );
      saveProducts(updatedProducts);
      message.success("Product updated successfully!");
    } else {
      const newProduct = { id: Date.now(), ...values };
      saveProducts([...products, newProduct]);
      message.success("Product added successfully!");
    }
    setIsModalOpen(false);
    form.resetFields();
  };



  const deleteProduct = (id: number) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      onOk: () => {
        const updatedProducts = products.filter((p) => p.id !== id);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
        
        message.success("Product deleted successfully!");
      },
      onCancel: () => message.info("Deletion cancelled"),
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Add Product
      </Button>
      <Table dataSource={products} rowKey={(record) => record.id.toString()} pagination={{ pageSize: 5 }}>
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Price $" dataIndex="price" key="price" />
        <Table.Column title="Category" dataIndex="category" key="category" />
        <Table.Column title="Description" dataIndex="description" key="description" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(product: Product) => (
            <>
        
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => openViewModal(product)}
                style={{ marginRight: 8 }}
              >
                View
              </Button>

              <Button
                type="default"
                icon={<EditOutlined />}
                style={{ backgroundColor: "#52c41a", color: "white", marginRight: 8 }}
                onClick={() => openModal(product)}
              >
                Edit
              </Button>

       
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteProduct(product.id)}
              >
                Delete
              </Button>
            </>
          )}
        />
      </Table>

      {/* Add/Edit Product Modal */}
      <Modal
  title={editingProduct ? "Edit Product" : "Add Product"}
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  onOk={() => form.submit()}
>
  <Form form={form} layout="vertical" onFinish={handleSubmit}>
    <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the product name" }]}>
      <Input />
    </Form.Item>

    <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter the price" }]}>
      <Input />
    </Form.Item>

    {/* Updated Category Field with Select Dropdown */}
    <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select a category" }]}>
      <Select>
        <Select.Option value="Clothing">Clothing</Select.Option>
        <Select.Option value="Home Appliances">Home Appliances</Select.Option>
        <Select.Option value="Electronics">Electronics</Select.Option>
        <Select.Option value="Books">Books</Select.Option>
        <Select.Option value="Furniture">Furniture</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item label="Description" name="description">
      <Input.TextArea />
    </Form.Item>
  </Form>
</Modal>

      {/* View Product Modal */}
      <Modal
        title="Product Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {viewProduct && (
          <div>
            <p><strong>Name:</strong> {viewProduct.name}</p>
            <p><strong>Price:</strong> {viewProduct.price}</p>
            <p><strong>Category:</strong> {viewProduct.category}</p>
            <p><strong>Description:</strong> {viewProduct.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};