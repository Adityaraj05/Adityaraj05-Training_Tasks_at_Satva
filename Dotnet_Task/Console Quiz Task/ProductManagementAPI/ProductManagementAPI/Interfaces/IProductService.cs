using ProductManagementAPI.Models;
namespace ProductManagementAPI.Interfaces
{
    public interface IProductService
    {
        CommonResponse<List<Product>> GetAllProducts();
        CommonResponse<Product> GetProductById(int id);
        CommonResponse<Product> AddProduct(Product product);
        CommonResponse<Product> UpdateProduct(int id, Product product);
        CommonResponse<bool> DeleteProduct(int id);
    }
}
