using System;

namespace EmployeeManagement.Exceptions
{
    public class SalaryOutOfRangeException : Exception
    {
        public SalaryOutOfRangeException() : base()
        {
        }

        public SalaryOutOfRangeException(string message) : base(message)
        {
        }

        public SalaryOutOfRangeException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
