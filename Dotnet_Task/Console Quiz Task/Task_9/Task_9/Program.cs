using System.Text.Json.Serialization;
using Task_9.Data;
using Task_9.Extensions;
using Task_9.Helpers;
using Task_9.Services.Interfaces;
using DataAccessLayer.Context;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using DataAccessLayer.Interfaces;
using DataAccessLayer.Repositories;
using AspNetCore.Identity.MongoDbCore.Infrastructure;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Explicitly use the MongoDbSettings from the correct namespace
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings").Get<Task_9.Data.MongoDbSettings>();

var mongoClient = new MongoClient(mongoSettings.ConnectionString);
var mongoDatabase = mongoClient.GetDatabase(mongoSettings.DatabaseName);

// Register MongoDB services
builder.Services.AddSingleton<IMongoDatabase>(mongoDatabase);
builder.Services.AddSingleton<ProductDbContext>(sp =>
    new ProductDbContext(mongoDatabase, mongoSettings.DatabaseName));

// Register IProductRepository with its implementation
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Configure MongoDB Identity
builder.Services.ConfigureMongoDbIdentity(builder.Configuration);

// Configure JWT
builder.Services.ConfigureJwt(builder.Configuration);

// Configure Additional Services
builder.Services.ConfigureServices();

// Configure Swagger
builder.Services.ConfigureSwagger();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task_9 API v1"));
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Use custom JWT middleware (optional)
app.UseMiddleware<JwtMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure that admin user is created
using (var scope = app.Services.CreateScope())
{
    var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
    await authService.EnsureAdminCreatedAsync();
}

app.Run();
