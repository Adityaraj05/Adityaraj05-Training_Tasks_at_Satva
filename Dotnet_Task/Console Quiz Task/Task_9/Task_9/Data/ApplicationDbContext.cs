using AspNetCore.Identity.MongoDbCore.Extensions;
using AspNetCore.Identity.MongoDbCore.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using System;
using Task_9.Models;

namespace Task_9.Data
{
    public class ApplicationDbContext
    {
        private readonly IMongoDatabase _database;

        public ApplicationDbContext(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<ApplicationUser> Users =>
            _database.GetCollection<ApplicationUser>("Users");

        public IMongoCollection<ApplicationRole> Roles =>
            _database.GetCollection<ApplicationRole>("Roles");
    }

    public static class MongoDbIdentityConfigurationExtensions
    {
        public static void ConfigureMongoDbIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            // Register MongoDB serializers
            BsonSerializer.RegisterSerializer(new GuidSerializer(MongoDB.Bson.BsonType.String));
            BsonSerializer.RegisterSerializer(new DateTimeSerializer(MongoDB.Bson.BsonType.String));

            // Configure Identity with MongoDB
            var mongoDbSettings = configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();

            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddMongoDbStores<ApplicationUser, ApplicationRole, Guid>(
                    mongoDbSettings.ConnectionString,
                    mongoDbSettings.DatabaseName
                )
                .AddDefaultTokenProviders();

            // Configure Identity options
            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 6;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // User settings
                options.User.RequireUniqueEmail = true;
            });
        }
    }
}