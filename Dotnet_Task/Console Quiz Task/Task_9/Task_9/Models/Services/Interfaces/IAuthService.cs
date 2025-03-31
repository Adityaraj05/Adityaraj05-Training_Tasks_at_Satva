using Task_9.Models;

namespace Task_9.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest model, string origin);
        Task<AuthResponse> LoginAsync(LoginRequest model, string ipAddress);
        Task<AuthResponse> RefreshTokenAsync(string token, string ipAddress);
        Task RevokeTokenAsync(string token, string ipAddress);
        Task EnsureAdminCreatedAsync();
    }
}