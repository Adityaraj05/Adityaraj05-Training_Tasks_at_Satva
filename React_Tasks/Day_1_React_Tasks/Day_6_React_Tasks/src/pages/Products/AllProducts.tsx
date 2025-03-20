import { Card, Button, Row, Col, Typography, message } from "antd";
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useProductContext } from "../../Context/ProductContext/ProductWrapper";
import { useCartContext } from "../../Context/CartContext/CartWrapper";

const { Title, Text } = Typography;

export const AllProducts = () => {
    const { products } = useProductContext();
    const { addToCart, removeFromCart, cart, increaseQuantity, decreaseQuantity } = useCartContext();

    const handleAddToCart = (productId: number) => {
        addToCart(productId);
        message.success("Product added to cart!");
    };

    const handleIncrease = (productId: number) => {
        increaseQuantity(productId);
    };

    const handleRemove = (id: number) => {
        removeFromCart(id);
        message.success("Product removed from cart.");
    };

    const handleDecrease = (productId: number) => {
        const cartItem = cart.products.find(item => item.id === productId);
        if (cartItem && cartItem.quantity > 1) {
            decreaseQuantity(productId);
        } else {
            removeFromCart(productId);
            message.warning("Product removed from cart.");
        }
    };

    return (
        <div>
            <Title level={2}>All Products</Title>
            <Row gutter={[18, 18]}>
                {products.length > 0 ? (
                    products.map((product) => {
                        const cartItem = cart.products.find((item) => item.id === product.id);
                        return (
                            <Col key={product.id} xs={24} sm={12} md={8} lg={8}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={product.name}
                                            src={product.image || "https://placehold.co/400"}
                                            style={{ height: 200, objectFit: "cover" }}
                                        />
                                    }
                                >
                                    <Title level={3}>{product.name}</Title>
                                    <Text type="secondary">{product.category}</Text>
                                    <p>{product.description}</p>
                                    <Text strong style={{ fontSize: "16px" }}>Price: ${product.price}</Text>

                                    {cartItem ? (
                                        <>
                                            <Button.Group style={{ width: "100%", margin: "8px 0" }}>
                                                <Button
                                                    icon={<MinusOutlined />}
                                                    onClick={() => typeof product.id === "number" && handleDecrease(product.id)}
                                                />
                                                <Button>{cartItem.quantity}</Button>
                                                <Button
                                                    icon={<PlusOutlined />}
                                                    onClick={() => typeof product.id === "number" && handleIncrease(product.id)}
                                                />
                                            </Button.Group>
                                            <Button
                                                type="default"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => typeof product.id === "number" && handleRemove(product.id)}
                                                block
                                            >
                                                Remove from Cart
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            type="primary"
                                            icon={<ShoppingCartOutlined />}
                                            onClick={() => typeof product.id === "number" && handleAddToCart(product.id)}
                                            block
                                        >
                                            Add to Cart
                                        </Button>
                                    )}
                                </Card>
                            </Col>
                        );
                    })
                ) : (
                    <div style={{ margin: "auto", textAlign: "center" }}>
                        <Title level={3}>No Products Available</Title>
                        <p style={{ margin: "12px 0" }}>
                            Sorry, we couldn't find any products.
                        </p>
                        <Button type="primary" href="/dashboard">Back to Home</Button>
                    </div>
                )}
            </Row>
        </div>
    );
};
