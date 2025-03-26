// Controllers/ProductsController.cs
using Microsoft.AspNetCore.Mvc;
using ProductManagementAPI.Interfaces;
using ProductManagementAPI.Models;

namespace ProductManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet("GetAllProducts")]
        public ActionResult<CommonResponse<List<Product>>> GetAllProducts()
        {
            var response = _productService.GetAllProducts();
            return Ok(response);
        }
        

        [HttpGet("GetProductById/{id}")]
        public ActionResult<CommonResponse<Product>> GetProductById(int id)
        {
            var response = _productService.GetProductById(id);
            return response.Status == 1 ? Ok(response) : NotFound(response);
        }

        [HttpPost("AddProduct")]
        public ActionResult<CommonResponse<Product>> AddProduct([FromBody] Product product)
        {
            var response = _productService.AddProduct(product);
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, response);
        }

        [HttpPut("UpdateProductById/{id}")]
        public ActionResult<CommonResponse<Product>> UpdateProduct(int id, [FromBody] Product product)
        {
            var response = _productService.UpdateProduct(id, product);
            return response.Status == 1 ? Ok(response) : NotFound(response);
        }

        [HttpDelete("DeleteProductById/{id}")]
        public ActionResult<CommonResponse<bool>> DeleteProduct(int id)
        {
            var response = _productService.DeleteProduct(id);
            return response.Status == 1 ? Ok(response) : NotFound(response);
        }
    }
}