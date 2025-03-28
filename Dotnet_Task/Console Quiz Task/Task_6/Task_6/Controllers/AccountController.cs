using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Task_6.Data;
using Task_6.Models;

namespace Task_6.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (!DatabaseHelper.ValidateEmail(model.Email))
            {
                ModelState.AddModelError("Email", "Email already exists");
                return View(model);
            }

            using (SqlConnection conn = DatabaseHelper.GetConnection())
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId, IsActive) " +
                    "VALUES (@FirstName, @LastName, @Email, @PasswordHash, " +
                    "(SELECT Id FROM Roles WHERE RoleName = 'User'), 1)", conn))
                {
                    cmd.Parameters.AddWithValue("@FirstName", model.FirstName);
                    cmd.Parameters.AddWithValue("@LastName", model.LastName);
                    cmd.Parameters.AddWithValue("@Email", model.Email);
                    cmd.Parameters.AddWithValue("@PasswordHash",
                        SecurityHelper.EncryptPassword(model.Password));

                    cmd.ExecuteNonQuery();
                }
            }

            TempData["SuccessMessage"] = "Registration Successful";
            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            using (SqlConnection conn = DatabaseHelper.GetConnection())
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(

                   "SELECT u.Id, u.FirstName, u.PasswordHash, r.RoleName, u.IsActive " +
"FROM Users u JOIN Roles r ON u.RoleId = r.Id WHERE u.Email = @Email", conn))
                {
                    cmd.Parameters.AddWithValue("@Email", model.Email);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            bool isActive = Convert.ToBoolean(reader["IsActive"]);
                            if (!isActive)
                            {
                                ModelState.AddModelError("", "Account is inactive");
                                return View(model);
                            }

                            string storedPassword = reader["PasswordHash"].ToString();
                            try
                            {
                                string decryptedPassword = SecurityHelper.DecryptPassword(storedPassword);
                               
                                if (decryptedPassword == model.Password)
                                {
                                    string roleName = reader["RoleName"].ToString();
                                    TempData["UserName"] = reader["FirstName"].ToString();

                                    if (roleName == "Admin")
                                    {
                                        return RedirectToAction("Index", "Admin");
                                    }
                                    else
                                    {
                                        return RedirectToAction("Index", "User");
                                    }
                                }
                                else
                                {
                                    ModelState.AddModelError("", "Invalid email or password");
                                }
                            }
                            catch
                            {
                                ModelState.AddModelError("", "Authentication error");
                            }
                        }
                        else
                        {
                            ModelState.AddModelError("", "Invalid email or password");
                        }
                    }
                }
            }

            return View(model);
        }
    }
}