using System.ComponentModel.DataAnnotations;

namespace Task_8.Models
{
    public class RegisterDto
    {

        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        public string Password { get; set; }
        
        
                
    }
}
