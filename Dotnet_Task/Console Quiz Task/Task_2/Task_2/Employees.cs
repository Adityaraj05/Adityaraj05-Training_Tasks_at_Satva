using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace EmployeeManagementSystem
{
    public class Employee
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Designation Designation { get; set; }
        public decimal Salary { get; set; }
    }

    public enum Designation
    {
        Developer,
        QA
    }

    public static class ValidationExtensions
    {
        public static bool IsValidName(this string name)
        {
            return !string.IsNullOrWhiteSpace(name) && name.All(char.IsLetter);
        }

        public static bool IsValidGender(this string gender)
        {
            if (string.IsNullOrWhiteSpace(gender))
            {
                return false;
            }
            return gender == "M" || gender == "F" || gender == "O";
        }

        public static bool IsValidEmail(this string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(email, pattern);
        }

        public static bool IsValidPhone(this string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
            {
                return false;
            }

            return phone.Length == 10 && phone.All(char.IsDigit);
        }

        public static bool IsValidSalary(this decimal salary)
        {
            return salary >= 10000 && salary <= 50000;
        }
    }

    public class EmployeeManager
    {
        private List<Employee> _employees;
        private readonly string _filePath = "employees.json";

        public EmployeeManager()
        {
            _employees = LoadEmployees();
        }

        private List<Employee> LoadEmployees()
        {
            if (!File.Exists(_filePath))
            {
                return new List<Employee>();
            }

            string json = File.ReadAllText(_filePath);
            return string.IsNullOrWhiteSpace(json) ?
                new List<Employee>() :
                JsonSerializer.Deserialize<List<Employee>>(json);
        }

        private void SaveEmployees()
        {
            string json = JsonSerializer.Serialize(_employees, new JsonSerializerOptions
            {
                WriteIndented = true
            });
            File.WriteAllText(_filePath, json);
        }

        private int GetNextId()
        {
            return _employees.Count == 0 ? 1 : _employees.Max(e => e.Id) + 1;
        }

        public void AddEmployee()
        {
            Employee employee = new Employee();
            employee.Id = GetNextId();

            // First Name
            while (true)
            {
                Console.Write("Enter First Name: ");
                string firstName = Console.ReadLine();
                if (firstName.IsValidName())
                {
                    employee.FirstName = firstName;
                    break;
                }
                Console.WriteLine("Invalid First Name! Only alphabets are allowed.");

            }

            // Last Name
            while (true)
            {
                Console.Write("Enter Last Name: ");
                string lastName = Console.ReadLine();
                if (lastName.IsValidName())
                {
                    employee.LastName = lastName;
                    break;
                }
                Console.WriteLine("Invalid Last Name! Only alphabets are allowed.");
            }

            // Gender
            while (true)
            {
                Console.Write("Enter Gender (M/F/O): ");
                string gender = Console.ReadLine().ToUpper();
                if (gender.IsValidGender())
                {
                    employee.Gender = gender;
                    break;
                }
                Console.WriteLine("Gender is required and must be M, F, or O!");
            }

            // Email
            while (true)
            {
                Console.Write("Enter Email Address: ");
                string email = Console.ReadLine();
                if (!email.IsValidEmail())
                {
                    Console.WriteLine("Please enter a valid email address!");
                    continue;
                }

                if (_employees.Any(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase)))
                {
                    Console.WriteLine("This email already exists. Please enter a unique email!");
                    continue;
                }

                employee.Email = email;
                break;
            }

            // Phone Number
            while (true)
            {
                Console.Write("Enter Phone Number: ");
                string phone = Console.ReadLine();
                if (phone.IsValidPhone())
                {
                    if (_employees.Any(e => e.Phone == phone))
                    {
                        Console.WriteLine("This phone number already exists. Please enter a unique phone number!");
                        continue;
                    }
                    employee.Phone = phone;
                    break;
                }
                Console.WriteLine("Phone number is required and must be exactly 10 digits!");
            }

            // Designation
            while (true)
            {
                Console.WriteLine("Select Designation:");
                Console.WriteLine("1. Developer");
                Console.WriteLine("2. QA");
                Console.Write("Enter choice (1/2): ");
                string choice = Console.ReadLine();

                if (choice == "1")
                {
                    employee.Designation = Designation.Developer;
                    break;
                }
                else if (choice == "2")
                {
                    employee.Designation = Designation.QA;
                    break;
                }
                else
                {
                    Console.WriteLine("Invalid choice! Please select 1 for Developer or 2 for QA.");
                }
            }

            // Salary
            while (true)
            {
                Console.Write("Enter Salary (10000-50000): ");
                if (decimal.TryParse(Console.ReadLine(), out decimal salary) && salary.IsValidSalary())
                {
                    employee.Salary = salary;
                    break;
                }
                Console.WriteLine("Salary must be between 10,000 and 50,000!");
            }

            _employees.Add(employee);
            SaveEmployees();
            Console.WriteLine("Employee added successfully!");
        }

        public void UpdateEmployee()
        {
            if (_employees.Count == 0)
            {
                Console.WriteLine("No employees found!");
                return;
            }

            Console.Write("Enter employee email to update: ");
            string email = Console.ReadLine();

            Employee employee = _employees.FirstOrDefault(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            if (employee == null)
            {
                Console.WriteLine($"No employee found with email: {email}");
                return;
            }

            Console.WriteLine($"Updating employee: {employee.FirstName} {employee.LastName}");

            // First Name
            Console.Write($"Enter First Name ({employee.FirstName}): ");
            string firstName = Console.ReadLine();
            if (firstName.IsValidName())
            {
                employee.FirstName = firstName;
            }

            // Last Name
            Console.Write($"Enter Last Name ({employee.LastName}): ");
            string lastName = Console.ReadLine();
            if (lastName.IsValidName())
            {
                employee.LastName = lastName;
            }

            // Gender
            Console.Write($"Enter Gender (M/F/O) ({employee.Gender}): ");
            string gender = Console.ReadLine().ToUpper();
            if (gender.IsValidGender())
            {
                employee.Gender = gender;
            }

            // Email
            Console.Write($"Enter new Email Address ({employee.Email}): ");
            string newEmail = Console.ReadLine();
            if (!string.IsNullOrWhiteSpace(newEmail) && newEmail != employee.Email)
            {
                if (!newEmail.IsValidEmail())
                {
                    Console.WriteLine("Invalid email format! Email not updated.");
                }
                else if (_employees.Any(e => e.Id != employee.Id && e.Email.Equals(newEmail, StringComparison.OrdinalIgnoreCase)))
                {
                    Console.WriteLine("This email already exists! Email not updated.");
                }
                else
                {
                    employee.Email = newEmail;
                }
            }

            // Phone Number
            Console.Write($"Enter Phone Number ({employee.Phone}): ");
            string phone = Console.ReadLine();
            if (!string.IsNullOrWhiteSpace(phone) && phone != employee.Phone)
            {
                if (!phone.IsValidPhone())
                {
                    Console.WriteLine("Invalid phone format! Phone not updated.");
                }
                else if (_employees.Any(e => e.Id != employee.Id && e.Phone == phone))
                {
                    Console.WriteLine("This phone number already exists! Phone not updated.");
                }
                else
                {
                    employee.Phone = phone;
                }
            }

            // Designation
            Console.WriteLine($"Current Designation: {employee.Designation}");
            Console.WriteLine("Select Designation:");
            Console.WriteLine("1. Developer");
            Console.WriteLine("2. QA");
            Console.Write("Enter choice (1/2) or press Enter to skip: ");
            string choice = Console.ReadLine();

            if (choice == "1")
            {
                employee.Designation = Designation.Developer;
            }
            else if (choice == "2")
            {
                employee.Designation = Designation.QA;
            }

            // Salary
            Console.Write($"Enter Salary (10000-50000) ({employee.Salary}): ");
            string salaryInput = Console.ReadLine();
            if (!string.IsNullOrWhiteSpace(salaryInput))
            {
                if (decimal.TryParse(salaryInput, out decimal salary) && salary.IsValidSalary())
                {
                    employee.Salary = salary;
                }
                else
                {
                    Console.WriteLine("Invalid salary range! Salary not updated.");
                }
            }

            SaveEmployees();
            Console.WriteLine("Employee updated successfully!");
        }

        public void DeleteEmployee()
        {
            if (_employees.Count == 0)
            {
                Console.WriteLine("No employees found!");
                return;
            }

            Console.Write("Enter employee email to delete: ");
            string email = Console.ReadLine();

            Employee employee = _employees.FirstOrDefault(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            if (employee == null)
            {
                Console.WriteLine($"No employee found with email: {email}");
                return;
            }

            Console.WriteLine($"Found: {employee.FirstName} {employee.LastName}, {employee.Designation}, ${employee.Salary}");
            Console.Write("Are you sure you want to delete this employee? (y/n): ");
            string confirm = Console.ReadLine().ToLower();

            if (confirm == "y" || confirm == "yes")
            {
                _employees.Remove(employee);
                SaveEmployees();
                Console.WriteLine("Employee deleted successfully!");
            }
            else
            {
                Console.WriteLine("Delete operation cancelled.");
            }
        }

        public void DisplayAllEmployees()
        {
            if (_employees.Count == 0)
            {
                Console.WriteLine("No employees found!");
                return;
            }

            Console.WriteLine("\n--- All Employees ---");
            Console.WriteLine("|{0,-5}|{1,-15}|{2,-15}|{3,-5}|{4,-25}|{5,-12}|{6,-10}|{7,-10}|",
                "ID", "First Name", "Last Name", "Gender", "Email", "Phone", "Role", "Salary");
            Console.WriteLine(new string('-', 100));

            foreach (var employee in _employees)
            {
                Console.WriteLine("|{0,-5}|{1,-15}|{2,-15}|{3,-5}|{4,-25}|{5,-12}|{6,-10}|{7,-10:C}|",
                    employee.Id,
                    employee.FirstName,
                    employee.LastName,
                    employee.Gender,
                    employee.Email,
                    employee.Phone,
                    employee.Designation,
                    employee.Salary);
            }
            Console.WriteLine(new string('-', 100));
        }

        public void FindEmployeeByEmail()
        {
            if (_employees.Count == 0)
            {
                Console.WriteLine("No employees found!");
                return;
            }

            Console.Write("Enter employee email: ");
            string email = Console.ReadLine();

            Employee employee = _employees.FirstOrDefault(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            if (employee == null)
            {
                Console.WriteLine($"No employee found with email: {email}");
                return;
            }

            DisplayEmployeeDetails(employee);
        }
        private void DisplayEmployeeDetails(Employee employee)
        {
            Console.WriteLine("\n--- Employee Details ---");
            Console.WriteLine($"ID: {employee.Id}");
            Console.WriteLine($"Name: {employee.FirstName} {employee.LastName}");
            Console.WriteLine($"Gender: {employee.Gender}");
            Console.WriteLine($"Email: {employee.Email}");
            Console.WriteLine($"Phone: {employee.Phone}");
            Console.WriteLine($"Designation: {employee.Designation}");
            Console.WriteLine($"Salary: ${employee.Salary:N2}");
        }
    }
}

    