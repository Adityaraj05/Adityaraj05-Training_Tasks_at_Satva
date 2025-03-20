using System;
using System.Collections.Generic;
using System.Linq;
using EmployeeManagement.Models;
using EmployeeManagement.Services;
using EmployeeManagement.Utilities;
using EmployeeManagement.Exceptions;
using EmployeeManagement.Extensions;

namespace SecureEmployeeManagement
{
    class Program
    {
        private static EmployeeService _employeeService;

        static void Main(string[] args)
        {
            Console.Title = "Secure Employee Management System";
            Initialize();
            DisplayMenu();
        }

        static void Initialize()
        {
            try
            {
                _employeeService = new EmployeeService();
                ConsoleHelper.WriteSuccessLine("System initialized successfully!");
            }
            catch (Exception ex)
            {
                ConsoleHelper.WriteErrorLine($"Initialization Error: {ex.Message}");
                Environment.Exit(1);
            }
        }

        static void DisplayMenu()
        {
            bool exit = false;
            while (!exit)
            {
                Console.Clear();
                ConsoleHelper.WriteColoredLine("=== SECURE EMPLOYEE MANAGEMENT SYSTEM ===", ConsoleColor.Cyan);
                Console.WriteLine("1. Add New Employee");
                Console.WriteLine("2. View All Employees");
                Console.WriteLine("3. View Employee By ID");
                Console.WriteLine("4. View Employee By Email");
                Console.WriteLine("5. Update Employee");
                Console.WriteLine("6. Delete Employee");
                Console.WriteLine("0. Exit");

                ConsoleHelper.WriteColoredLine("\nEnter your choice: ", ConsoleColor.Yellow);
                string choice = Console.ReadLine();

                try
                {
                    switch (choice)
                    {
                        case "1":
                            AddNewEmployee();
                            break;
                        case "2":
                            ViewAllEmployees();
                            break;
                        case "3":
                            ViewEmployeeById();
                            break;
                        case "4":
                            ViewEmployeeByEmail();
                            break;
                        case "5":
                            UpdateEmployee();
                            break;
                        case "6":
                            DeleteEmployee();
                            break;
                        case "0":
                            exit = true;
                            ConsoleHelper.WriteInfoLine("Exiting system. Goodbye!");
                            break;
                        default:
                            ConsoleHelper.WriteErrorLine("Invalid choice. Please try again.");
                            WaitForKeyPress();
                            break;
                    }
                }
                catch (Exception ex)
                {
                    ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");
                    WaitForKeyPress();
                }
            }
        }

        static void AddNewEmployee()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== ADD NEW EMPLOYEE ===", ConsoleColor.Green);

            try
            {
                Employee employee = new Employee();

                // Validate First Name
                while (true)
                {
                    Console.Write("First Name: ");
                    employee.FirstName = Console.ReadLine()?.Trim();
                    if (string.IsNullOrWhiteSpace(employee.FirstName) || !employee.FirstName.All(char.IsLetter))
                    {
                        ConsoleHelper.WriteErrorLine("First name is required and should contain only letters.");
                    }
                    else
                    {
                        break;
                    }
                }

                // Validate Last Name
                while (true)
                {
                    Console.Write("Last Name: ");
                    employee.LastName = Console.ReadLine()?.Trim();
                    if (string.IsNullOrWhiteSpace(employee.LastName) || !employee.LastName.All(char.IsLetter))
                    {
                        ConsoleHelper.WriteErrorLine("Last name is required and should contain only letters.");
                    }
                    else
                    {
                        break;
                    }
                }

                // Validate Email
                while (true)
                {
                    Console.Write("Email: ");
                    employee.Email = Console.ReadLine()?.Trim();
                    if (string.IsNullOrWhiteSpace(employee.Email) || !employee.Email.IsValidEmail())
                    {
                        ConsoleHelper.WriteErrorLine("A valid email is required.");
                    }
                    else
                    {
                        break;
                    }
                }

                // Validate Phone Number
                while (true)
                {
                    Console.Write("Phone Number: ");
                    employee.PhoneNumber = Console.ReadLine()?.Trim();

                    if (!employee.PhoneNumber.IsValidPhoneNumber())
                    {
                        ConsoleHelper.WriteErrorLine("Invalid phone number. Please enter a 10-digit number without spaces or special characters.");
                    }
                    else
                    {
                        break;
                    }
                }

                // Validate Salary
                while (true)
                {
                    Console.Write("Salary: ");
                    string salaryInput = Console.ReadLine()?.Trim();
                    if (decimal.TryParse(salaryInput, out decimal salary))
                    {
                        employee.Salary = salary;
                        break;
                    }
                    else
                    {
                        ConsoleHelper.WriteErrorLine("Invalid salary format.");
                    }
                }

                // Validate Password
                while (true)
                {
                    Console.Write("Password: ");
                    employee.Password = Console.ReadLine()?.Trim();
                    if (string.IsNullOrWhiteSpace(employee.Password))
                    {
                        ConsoleHelper.WriteErrorLine("Password is required.");
                    }
                    else
                    {
                        break;
                    }
                }

                _employeeService.AddEmployee(employee);
                ConsoleHelper.WriteSuccessLine("Employee added successfully!");
            }
            catch (Exception ex)
            {
                ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");
            }

            WaitForKeyPress();
        }

        static void ViewAllEmployees()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== ALL EMPLOYEES ===", ConsoleColor.Green);

            var employees = _employeeService.GetAllEmployees();

            if (employees.Count == 0)
            {
                ConsoleHelper.WriteInfoLine("No employees found.");
            }
            else
            {
                DisplayEmployeesList(employees);
            }

            WaitForKeyPress();
        }

        static void ViewEmployeeById()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== VIEW EMPLOYEE BY ID ===", ConsoleColor.Green);

            Console.Write("Enter Employee ID: ");
            string idString = Console.ReadLine();

            try
            {
                if (Guid.TryParse(idString, out Guid id))
                {
                    var employee = _employeeService.GetEmployeeById(id);
                    if (employee != null)
                    {
                        DisplayEmployeeDetails(employee);
                    }
                    else
                    {
                        ConsoleHelper.WriteInfoLine($"No employee found with ID: {idString}");
                    }
                }
                else
                {
                    ConsoleHelper.WriteErrorLine("Invalid ID format. Please enter a valid GUID.");
                }
            }
            catch (Exception ex)
            {
                ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");
            }

            WaitForKeyPress();
        }

        static void ViewEmployeeByEmail()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== VIEW EMPLOYEE BY EMAIL ===", ConsoleColor.Green);

            Console.Write("Enter Employee Email: ");
            string email = Console.ReadLine();

            try
            {
                var employee = _employeeService.GetEmployeeByEmail(email);
                if (employee != null)
                {
                    DisplayEmployeeDetails(employee);
                }
                else
                {
                    ConsoleHelper.WriteInfoLine($"No employee found with email: {email}");
                }
            }
            catch (Exception ex)
            {
                ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");
            }

            WaitForKeyPress();
        }

        static void UpdateEmployee()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== UPDATE EMPLOYEE ===", ConsoleColor.Green);

            Console.Write("Enter Employee ID or Email: ");
            string identifier = Console.ReadLine()?.Trim();

            try
            {
                Employee? employee = null;

                if (Guid.TryParse(identifier, out Guid id))
                {
                    employee = _employeeService.GetEmployeeById(id);
                }
                else
                {
                    employee = _employeeService.GetEmployeeByEmail(identifier);
                }

                if (employee == null)
                {
                    ConsoleHelper.WriteInfoLine("No employee found with that ID or Email.");
                    WaitForKeyPress();
                    return;
                }

                ConsoleHelper.WriteInfoLine("Current Employee Details:");
                DisplayEmployeeDetails(employee);
                Console.WriteLine();

                Employee updatedEmployee = new Employee
                {
                    Id = employee.Id
                };

                Console.Write($"First Name ({employee.FirstName}): ");
                string input = Console.ReadLine()?.Trim();
                updatedEmployee.FirstName = string.IsNullOrWhiteSpace(input) ? employee.FirstName : input;

                Console.Write($"Last Name ({employee.LastName}): ");
                input = Console.ReadLine()?.Trim();
                updatedEmployee.LastName = string.IsNullOrWhiteSpace(input) ? employee.LastName : input;

                Console.Write($"Email ({employee.Email}): ");
                input = Console.ReadLine()?.Trim();
                updatedEmployee.Email = string.IsNullOrWhiteSpace(input) ? employee.Email : input;

                Console.Write($"Phone Number ({employee.PhoneNumber}): ");
                input = Console.ReadLine()?.Trim();
                updatedEmployee.PhoneNumber = string.IsNullOrWhiteSpace(input) ? employee.PhoneNumber : input;

                Console.Write($"Salary ({employee.Salary}): ");
                input = Console.ReadLine()?.Trim();
                updatedEmployee.Salary = string.IsNullOrWhiteSpace(input) ? employee.Salary : decimal.Parse(input);

                Console.Write("New Password (leave blank to keep current): ");
                input = Console.ReadLine()?.Trim();
                updatedEmployee.Password = string.IsNullOrWhiteSpace(input) ? null : input;

                _employeeService.UpdateEmployee(updatedEmployee);
                ConsoleHelper.WriteSuccessLine("Employee updated successfully!");
            }
            catch (Exception ex)
            {
                ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");
            }

            WaitForKeyPress();
        }

        static void DeleteEmployee()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== DELETE EMPLOYEE ===", ConsoleColor.Red);

            Console.Write("Enter Employee Email: ");
            string email = Console.ReadLine()?.Trim(); // Trim spaces

            try
            {
                if (string.IsNullOrWhiteSpace(email))
                {
                    ConsoleHelper.WriteErrorLine("Email cannot be empty.");
                    WaitForKeyPress();
                    return;
                }

                var employee = _employeeService.GetEmployeeByEmail(email);
                if (employee != null)
                {
                    ConsoleHelper.WriteInfoLine("Employee to be deleted:");
                    DisplayEmployeeDetails(employee);

                    Console.Write("\nAre you sure you want to delete this employee? (y/n): ");
                    if (Console.ReadLine()?.Trim().ToLower() == "y") // Trim spaces
                    {
                        _employeeService.DeleteEmployee(employee.Id); // Delete by ID internally
                        ConsoleHelper.WriteSuccessLine("Employee deleted successfully!");
                    }
                    else
                    {
                        ConsoleHelper.WriteInfoLine("Deletion cancelled.");
                    }
                }
                else
                {
                    ConsoleHelper.WriteInfoLine($"No employee found with email: {email}");
                }
            }
            catch (Exception ex)
            {
                ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");
            }

            WaitForKeyPress();
        }

        static void DisplayEmployeesList(List<Employee> employees)
        {
            Console.WriteLine($"\n{"ID",-36} | {"Name",-30} | {"Email",-30} | {"Phone",-15} | {"Salary",-10} | {"Password",-20}");
            Console.WriteLine(new string('-', 150));

            foreach (var emp in employees)
            {
                string decryptedPassword = _employeeService.GetDecryptedPassword(emp);
                Console.WriteLine($"{emp.Id,-36} | {emp.FirstName + " " + emp.LastName,-30} | {emp.Email,-30} | {emp.PhoneNumber,-15} | {emp.Salary,-10:C} | {decryptedPassword,-20}");
            }

            Console.WriteLine($"\nTotal Employees: {employees.Count}");
        }

        static void DisplayEmployeeDetails(Employee employee)
        {
            string decryptedPassword = _employeeService.GetDecryptedPassword(employee);

            Console.WriteLine($"ID: {employee.Id}");
            Console.WriteLine($"Name: {employee.FirstName} {employee.LastName}");
            Console.WriteLine($"Email: {employee.Email}");
            Console.WriteLine($"Phone: {employee.PhoneNumber}");
            Console.WriteLine($"Salary: {employee.Salary:C}");
            Console.WriteLine($"Password: {decryptedPassword}");
        }

        static void WaitForKeyPress()
        {
            ConsoleHelper.WriteColoredLine("\nPress any key to continue...", ConsoleColor.Yellow);
            Console.ReadKey();
        }
    }
}
