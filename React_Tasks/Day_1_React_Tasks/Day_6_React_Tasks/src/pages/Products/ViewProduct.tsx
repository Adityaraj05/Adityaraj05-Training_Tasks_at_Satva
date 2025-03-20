import React, { useEffect, useState } from "react";
import { Card, Descriptions, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ProductType } from "../../Context/ProductContext/ProductWrapper";
import { useProductContext } from "../../Context/ProductContext/ProductWrapper";

export const ViewProduct = () => {
    const { id } = useParams<{ id: string }>();
    // console.log(id)
    const navigate = useNavigate();
    const [productData, setProductData] = useState<ProductType>({} as ProductType);
    const { products } = useProductContext();

    useEffect(() => {
        // console.log(products)
        if (products) {
            const foundProduct = products.find((p: ProductType) => p.id === Number(id));
            if (foundProduct) {
                setProductData(foundProduct);
            } else {
                message.error("Product not found!");
                navigate("/dashboard");
            }
        }
    }, [id, navigate, products]);

    return productData ? (
        <Card title="Product Details" style={{ maxWidth: 500, margin: "0 auto" }}>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Product Image">
                    <img src={productData.image} alt={productData.name} style={{ maxWidth: "200px", borderRadius: "5%" }}></img>
                </Descriptions.Item>
                <Descriptions.Item label="Name">{productData.name}</Descriptions.Item>
                <Descriptions.Item label="Category">{productData.category}</Descriptions.Item>
                <Descriptions.Item label="Description">{productData.description}</Descriptions.Item>
                <Descriptions.Item label="Price">${productData.price}</Descriptions.Item>
            </Descriptions>
            <Button type="primary" style={{ marginTop: 20 }} onClick={() => navigate("/dashboard")}>
                Back to Products
            </Button>
        </Card>
    ) : null;
};
