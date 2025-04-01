using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Task10.Models;

namespace Task10.Services
{
        public class ProductService: ControllerBase
        {
            private readonly IMongoCollection<Product> _products;
            private readonly IMongoCollection<ProductMultiple> _productsMultiple;

        public ProductService(IMongoDatabase database)
        {
            _products = database.GetCollection<Product>("Products");
            _productsMultiple = database.GetCollection<ProductMultiple>("ProductsMultiple");
        }

            public async Task<List<Product>> GetAllAsync() =>
            await _products.Find(_ => true).ToListAsync();

            public async Task CreateAsync(Product product) =>
                await _products.InsertOneAsync(product);
            
    
            public async Task CreateAsyncMultiple(ProductMultiple productMultiple) =>
            await _productsMultiple.InsertOneAsync(productMultiple);

        public async Task<List<ProductMultiple>> GetAllAsyncMultiple() =>
        await _productsMultiple.Find(_ => true).ToListAsync();


    }
    }
