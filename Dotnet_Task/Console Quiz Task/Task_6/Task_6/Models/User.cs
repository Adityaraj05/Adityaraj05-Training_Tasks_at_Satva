using System.ComponentModel.DataAnnotations;

namespace Task_6.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "First Name is required")]
        [MinLength(3, ErrorMessage = "First Name must be at least 3 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        [MinLength(3, ErrorMessage = "Last Name must be at least 3 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public int RoleId { get; set; }
        public string? RoleName { get; set; }
        public bool IsActive { get; set; }
    }
}