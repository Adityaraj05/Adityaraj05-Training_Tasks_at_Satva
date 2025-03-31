using Task_9.Models;

namespace Task_9.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(ApplicationUser user, IList<string> roles);
        string GenerateRefreshToken();
        DateTime GetRefreshTokenExpiration();
        Guid? ValidateAccessToken(string token);
    }
}