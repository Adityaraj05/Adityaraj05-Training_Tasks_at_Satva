
using DataAccessLayer.Context;
using DataAccessLayer.Interfaces;
using DataAccessLayer.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataAccessLayer.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ProductDbContext _context;

        public ProductRepository(ProductDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _context.Products.Find(_ => true).ToListAsync();
        }

        public async Task<Product> GetProductByIdAsync(string id)
        {
            return await _context.Products.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            await _context.Products.InsertOneAsync(product);
            return product;
        }

        public async Task<bool> UpdateProductAsync(string id, Product product)
        {
            var updateResult = await _context.Products
                .ReplaceOneAsync(p => p.Id == id, product);

            return updateResult.IsAcknowledged && updateResult.ModifiedCount > 0;
        }

        public async Task<bool> DeleteProductAsync(string id)
        {
            var deleteResult = await _context.Products
                .DeleteOneAsync(p => p.Id == id);

            return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
        }
    }
}