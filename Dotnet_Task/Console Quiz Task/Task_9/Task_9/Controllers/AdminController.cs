using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task_9.Models;
using Task_9.Services.Interfaces;

namespace Task_9.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;

        public AdminController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPut("update-role")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateUserRole([FromBody] UpdateRoleRequest model)
        {
            try
            {
                var result = await _userService.UpdateUserRoleAsync(model.Email, model.Role);

                if (result)
                    return Ok(ApiResponse<string>.SuccessResponse("User role updated successfully"));

                return BadRequest(ApiResponse<string>.ErrorResponse("Failed to update user role"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<string>.ErrorResponse(ex.Message));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("An error occurred while updating the user role"));
            }
        }
    }
}
