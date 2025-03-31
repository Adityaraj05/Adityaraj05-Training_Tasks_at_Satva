using DataAccessLayer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataAccessLayer.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<Product> GetProductByIdAsync(string id);
        Task<Product> CreateProductAsync(Product product);
        Task<bool> UpdateProductAsync(string id, Product product);
        Task<bool> DeleteProductAsync(string id);
    }
}