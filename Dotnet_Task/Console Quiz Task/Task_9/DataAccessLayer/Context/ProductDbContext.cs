using DataAccessLayer.Models;
using MongoDB.Driver;

namespace DataAccessLayer.Context
{
    public class ProductDbContext
    {
        private readonly IMongoCollection<Product> _products;

        public ProductDbContext(IMongoDatabase database, string productsCollectionName)
        {
            _products = database.GetCollection<Product>(productsCollectionName);
        }

        public IMongoCollection<Product> Products => _products;
    }
}
