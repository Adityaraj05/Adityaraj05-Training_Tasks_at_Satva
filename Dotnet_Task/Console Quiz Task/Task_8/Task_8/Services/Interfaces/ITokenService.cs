using Task_8.Models;

namespace Task_8.Services.Interfaces
{

    public interface ITokenService
    {
        string GenerateJwtToken(ApplicationUser user);
    }
}
