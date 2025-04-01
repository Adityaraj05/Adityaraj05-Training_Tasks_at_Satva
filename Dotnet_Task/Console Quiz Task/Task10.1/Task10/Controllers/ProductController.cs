using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Task10.Services;
using Task10.Models;
using System.ComponentModel.DataAnnotations;

namespace Task10.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;
        private readonly string _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
     

        public ProductController(ProductService productService)
        {
            _productService = productService;
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        [HttpGet("get-all-products")]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productService.GetAllAsync();

            if (products == null || !products.Any())
            {
                return NotFound(new CommonResponse<object>(404, "No products found.", null));
            }

            return Ok(new CommonResponse<object>(200, "Products retrieved successfully", products));
        }

        [HttpGet("get-all-products-multiple")]
        public async Task<IActionResult> GetAllProductsMultiple()
        {
            var products = await _productService.GetAllAsyncMultiple();

            if (products == null || !products.Any())
            {
                return NotFound(new CommonResponse<object>(404, "No products found.", null));
            }
            return Ok(new CommonResponse<object>(200, "Products retrieved successfully", products));
        }

        [HttpPost("upload-product")]
        public async Task<IActionResult> UploadProduct([FromForm] Product product)
        {
            ModelState.Remove("Id");
            ModelState.Remove("ImagePath");

            if (string.IsNullOrWhiteSpace(product.Name) || product.Name.Length > 100)
            {
                return BadRequest(new CommonResponse<object>(400, "Product name is required and must be less than 100 characters.", null));
            }
            if (product.Price <= 0)
            {
                return BadRequest(new CommonResponse<object>(400, "Price must be greater than 0.", null));
            }
            if (product.File == null || product.File.Length == 0)
            {
                return BadRequest(new CommonResponse<object>(400, "File is required.", null));
            }

            var fileExtension = Path.GetExtension(product.File.FileName).ToLower();
            if (!_allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new CommonResponse<object>(400, "Invalid file format. Only JPG, JPEG, PNG, and GIF are allowed.", null));
            }

            string uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(product.File.FileName)}";
            string filePath = Path.Combine(_uploadPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await product.File.CopyToAsync(stream);
            }

            product.ImagePath = filePath; // Store full file path
            await _productService.CreateAsync(product);

            return Ok(new CommonResponse<object>(201, "Product uploaded successfully", new
            {
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                ImagePath = filePath // Return full path
            }));
        }

        [HttpPost("upload-product-multiple")]
        public async Task<IActionResult> UploadMultipleFiles([FromForm] ProductMultiple product)
        {
            ModelState.Remove("Id");
            ModelState.Remove("ImagePaths");

            if (string.IsNullOrWhiteSpace(product.Name) || product.Name.Length > 100)
            {
                return BadRequest(new CommonResponse<object>(400, "Product name is required and must be less than 100 characters.", null));
            }
            if (product.Price <= 0)
            {
                return BadRequest(new CommonResponse<object>(400, "Price must be greater than 0.", null));
            }
            if (product.Files == null || product.Files.Count == 0)
            {
                return BadRequest(new CommonResponse<object>(400, "At least one file is required.", null));
            }

            var uploadedFilePaths = new List<string>();

            foreach (var file in product.Files)
            {
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!_allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new CommonResponse<object>(400, "Invalid file format. Only JPG, JPEG, PNG, and GIF are allowed.", new object()));
                }

                string uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                string filePath = Path.Combine(_uploadPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                uploadedFilePaths.Add(filePath); 
            }

            product.ImagePaths = uploadedFilePaths;
            await _productService.CreateAsyncMultiple(new ProductMultiple
            {
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImagePaths = uploadedFilePaths
            });

            return Ok(new CommonResponse<object>(201, "Products uploaded successfully", new
            {
                product.Name,
                product.Description,
                product.Price,
                ImagePaths = uploadedFilePaths
            }));
        }



    }
}
