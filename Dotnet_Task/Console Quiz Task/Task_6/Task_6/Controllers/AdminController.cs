using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Task_6.Data;
using Task_6.Models;
using System;
using System.Collections.Generic;
using System.Data;

namespace Task_6.Controllers
{
    public class AdminController : Controller
    {
        // Index action to check admin authentication
        public IActionResult Index()
        {
            // Check if user is logged in as admin
            if (string.IsNullOrEmpty(TempData["UserName"] as string))
            {
                return RedirectToAction("Login", "Account");
            }
            return View();
        }

        // Display list of all users (excluding admin)
        public IActionResult UserManagement()
        {
            List<User> users = new List<User>();

            try
            {
                using (SqlConnection conn = DatabaseHelper.GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(
                        "SELECT u.Id, u.FirstName, u.LastName, u.Email, r.RoleName, u.IsActive " +
                        "FROM Users u JOIN Roles r ON u.RoleId = r.Id WHERE r.RoleName != 'Admin'", conn))
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                users.Add(new User
                                {
                                    Id = Convert.ToInt32(reader["Id"]),
                                    FirstName = reader["FirstName"].ToString(),
                                    LastName = reader["LastName"].ToString(),
                                    Email = reader["Email"].ToString(),
                                    RoleName = reader["RoleName"].ToString(),
                                    IsActive = Convert.ToBoolean(reader["IsActive"])
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                TempData["ErrorMessage"] = "An error occurred while fetching users.";
            }

            return View(users);
        }

        // GET: Display form to add a new user
        [HttpGet]
        public IActionResult AddUser()
        {
            ViewBag.Roles = GetRoles();
            return View();
        }

        // POST: Add a new user to the database
        [HttpPost]
        public IActionResult AddUser(User model)
        {
            Console.WriteLine("before if AddUser");
            // Validate model state
            if (!ModelState.IsValid)
            {
                ViewBag.Roles = GetRoles();

                // Log validation errors
                foreach (var state in ModelState)
                {
                    foreach (var error in state.Value.Errors)
                    {
                        Console.WriteLine($"Validation Error in {state.Key}: {error.ErrorMessage}");
                    }
                }

                return View(model);
            }


            try
            {
                Console.WriteLine("inside try");
                using (SqlConnection conn = DatabaseHelper.GetConnection())
                {
                    conn.Open();
                    // Check if email already exists
                    using (SqlCommand checkCmd = new SqlCommand(
                        "SELECT COUNT(*) FROM Users WHERE Email = @Email", conn))
                    {
                        checkCmd.Parameters.AddWithValue("@Email", model.Email);
                        int emailCount = Convert.ToInt32(checkCmd.ExecuteScalar());
                        Console.WriteLine("inside connection");
                        if (emailCount > 0)
                        {
                            ModelState.AddModelError("Email", "Email already exists.");
                            ViewBag.Roles = GetRoles();
                            return View(model);
                        }
                    }

                    // Insert new user
                    using (SqlCommand cmd = new SqlCommand(
                        "INSERT INTO Users (FirstName, LastName, Email, PasswordHash, RoleId, IsActive) " +
                        "VALUES (@FirstName, @LastName, @Email, @PasswordHash, @RoleId, 1)", conn))
                    {
                        cmd.Parameters.AddWithValue("@FirstName", model.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", model.LastName);
                        cmd.Parameters.AddWithValue("@Email", model.Email);
                        cmd.Parameters.AddWithValue("@PasswordHash", 
                            SecurityHelper.EncryptPassword(model.Password));
                        cmd.Parameters.AddWithValue("@RoleId", model.RoleId);

                        cmd.ExecuteNonQuery();
                    }
                }

                TempData["SuccessMessage"] = "User added successfully";
                return RedirectToAction("UserManagement");
            }
            catch (Exception ex)
            {
                // Log the exception
                TempData["ErrorMessage"] = "An error occurred while adding the user.";
                ViewBag.Roles = GetRoles();
                return View(model);
            }
        }

        // GET: Edit existing user
        [HttpGet]
        public IActionResult EditUser(int userId)
        {
            User user = null;

            try
            {
                using (SqlConnection conn = DatabaseHelper.GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(
                        "SELECT Id, FirstName, LastName, Email, RoleId FROM Users WHERE Id = @UserId", conn))
                    {
                        cmd.Parameters.AddWithValue("@UserId", userId);
                        
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                user = new User
                                {
                                    Id = Convert.ToInt32(reader["Id"]),
                                    FirstName = reader["FirstName"].ToString(),
                                    LastName = reader["LastName"].ToString(),
                                    Email = reader["Email"].ToString(),
                                    RoleId = Convert.ToInt32(reader["RoleId"])
                                };
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "An error occurred while fetching user details.";
                return RedirectToAction("UserManagement");
            }

            if (user == null)
            {
                TempData["ErrorMessage"] = "User not found.";
                return RedirectToAction("UserManagement");
            }

            ViewBag.Roles = GetRoles();
            return View(user);
        }

        // POST: Update user details
        [HttpPost]
        public IActionResult EditUser(User model)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Roles = GetRoles();
                return View(model);
            }

            try
            {
                using (SqlConnection conn = DatabaseHelper.GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(
                        "UPDATE Users SET FirstName = @FirstName, LastName = @LastName, " +
                        "Email = @Email, RoleId = @RoleId, UpdatedOn = GETDATE() " +
                        "WHERE Id = @UserId", conn))
                    {
                        cmd.Parameters.AddWithValue("@FirstName", model.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", model.LastName);
                        cmd.Parameters.AddWithValue("@Email", model.Email);
                        cmd.Parameters.AddWithValue("@RoleId", model.RoleId);
                        cmd.Parameters.AddWithValue("@UserId", model.Id);

                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected == 0)
                        {
                            TempData["ErrorMessage"] = "User not found or no changes were made.";
                            ViewBag.Roles = GetRoles();
                            return View(model);
                        }
                    }
                }
                TempData["SuccessMessage"] = "User updated successfully";
                return RedirectToAction("UserManagement");
            }
            catch (Exception ex)
            {
                // Log the exception (ex) here
                TempData["ErrorMessage"] = "An error occurred while updating the user: " + ex.Message;
                ViewBag.Roles = GetRoles();
                return View(model);
            }
        }

        // Display list of inactive users
        public IActionResult InactiveUsers()
        {
            List<User> inactiveUsers = new List<User>();

            try
            {
                using (SqlConnection conn = DatabaseHelper.GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(
                        "SELECT u.Id, u.FirstName, u.LastName, u.Email, r.RoleName " +
                        "FROM Users u JOIN Roles r ON u.RoleId = r.Id WHERE u.IsActive = 0", conn))
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                inactiveUsers.Add(new User
                                {
                                    Id = Convert.ToInt32(reader["Id"]),
                                    FirstName = reader["FirstName"].ToString(),
                                    LastName = reader["LastName"].ToString(),
                                    Email = reader["Email"].ToString(),
                                    RoleName = reader["RoleName"].ToString()
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "An error occurred while fetching inactive users.";
            }

            return View(inactiveUsers);
        }

        // Toggle user active/inactive status
        [HttpPost]
        public IActionResult ToggleUserStatus(int userId, bool isActive)
        {

            Console.WriteLine("outside");
            try 
            {
                using (SqlConnection conn = DatabaseHelper.GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand(
                        "UPDATE Users SET IsActive = @IsActive WHERE Id = @UserId", conn))
                    {
                        // Toggle the current status
                   
                        cmd.Parameters.AddWithValue("@IsActive", !isActive);
                        cmd.Parameters.AddWithValue("@UserId", userId);
                        
                        int rowsAffected = cmd.ExecuteNonQuery();
                        
                        if (rowsAffected > 0)
                        {
                            TempData["SuccessMessage"] = isActive 
                                ? "User deactivated successfully" 
                                : "User reactivated successfully";
                        }
                       
                        else 
                        {
                            TempData["ErrorMessage"] = "Failed to update user status";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception 
                TempData["ErrorMessage"] = "An error occurred while updating user status";
            }

            return RedirectToAction("UserManagement");
        }

        // Retrieve list of roles from database
        private List<Role> GetRoles()
        {
            List<Role> roles = new List<Role>();

            try
            {
                using (SqlConnection conn = DatabaseHelper.GetConnection())
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("SELECT * FROM Roles", conn))
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                roles.Add(new Role
                                {
                                    Id = Convert.ToInt32(reader["Id"]),
                                    RoleName = reader["RoleName"].ToString()
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                TempData["ErrorMessage"] = "An error occurred while fetching roles.";
            }

            return roles;
        }
    }
}