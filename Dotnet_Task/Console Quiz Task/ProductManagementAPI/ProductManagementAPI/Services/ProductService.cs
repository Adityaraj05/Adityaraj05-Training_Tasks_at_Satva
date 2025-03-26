
using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Models;

namespace ProductManagementAPI.Services
{
    public class ProductService : IProductService
    {
        private static List<Product> _products = new List<Product>
        {
            new Product
            {
                Id = 1,
                Name = "Laptop",
                Description = "High-performance laptop",
                Price = 1000.00m,
                Status = ProductStatus.Active
            },
            new Product
            {
                Id = 2,
                Name = "Smartphone",
                Description = "Latest smartphone model",
                Price = 800.00m,
                Status = ProductStatus.Active
            }
        };

        public CommonResponse<List<Product>> GetAllProducts()
        {
            return CommonResponse<List<Product>>.Success(_products, "Products retrieved successfully");
        }

        public CommonResponse<Product> GetProductById(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            return product != null
                ? CommonResponse<Product>.Success(product, "Product found")
                : CommonResponse<Product>.Failure("Product not found");
        }

        public CommonResponse<Product> AddProduct(Product product)
        {
            // Ensure unique ID
            product.Id = _products.Count > 0 ? _products.Max(p => p.Id) + 1 : 1;

            _products.Add(product);
            return CommonResponse<Product>.Success(product, "Product added successfully");
        }

        public CommonResponse<Product> UpdateProduct(int id, Product product)
        {
            var existingProduct = _products.FirstOrDefault(p => p.Id == id);
            if (existingProduct == null)
                return CommonResponse<Product>.Failure("Product not found");

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.Status = product.Status;

            return CommonResponse<Product>.Success(existingProduct, "Product updated successfully");
        }

        public CommonResponse<bool> DeleteProduct(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return CommonResponse<bool>.Failure("Product not found");

            _products.Remove(product);
            return CommonResponse<bool>.Success(true, "Product deleted successfully");
        }
    }
}