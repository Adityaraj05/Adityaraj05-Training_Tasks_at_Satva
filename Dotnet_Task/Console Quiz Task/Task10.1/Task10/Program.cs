using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using Task10.Services;
using DinkToPdf;
using DinkToPdf.Contracts;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration.GetSection("MongoDB");
var mongoClient = new MongoClient(config["ConnectionString"]);
var mongoDatabase = mongoClient.GetDatabase(config["DatabaseName"]);

builder.Services.AddSingleton<IMongoDatabase>(mongoDatabase);
builder.Services.AddSingleton<ProductService>();

builder.Services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));


//Add Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Task10 API", Version = "v1" });
});

var app = builder.Build();

// Enable Swagger
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task10 API v1"));

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
