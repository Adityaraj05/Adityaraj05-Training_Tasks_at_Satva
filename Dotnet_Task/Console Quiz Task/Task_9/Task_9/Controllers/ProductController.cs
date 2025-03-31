using DataAccessLayer.Interfaces;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Task_9.Models; // Import for ApiResponse

namespace Task_9.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<Product>>>> GetProducts()
        {
            var products = await _productRepository.GetAllProductsAsync();
            return Ok(ApiResponse<IEnumerable<Product>>.SuccessResponse("Products retrieved successfully", products));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Product>>> GetProduct(string id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(ApiResponse<Product>.ErrorResponse("Product not found"));
            }
            return Ok(ApiResponse<Product>.SuccessResponse("Product retrieved successfully", product));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<ApiResponse<Product>>> CreateProduct(Product product)
        {
            product.Id = null; // MongoDB will auto-generate ID
            var createdProduct = await _productRepository.CreateProductAsync(product);

            return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id },
                ApiResponse<Product>.SuccessResponse("Product created successfully", createdProduct));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateProduct(string id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Product ID mismatch"));
            }

            var result = await _productRepository.UpdateProductAsync(id, product);
            if (!result)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("Product not found"));
            }

            return Ok(ApiResponse<string>.SuccessResponse("Product updated successfully", id));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteProduct(string id)
        {
            var result = await _productRepository.DeleteProductAsync(id);
            if (!result)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("Product not found"));
            }

            return Ok(ApiResponse<string>.SuccessResponse("Product deleted successfully", id));
        }
    }
}
