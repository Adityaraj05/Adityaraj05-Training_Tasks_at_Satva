using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;
using Task10.Services;
using Task10.Models;

namespace Task10.Controllers
{
    [Route("api/csv")]
    [ApiController]
    public class CsvController : ControllerBase
    {
        private readonly ProductService _productService;

        public CsvController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportProductsToCsv()
        {
            List<Product> products = await _productService.GetAllAsync();
            if (products == null || !products.Any())
            {
                return NotFound("No products found.");
            }

            string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string filePath = Path.Combine(uploadsFolder, "products.csv");

            using var memoryStream = new MemoryStream();
            using var writer = new StreamWriter(memoryStream, Encoding.UTF8);
            using var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture));

            csv.WriteRecords(products);
            writer.Flush();
            byte[] csvBytes = memoryStream.ToArray();
            System.IO.File.WriteAllBytes(filePath, csvBytes);
            return Ok(new { message = "CSV created successfully", filePath = filePath });
        }
    }
}
