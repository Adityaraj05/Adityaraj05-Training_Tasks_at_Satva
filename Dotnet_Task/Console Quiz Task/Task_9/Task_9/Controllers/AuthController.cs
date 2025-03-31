using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Task_9.Models;
using Task_9.Services.Interfaces;

namespace Task_9.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] RegisterRequest model)
        {
            var response = await _authService.RegisterAsync(model, IpAddress());
            SetRefreshTokenCookie(response.RefreshToken);

            return Ok(ApiResponse<AuthResponse>.SuccessResponse("User registered successfully", response));
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest model)
        {
            var response = await _authService.LoginAsync(model, IpAddress());
            SetRefreshTokenCookie(response.RefreshToken);

            return Ok(ApiResponse<AuthResponse>.SuccessResponse("User logged in successfully", response));
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest(ApiResponse<AuthResponse>.ErrorResponse("Refresh token is missing"));
            }

            var response = await _authService.RefreshTokenAsync(refreshToken, IpAddress());
            SetRefreshTokenCookie(response.RefreshToken);

            return Ok(ApiResponse<AuthResponse>.SuccessResponse("Token refreshed successfully", response));
        }

        [Authorize]
        [HttpPost("revoke-token")]
        public async Task<ActionResult<ApiResponse<string>>> RevokeToken([FromBody] RefreshTokenRequest model)
        {
            var token = model.Token ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Token is required"));
            }

            await _authService.RevokeTokenAsync(token, IpAddress());

            return Ok(ApiResponse<string>.SuccessResponse("Token revoked successfully"));
        }

        // Helper methods
        private void SetRefreshTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.Strict,
                Secure = true // Set to true in production
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        private string IpAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString() ?? "Unknown";
        }
    }
}
