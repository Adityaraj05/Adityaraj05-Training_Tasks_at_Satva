using MongoDB.Driver;
using Task_8.Data;
using Task_8.Helpers;
using Task_8.Models;
using Task_8.Services.Interfaces;

namespace Task_8.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly DatabaseContext _context;
        private readonly ITokenService _tokenService;

        public AuthService(DatabaseContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<ApplicationUser> RegisterAsync(RegisterDto registerDto)
        {
            // Check if user already exists
            var existingUser = await _context.Users
                .Find(u => u.Username == registerDto.Username || u.Email == registerDto.Email)
                .FirstOrDefaultAsync();

            if (existingUser != null)
                throw new Exception("User already exists");

            var user = new ApplicationUser
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = PasswordHasher.HashPassword(registerDto.Password),
                Roles = new List<string> { "User" }
            };

            await _context.Users.InsertOneAsync(user);
            return user;
        }

        public async Task<string> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .Find(u => u.Email == loginDto.email)
                .FirstOrDefaultAsync();

            if (user == null || !PasswordHasher.VerifyPassword(loginDto.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            return _tokenService.GenerateJwtToken(user);
        }
    }

}