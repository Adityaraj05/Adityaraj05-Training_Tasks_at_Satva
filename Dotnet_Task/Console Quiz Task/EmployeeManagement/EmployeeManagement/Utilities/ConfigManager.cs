using System;
using System.Configuration;

namespace EmployeeManagement.Utilities
{
    public static class ConfigManager
    {
        public static string? GetSetting(string key)
        {
            string? value = ConfigurationManager.AppSettings[key];
            return value;
        }
    }
}