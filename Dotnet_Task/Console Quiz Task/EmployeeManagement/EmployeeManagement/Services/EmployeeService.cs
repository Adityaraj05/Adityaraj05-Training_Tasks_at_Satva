using System;
using System.Collections.Generic;
using System.Linq;
using EmployeeManagement.Models;
using EmployeeManagement.Extensions;
using EmployeeManagement.Exceptions;
using EmployeeManagement.Utilities;
using EmployeeManagement.Services;

namespace EmployeeManagement.Services
{
    public class EmployeeService
    {
        private List<Employee> _employees;
        private readonly string _dataFilePath;
        private readonly EncryptionService _encryptionService;
        private readonly XmlSerializationService _xmlSerializationService;

        public EmployeeService()
        {
            _dataFilePath = ConfigManager.GetSetting("DataFilePath");
            _encryptionService = new EncryptionService();
            _xmlSerializationService = new XmlSerializationService();

            LoadEmployees();
        }

        private void LoadEmployees()
        {
            try
            {
                _employees = _xmlSerializationService.DeserializeFromXml<List<Employee>>(_dataFilePath);
                if (_employees == null)
                {
                    _employees = new List<Employee>();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading employees: {ex.Message}");
           
                _employees = new List<Employee>();
            }
        }

        private void SaveEmployees()
        {
            _xmlSerializationService.SerializeToXml(_employees, _dataFilePath);
        }

        public void AddEmployee(Employee employee)
        {
            ValidateEmployee(employee);

            // Check for duplicate email
            if (_employees.Any(e => e.Email.Equals(employee.Email, StringComparison.OrdinalIgnoreCase)))
            {
                throw new DuplicateRecordException($"An employee with email '{employee.Email}' already exists.");
            }

            // Encrypt password
            employee.Password = _encryptionService.Encrypt(employee.Password);

            _employees.Add(employee);
            SaveEmployees();
        }

        public List<Employee> GetAllEmployees()
        {
            return _employees.ToList();
        }

        public Employee GetEmployeeById(Guid id)
        {
            return _employees.FirstOrDefault(e => e.Id == id);
        }

        public Employee GetEmployeeByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentNullException(nameof(email));
            }

            return _employees.FirstOrDefault(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }

        public void UpdateEmployee(Employee updatedEmployee)
        {
            var existingEmployee = _employees.FirstOrDefault(e => e.Id == updatedEmployee.Id);
            if (existingEmployee == null)
            {
                throw new ArgumentException($"No employee found with ID: {updatedEmployee.Id}");
            }

            
            if (!existingEmployee.Email.Equals(updatedEmployee.Email, StringComparison.OrdinalIgnoreCase) &&
                _employees.Any(e => e.Id != updatedEmployee.Id && e.Email.Equals(updatedEmployee.Email, StringComparison.OrdinalIgnoreCase)))
            {
                throw new DuplicateRecordException($"An employee with email '{updatedEmployee.Email}' already exists.");
            }

           
            ValidateEmployee(updatedEmployee);

            
            existingEmployee.FirstName = updatedEmployee.FirstName;
            existingEmployee.LastName = updatedEmployee.LastName;
            existingEmployee.Email = updatedEmployee.Email;
            existingEmployee.PhoneNumber = updatedEmployee.PhoneNumber;
            existingEmployee.Salary = updatedEmployee.Salary;

            // Update password if provided
            if (!string.IsNullOrEmpty(updatedEmployee.Password))
            {
                existingEmployee.Password = _encryptionService.Encrypt(updatedEmployee.Password);
            }

            SaveEmployees();
        }

        public void DeleteEmployee(Guid id)
        {
            var employee = _employees.FirstOrDefault(e => e.Id == id);
            if (employee == null)
            {
                throw new ArgumentException($"No employee found with ID: {id}");
            }

            _employees.Remove(employee);
            SaveEmployees();
        }

        public string GetDecryptedPassword(Employee employee)
        {
            if (employee == null)
            {
                throw new ArgumentNullException(nameof(employee));
            }

            return _encryptionService.Decrypt(employee.Password);
        }

        private void ValidateEmployee(Employee employee)
        {
            if (employee == null)
            {
                throw new ArgumentNullException(nameof(employee));
            }

            // Validate required fields
            if (string.IsNullOrWhiteSpace(employee.FirstName))
            {
                throw new ArgumentNullException(nameof(employee.FirstName), "First name is required.");
            }

            if (string.IsNullOrWhiteSpace(employee.LastName))
            {
                throw new ArgumentNullException(nameof(employee.LastName), "Last name is required.");
            }

            if (string.IsNullOrWhiteSpace(employee.Email))
            {
                throw new ArgumentNullException(nameof(employee.Email), "Email is required.");
            }

            if (!employee.Email.IsValidEmail())
            {
                throw new FormatException("Email format is invalid.");
            }

            if (string.IsNullOrWhiteSpace(employee.PhoneNumber))
            {
                throw new ArgumentNullException(nameof(employee.PhoneNumber), "Phone number is required.");
            }

            if (!employee.PhoneNumber.IsValidPhoneNumber())
            {
                throw new FormatException("Phone number should be 10 digits.");
            }

            // Validate salary range
            if (employee.Salary < 20000 || employee.Salary > 100000)
            {
                throw new SalaryOutOfRangeException("Salary must be between 20,000 and 1,00,000.");
            }

            // Validate password only for new employees (when adding)
            if (string.IsNullOrWhiteSpace(employee.Password) && employee.Id == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(employee.Password), "Password is required.");
            }
        }
    }
}
