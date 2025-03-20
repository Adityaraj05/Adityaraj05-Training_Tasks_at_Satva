import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useProductContext } from "../../Context/ProductContext/ProductWrapper";
import { ProductType } from "../../Context/ProductContext/ProductWrapper";

const { Option } = Select;

export const AddEditProduct = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { products, addProduct, updateProduct } = useProductContext();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id) {
            const existingProduct = products.find((p) => p.id === Number(id));
            if (existingProduct) {
                setIsEditing(true);
                setImageUrl(existingProduct.image);
                form.setFieldsValue(existingProduct);
            } else {
                message.error("Product not found!");
                navigate("/dashboard");
            }
        }
    }, [id, products, form, navigate]);

    const handleSave = (values: ProductType) => {
        setLoading(true);
        setTimeout(() => {
            if (isEditing) {
                updateProduct({ id: Number(id), ...values, image: imageUrl });
                message.success("Product updated successfully!");
            } else {
                const newProduct = {
                    id: Date.now(),
                    ...values,
                    quantity: 0,
                    image: imageUrl || "https://placehold.co/200",
                };
                addProduct(newProduct);
                message.success("Product added successfully!");
            }

            setLoading(false);
            navigate("/dashboard");
        }, 1000);
    };

    return (
        <Form form={form} style={{ maxWidth: "65%" }} layout="vertical" onFinish={handleSave}>
            <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: "Please enter product name" }, { min: 3, message: "At least 3 chars required" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select category" }]}>
                <Select>
                    <Option value="Electronics">Electronics</Option>
                    <Option value="Clothing">Clothing</Option>
                    <Option value="Accessories">Accessories</Option>
                    <Option value="Home Appliances">Home Appliances</Option>
                    <Option value="Sports & Outdoors">Sports & Outdoors</Option>
                    <Option value="Toys & Games">Toys & Games</Option>
                    <Option value="Food & Groceries">Food & Groceries</Option>
                    <Option value="Health & Wellness">Health & Wellness</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please add description" }, { min: 3, message: "At least 3 chars required" }]}>
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price" }]}>
                <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="image" label="Product Image URL">
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Enter image URL" />
                {imageUrl && <img src={imageUrl} alt="Product" style={{ marginTop: 10, maxWidth: "150px" }} />}
            </Form.Item>

            <Button type="primary" htmlType="submit" disabled={loading}>
                {loading ? <Spin /> : isEditing ? "Update" : "Save"}
            </Button>
        </Form>
    );
};
