using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using Task10.Services;

[Route("api/pdf")]
[ApiController]
public class PdfController : ControllerBase
{
    private readonly IConverter _converter;
    private readonly ProductService _productService;

    public PdfController(IConverter converter, ProductService productService)
    {
        _converter = converter;
        _productService = productService;
    }

    [HttpGet("generate-pdf")]
    public async Task<IActionResult> GeneratePdf()
    {
        string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }
        List<Product> products = await _productService.GetAllAsync();
        string filePath = Path.Combine(uploadsFolder, "sample.pdf");

        string htmlContent = $@"
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; text-align: center; }}
        h1 {{ color: blue; }}
        p {{ font-size: 16px; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
        th, td {{ border: 1px solid black; padding: 8px; text-align: left; }}
        th {{ background-color: #f2f2f2; }}
    </style>
</head>
<body>
    <h1>PDF Generation in ASP.NET Core</h1>
    <p>This is a sample PDF generated using DinkToPdf.</p>
    
    <table>
        <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>ImagePath</th>
        </tr>";

        foreach (var product in products)
        {
            htmlContent += $@"
        <tr>
            <td>{product.Name}</td>
            <td>{product.Price}</td>
            <td>{product.Description}</td>
<td>{product.ImagePath}</td>
        </tr>";
        }

        htmlContent += @"
    </table>
</body>
</html>";


        var doc = new HtmlToPdfDocument()
        {
            GlobalSettings = new GlobalSettings()
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4
            },
            Objects = { new ObjectSettings() { HtmlContent = htmlContent } }
        };

        byte[] pdf = _converter.Convert(doc);
        System.IO.File.WriteAllBytes(filePath, pdf); 
        return Ok(new { message = "PDF created successfully", filePath = filePath });
    }
}
