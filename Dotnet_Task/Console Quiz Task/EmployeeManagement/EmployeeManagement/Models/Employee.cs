using System;
using System.Xml.Serialization;

namespace EmployeeManagement.Models
{
    [Serializable]
    public class Employee
    {
        [XmlElement("Id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [XmlElement("FirstName")]
        public string FirstName { get; set; }

        [XmlElement("LastName")]
        public string LastName { get; set; }

        [XmlElement("Email")]
        public string Email { get; set; }

        [XmlElement("PhoneNumber")]
        public string PhoneNumber { get; set; }

        [XmlElement("Salary")]
        public decimal Salary { get; set; }

        [XmlElement("Password")]
        public string Password { get; set; }
    }
}