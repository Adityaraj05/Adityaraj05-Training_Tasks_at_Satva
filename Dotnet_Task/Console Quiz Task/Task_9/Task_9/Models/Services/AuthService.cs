using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Task_9.Models;
using Task_9.Services.Interfaces;

namespace Task_9.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly ITokenService _tokenService;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest model, string ipAddress)
        {
            // Check if email exists
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
                throw new ArgumentException($"Email '{model.Email}' is already registered");

            // Create new user
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                throw new ArgumentException(string.Join(", ", result.Errors.Select(e => e.Description)));

            // By default, assign the User role
            await _userManager.AddToRoleAsync(user, "User");

            return new AuthResponse
            {
                Id = user.Id.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Roles = new List<string> { "User" }
            };
        }


        public async Task<AuthResponse> LoginAsync(LoginRequest model, string ipAddress)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                throw new ArgumentException("Invalid email or password");

            // Generate JWT Access Token
            var roles = await _userManager.GetRolesAsync(user);
            var jwtToken = _tokenService.GenerateAccessToken(user, roles);

            // Check for an existing active refresh token
            var existingToken = user.RefreshTokens.FirstOrDefault(t => t.IsActive);
            RefreshToken refreshToken;

            if (existingToken == null)
            {
                refreshToken = CreateRefreshToken(ipAddress);
                user.RefreshTokens.Add(refreshToken);
            }
            else
            {
                refreshToken = existingToken;
            }

            // Remove old refresh tokens
            RemoveOldRefreshTokens(user);
            await _userManager.UpdateAsync(user);

            // Return AuthResponse including Refresh Token
            return new AuthResponse
            {
                Id = user.Id.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Roles = roles.ToList(),
                AccessToken = jwtToken,
                RefreshToken = refreshToken.Token // Ensure refresh token is included in the response
            };
        }



        public async Task<AuthResponse> RefreshTokenAsync(string token, string ipAddress)
        {
            var user = GetUserByRefreshToken(token);
            if (user == null) throw new ArgumentException("Invalid token");

            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive)
                throw new ArgumentException("Invalid token");

            // Replace old refresh token with a new one
            var newRefreshToken = CreateRefreshToken(ipAddress);
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReplacedByToken = newRefreshToken.Token;

            // Add new refresh token
            user.RefreshTokens.Add(newRefreshToken);

            // Remove old refresh tokens
            RemoveOldRefreshTokens(user);

            // Update user
            await _userManager.UpdateAsync(user);

            // Generate new jwt token
            var roles = await _userManager.GetRolesAsync(user);
            var jwtToken = _tokenService.GenerateAccessToken(user, roles);

            return new AuthResponse
            {
                Id = user.Id.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Roles = roles.ToList(),
                AccessToken = jwtToken,
                RefreshToken = newRefreshToken.Token
            };
        }

        public async Task RevokeTokenAsync(string token, string ipAddress)
        {
            var user = GetUserByRefreshToken(token);

            if (user == null) throw new ArgumentException("Invalid token");

            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive)
                throw new ArgumentException("Invalid token");

            // Revoke token
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReasonRevoked = "Revoked without replacement";

            await _userManager.UpdateAsync(user);
        }

        public async Task EnsureAdminCreatedAsync()
        {
            string[] roleNames = { "Admin", "Manager", "User" };
            foreach (var roleName in roleNames)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    await _roleManager.CreateAsync(new ApplicationRole(roleName));
                }
            }

            var adminEmail = "admin@example.com";
            var adminUser = await _userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "System",
                    LastName = "Admin",
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(adminUser, "Admin@123");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
            else if (!await _userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                await _userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }


        // Helper methods
        private RefreshToken CreateRefreshToken(string ipAddress)
        {
            return new RefreshToken
            {
                Token = _tokenService.GenerateRefreshToken(),
                Expires = _tokenService.GetRefreshTokenExpiration(),
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };
        }

        private void RemoveOldRefreshTokens(ApplicationUser user)
        {
            // Keep only active refresh tokens and tokens that are revoked but not too old
            user.RefreshTokens = user.RefreshTokens
                .Where(x => x.IsActive || (x.Revoked != null && DateTime.UtcNow.Subtract(x.Revoked.Value).TotalDays <= 2))
                .ToList();
        }

        private ApplicationUser GetUserByRefreshToken(string token)
        {
            return _userManager.Users.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));
        }
    }
}