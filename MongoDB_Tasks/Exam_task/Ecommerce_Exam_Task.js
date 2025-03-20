db.createCollection("Category", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["categoryId", "name", "description"],
        properties: {
          categoryId: { bsonType: "string", description: "Must be a string and required" },
          name: { bsonType: "string", description: "Must be a string and required" },
          description: { bsonType: "string", description: "Must be a string and required" }
        }
      }
    }
  });

  db.createCollection("Product", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["productId", "name", "price", "categoryId", "stock"],
        properties: {
          productId: { bsonType: "string", description: "Must be a string and required" },
          name: { bsonType: "string", description: "Must be a string and required" },
          price: { bsonType: "double", minimum: 0, description: "Must be a positive number and required" },
          categoryId: { bsonType: "string", description: "Must be a string referencing Category" },
          stock: { bsonType: "int", minimum: 0, description: "Must be an integer and required" }
        }
      }
    }
  });

  db.createCollection("Customer", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["customerId", "name", "email", "address"],
        properties: {
          customerId: { bsonType: "string", description: "Must be a string and required" },
          name: { bsonType: "string", description: "Must be a string and required" },
          email: { bsonType: "string", pattern: "^.+@.+$", description: "Must be a valid email format" },
          address: { bsonType: "string", description: "Must be a string and required" }
        }
      }
    }
  });

  db.createCollection("Order", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["orderId", "customerId", "products", "totalAmount", "orderDate", "status"],
        properties: {
          orderId: { bsonType: "string", description: "Must be a string and required" },
          customerId: { bsonType: "string", description: "Must be a string referencing Customer" },
          products: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: { bsonType: "string", description: "Must be a string referencing Product" },
                quantity: { bsonType: "int", minimum: 1, description: "Must be a positive integer" }
              }
            },
            description: "Must be an array of product objects"
          },
          totalAmount: { bsonType: "double", minimum: 0, description: "Must be a positive number" },
          orderDate: { bsonType: "date", description: "Must be a valid date" },
          status: { bsonType: "string", enum: ["Pending", "Shipped", "Delivered", "Cancelled"], description: "Must be one of the predefined statuses" }
        }
      }
    }
  });


//   Task_2  Category
  db.Category.insertMany([
    { categoryId: "cat001", name: "Smartphones", description: "Latest smartphones from top brands" },
    { categoryId: "cat002", name: "Men's Fashion", description: "Men's clothing, footwear, and accessories" },
    { categoryId: "cat003", name: "Kitchen Appliances", description: "Essential kitchen and home appliances" },
    { categoryId: "cat004", name: "Grocery & Staples", description: "Daily grocery, pulses, and food grains" },
    { categoryId: "cat005", name: "Books & Stationery", description: "Best-selling books, notebooks, and study materials" }
  ]);

  db.Category.updateOne(
    { categoryId: "cat001" },  
    { $set: { description: "Latest smartphones from top global brands with best deals." } }  
  );

  db.Category.find({ categoryId: "cat001" }).pretty();


  db.Category.deleteOne({ categoryId: 'cat003' });

  db.Category.find({});

//   Product

db.Product.insertMany([
    {
      productId: "P001",
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      categoryId: "C001", 
      stock: 150
    },
    {
      productId: "P002",
      name: "Smartphone 128GB",
      price: 699.99,
      categoryId: "C001", 
      stock: 200
    },
    {
      productId: "P003",
      name: "Running Shoes - Size 10",
      price: 49.99,
      categoryId: "C002", 
      stock: 300
    },
    {
      productId: "P004",
      name: "4K Ultra HD Smart TV",
      price: 799.99,
      categoryId: "C001", 
      stock: 100
    },
    {
      productId: "P005",
      name: "Stainless Steel Coffee Maker",
      price: 119.99,
      categoryId: "C003", 
    }
  ]);
  
  
  db.Product.updateOne(
    { productId: "P001" }, 
    { 
      $set: {
        price: 99.99,  
        stock: 120     
      }
    }
  );

  db.Product.deleteOne({ productId: "P001" });

  db.Product.find({ categoryId: "C001" });

//   Task Cateogry.

db.Customer.insertMany([
    {
      customerId: "C001",
      name: "John Doe",
      email: "johndoe@example.com",
      address: "123 Main St, Springfield, IL"
    },
    {
      customerId: "C002",
      name: "Jane Smith",
      email: "janesmith@example.com",
      address: "456 Oak St, Springfield, IL"
    },
    {
      customerId: "C003",
      name: "Robert Johnson",
      email: "robertj@example.com",
      address: "789 Pine St, Springfield, IL"
    },
    {
      customerId: "C004",
      name: "Emily Davis",
      email: "emilydavis@example.com",
      address: "101 Maple St, Springfield, IL"
    },
    {
      customerId: "C005",
      name: "Michael Brown",
      email: "michaelbrown@example.com",
      address: "202 Birch St, Springfield, IL"
    }
  ]);

  db.Customer.updateOne(
    { email: "johndoe@example.com" },
    { 
      $set: { 
        address: "321 Elm St, Springfield, IL" 
      }
    }
  );

  db.Customer.findOne({ email: "johndoe@example.com" });


//   order

db.Order.insertMany([
    {
      orderId: "O001",
      customerId: "C001",  
      products: [
        { productId: "P001", quantity: 2 },  
        { productId: "P002", quantity: 1 }   
      ],
      totalAmount: 879.97,  
      orderDate: new Date(),
      status: "Pending"
    },
    {
      orderId: "O002",
      customerId: "C002",  
      products: [
        { productId: "P003", quantity: 3 },  
        { productId: "P005", quantity: 1 }   
      ],
      totalAmount: 269.97,
      orderDate: new Date(),
      status: "Pending"
    },
    {
      orderId: "O003",
      customerId: "C003",
      products: [
        { productId: "P002", quantity: 1 },  
        { productId: "P004", quantity: 1 }   
      ],
      totalAmount: 1499.98,
      orderDate: new Date(),
      status: "Shipped"
    },
    {
      orderId: "O004",
      customerId: "C004",
      products: [
        { productId: "P001", quantity: 1 }, 
        { productId: "P003", quantity: 2 }   
      ],
      totalAmount: 189.97,
      orderDate: new Date(),
      status: "Delivered"
    },
    {
      orderId: "O005",
      customerId: "C005",
      products: [
        { productId: "P004", quantity: 1 },  
        { productId: "P005", quantity: 2 }   
      ],
      totalAmount: 1039.97,
      orderDate: new Date(),
      status: "Pending"
    }
  ]);
  
  db.Order.updateOne(
    { orderId: "O001" },  
    { 
      $set: { status: "Shipped" } 
    }
  );
  
  db.Order.find({ customerId: "C001" });

  db.Order.deleteOne({ orderId: "O001" });

//   Task 3: Queries Using Aggregation
db.Product.aggregate([
    {
      $lookup: {
        from: "Category",       
        localField: "categoryId", 
        foreignField: "categoryId", 
        as: "categoryDetails"   
      }
    }
  ]);
  
  db.Product.aggregate([
    {
      $group: {
        _id: "$categoryId", 
        totalProducts: { $sum: 1 } 
      }
    }
  ]);
  

 
  db.Order.aggregate([
    {
      $unwind: "$products" 
    },
    {
      $group: {
        _id: "$products.productId", 
        totalQuantitySold: { $sum: "$products.quantity" } 
      }
    },
    {
      $sort: { totalQuantitySold: -1 } 
    },
    {
      $limit: 5 
    },
    {
      $lookup: {
        from: "Product", 
        localField: "_id",
        foreignField: "productId",
        as: "productDetails"
      }
    },
    {
      $unwind: "$productDetails" 
    },
    {
      $project: {
        productId: "$_id",
        name: "$productDetails.name",
        totalQuantitySold: 1,
        price: "$productDetails.price",
        totalRevenue: { $multiply: ["$totalQuantitySold", "$productDetails.price"] }
      }
    }
  ]);
  

  db.Order.aggregate([
    {
      $match: {
        orderDate: {
          $gte: ISODate("2025-02-02T00:00:00.000Z"),
          $lt: ISODate("2025-03-02T00:00:00.000Z")
        }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" }
      }
    }
  ])


  db.Order.aggregate([
    {
      $lookup: {
        from: "Customer", 
        localField: "customerId", 
        foreignField: "customerId", 
        as: "customerInfo" 
      }
    },
    {
      $unwind: {
        path: "$customerInfo",
        preserveNullAndEmptyArrays: true 
      }
    },
    {
      $group: {
        _id: "$customerInfo.customerId", 
        customerName: { $first: "$customerInfo.name" }, 
        totalPurchases: { $sum: "$totalAmount" } 
      }
    }
  ])
    

// Task 4: Additional Features
// Implement indexing for optimized query performance
db.Order.createIndex({ customerId: 1 });


// ● Implement $exists and $type queries for data validation.

db.Order.find({ "orderDate": { $exists: true, $type: "date" } });



// ● Use comparison and logical operators in queries.
  db.Order.find({
    totalAmount: { $gte: 100, $lte: 500 },
    status: { $ne: "Pending" }
  });


  db.Order.find({
    totalAmount :{$get:100, $lte:200},
    status:{$ne: "pending"}
  })

//   Find the customer who placed the most orders

  db.Order.aggregate([{$group:{_id:"$customerId", orderCount:{$sum:1}}}, {$sort: {orderCount:-1}}, { $limit:1}]);

//   ● List all customers who have not placed any orders.

  db.Customer.aggregate([
    { $lookup: { from: "Order", localField: "customerId", foreignField: "customerId", as: "details" } },
    { $match: { details: { $size: 0 } } 
}])

// ● Get the most frequently ordered product.

  db.Order.aggregate([{$unwind : "$products"},{ $group:{_id: "$products", count:{$sum:1}}}, {$sort:{count:-1}}, {$limit:1} ])


// Find customers who have not placed an order in the last 6 months
db.Customer.find({
  customerId: {
    $nin: db.Order.distinct("customerId", { 
      orderDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } 
    }) 
  }
});


// ● Find the customer who spent the most money.

  db.Order.aggregate([{$group:{_id:"$customerId", totalSpent:{$sum:"$totalAmount"}}}, {$sort:{totalSpent:-1}}, {$limit:1}])

  
// Identify which month had the highest sales volume.

  db.Order.aggregate([
    {
      $project: {
        year: { $year: "$orderDate" },  
        month: { $month: "$orderDate" },  
        totalAmount: 1  
      }
    },
    {
      $group: {
        _id: { year: "$year", month: "$month" },  
        totalSales: { $sum: "$totalAmount" }  
      }
    },
    {
      $sort: { totalSales: -1 }  
    },
    {
      $limit: 1  
    }
  ])


//   Get the top 5 products that were most frequently added to orders
  
  db.Order.aggregate([{$group:{_id:"$products", count:{$sum:1}}}, {$sort:{count:-1}}, {$limit:5}])





//  mongodump =>D:\MongoDB>mongodump --out Backup 

//  for one particular database => D:\MongoDB>mongodump --db Adityaraj --out Backup1
  

//  mongorestore command => D:\MongoDB>mongorestore Backup1  



db.Product.aggregate([
  {
    $lookup: {
      from: "Category",        
      localField: "categoryId",
      foreignField: "categoryId",
      as: "categoryDetails"     
    }
  },
  {
    $match: {
      categoryDetails: { $size: 0 }  
    }
  }
]);


