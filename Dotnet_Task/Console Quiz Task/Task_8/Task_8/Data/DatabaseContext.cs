using MongoDB.Driver;
using Task_8.Configuration;
using Task_8.Models;

namespace Task_8.Data
{
    public class DatabaseContext
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<ApplicationUser> _users;

        public DatabaseContext(MongoDbSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            _database = client.GetDatabase(settings.DatabaseName);
            _users = _database.GetCollection<ApplicationUser>(settings.UsersCollectionName);
        }

        public IMongoCollection<ApplicationUser> Users => _users;
    }
}