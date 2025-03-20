using System;
using System.Text.RegularExpressions;

namespace EmployeeManagement.Extensions
{
    public static class ValidationExtensions
    {
        public static bool IsValidEmail(this string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            // Simple email validation using regex
            string pattern = @"^[a-zA-Z0-9_%+-][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(email, pattern);
        }

        public static bool IsValidPhoneNumber(this string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
                return false;

            // Remove any non-digit characters
            string digitsOnly = Regex.Replace(phoneNumber, @"\D", "");

            // Check if it's a 10-digit number
            return digitsOnly.Length == 10 && long.TryParse(digitsOnly, out _);
        }
    }
}