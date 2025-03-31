using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;
using Task_9.Models;
using Task_9.Services.Interfaces;

namespace Task_9.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public UserService(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<List<ApplicationUser>> GetAllUsersAsync()
        {
            return _userManager.Users.ToList();
        }

        public async Task<ApplicationUser> GetUserByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                throw new KeyNotFoundException($"User with email {email} not found");
            return user;
        }

        public async Task<bool> UpdateUserRoleAsync(string email, string role)
        {
            var user = await GetUserByEmailAsync(email);

            // Check if the role exists
            if (!await _roleManager.RoleExistsAsync(role))
                throw new ArgumentException($"Role {role} does not exist");

            // Get current roles
            var currentRoles = await _userManager.GetRolesAsync(user);

            // Remove from current roles
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
                throw new InvalidOperationException("Failed to remove current roles");

            // Add to new role
            var addResult = await _userManager.AddToRoleAsync(user, role);
            return addResult.Succeeded;
        }

        public async Task<List<string>> GetAvailableRolesAsync()
        {
            return _roleManager.Roles.Select(r => r.Name).ToList();
        }
    }
}