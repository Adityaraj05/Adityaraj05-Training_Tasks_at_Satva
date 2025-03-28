using Task_8.Models;

namespace Task_8.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApplicationUser> RegisterAsync(RegisterDto registerDto);
        Task<string> LoginAsync(LoginDto loginDto);
    }

}