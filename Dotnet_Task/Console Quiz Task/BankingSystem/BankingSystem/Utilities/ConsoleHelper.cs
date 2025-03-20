// Utilities/ConsoleHelper.cs
using System;

namespace BankingSystem.Utilities
{
    public static class ConsoleHelper
    {
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

        public static void WriteColoredLine(string message, ConsoleColor color)
        {
            Console.ForegroundColor = color;
            Console.WriteLine(message);
            Console.ResetColor();
        }
    }
}