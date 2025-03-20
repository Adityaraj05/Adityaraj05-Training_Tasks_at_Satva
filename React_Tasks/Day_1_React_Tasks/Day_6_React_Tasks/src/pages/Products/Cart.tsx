import { Card, Table, Button, Typography, Image, message } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useCartContext } from "../../Context/CartContext/CartWrapper";
import { useProductContext } from "../../Context/ProductContext/ProductWrapper";

const { Title } = Typography;

export const Cart = () => {
  const { removeFromCart, cart, increaseQuantity, decreaseQuantity, total } = useCartContext();
  const { products } = useProductContext();
  const cartItems = cart.products.map(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    return product ? { ...product, quantity: cartItem.quantity } : null;
  }).filter(Boolean); // Remove null values if product not found

  const handleDecrease = (productId: number) => {
    const cartItem = cart.products.find(item => item.id === productId);
    if (cartItem && cartItem.quantity > 1) {
      decreaseQuantity(productId);
    } else {
      removeFromCart(productId);
      message.warning("Product removed from cart.");
    }
  };

  const handleIncrease = (productId: number) => {
    increaseQuantity(productId);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <Image src={image} width={80} height={80} />,
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <Button.Group>
          <Button icon={<MinusOutlined />} onClick={() => handleDecrease(record.id)} />
          <Button>{record.quantity}</Button>
          <Button icon={<PlusOutlined />} onClick={() => handleIncrease(record.id)} />
        </Button.Group>
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => removeFromCart(record.id)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Card title="Shopping Cart" style={{ minWidth: "100%" }}>
      {cartItems.length > 0 ? (
        <>
          <Table dataSource={cartItems} columns={columns} pagination={false} rowKey="id" />
          <Title level={3} style={{ marginTop: 20 }}>
            Total: ${total.toFixed(2)}
          </Title>
          <Button type="primary" style={{ marginTop: 15, padding: "10px 20px" }}>
            Checkout
          </Button>
        </>
      ) : (
        <Title level={4} style={{ textAlign: "center", marginTop: 20 }}>
          Your cart is empty.
        </Title>
      )}
    </Card>
  );
};
