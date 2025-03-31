using Task_9.Models;

namespace Task_9.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<ApplicationUser>> GetAllUsersAsync();
        Task<ApplicationUser> GetUserByEmailAsync(string email);
        Task<bool> UpdateUserRoleAsync(string email, string role);
        Task<List<string>> GetAvailableRolesAsync();
    }
}