using System;

namespace EmployeeManagement.Utilities
{
    public static class ConsoleHelper
    {
        public static void WriteColoredLine(string message, ConsoleColor color)
        {
            ConsoleColor originalColor = Console.ForegroundColor;
            Console.ForegroundColor = color;
            Console.WriteLine(message);
            Console.ForegroundColor = originalColor;
        }

        public static void WriteSuccessLine(string message)
        {
            WriteColoredLine(message, ConsoleColor.Green);
        }

        public static void WriteErrorLine(string message)
        {
            WriteColoredLine(message, ConsoleColor.Red);
        }

        public static void WriteInfoLine(string message)
        {
            WriteColoredLine(message, ConsoleColor.Cyan);
        }

        public static void WriteWarningLine(string message)
        {
            WriteColoredLine(message, ConsoleColor.Yellow);
        }
    }
}