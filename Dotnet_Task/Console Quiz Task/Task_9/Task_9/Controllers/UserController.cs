using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Task_9.Models;
using Task_9.Services.Interfaces;

namespace Task_9.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ApplicationUser>>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(ApiResponse<IEnumerable<ApplicationUser>>.SuccessResponse("Users retrieved successfully", users));
        }

        [HttpGet("by-email/{email}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<ApiResponse<ApplicationUser>>> GetUserByEmail(string email)
        {
            try
            {
                var user = await _userService.GetUserByEmailAsync(email);
                return Ok(ApiResponse<ApplicationUser>.SuccessResponse("User retrieved successfully", user));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<ApplicationUser>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<ApplicationUser>.ErrorResponse("An error occurred", new List<string> { ex.Message }));
            }
        }

        [HttpGet("profile")]
        public async Task<ActionResult<ApiResponse<ApplicationUser>>> GetProfile()
        {
            var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized(ApiResponse<ApplicationUser>.ErrorResponse("Unauthorized access"));

            try
            {
                var user = await _userService.GetUserByEmailAsync(email);
                return Ok(ApiResponse<ApplicationUser>.SuccessResponse("User profile retrieved successfully", user));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<ApplicationUser>.ErrorResponse("An error occurred", new List<string> { ex.Message }));
            }
        }

        [HttpGet("roles")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<List<string>>>> GetAvailableRoles()
        {
            var roles = await _userService.GetAvailableRolesAsync();
            return Ok(ApiResponse<List<string>>.SuccessResponse("Available roles retrieved successfully", roles));
        }
    }
}
