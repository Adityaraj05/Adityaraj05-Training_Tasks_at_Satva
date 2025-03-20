using System;
using BankingSystem.Models;
using BankingSystem.Services;
using BankingSystem.Utilities;
using BankingSystem.Exceptions;

namespace BankingSystem
{
    class Program
    {
        private static AccountService _accountService;

        static void Main(string[] args)
        {
            Console.Title = "Bank Account Management System";
            Initialize();
            DisplayMenu();
        }

        static void Initialize()
        {
            try
            {
                _accountService = new AccountService();
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
                ConsoleHelper.WriteColoredLine("=== BANK ACCOUNT MANAGEMENT SYSTEM ===", ConsoleColor.Cyan);
                Console.WriteLine("1. Open New Account");
                Console.WriteLine("2. Deposit Money");
                Console.WriteLine("3. Withdraw Money");
                Console.WriteLine("4. Display Account Details");
                Console.WriteLine("5. Apply Monthly Interest");
                Console.WriteLine("0. Exit");

                ConsoleHelper.WriteColoredLine("\nEnter your choice: ", ConsoleColor.Yellow);
                string choice = Console.ReadLine();

                try
                {
                    switch (choice)
                    {
                        case "1":
                            OpenNewAccount();
                            break;
                        case "2":
                            DepositMoney();
                            break;
                        case "3":
                            WithdrawMoney();
                            break;
                        case "4":
                            DisplayAccountDetails();
                            break;
                        case "5":
                            ApplyMonthlyInterest();
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

        static void OpenNewAccount()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== OPEN NEW ACCOUNT ===", ConsoleColor.Green);

            string holderName = null;
            bool validName = false;

            while (!validName)
            {
                Console.Write("Enter Holder Name: ");
                holderName = Console.ReadLine()?.Trim();

                // Check if name is null or empty
                if (string.IsNullOrEmpty(holderName))
                {
                    ConsoleHelper.WriteErrorLine("Error: Holder name cannot be empty. Please try again.");
                    continue;
                }

                // Check if name contains digits
                if (holderName.Any(char.IsDigit))
                {
                    ConsoleHelper.WriteErrorLine("Error: Holder name cannot contain digits. Please try again.");
                    continue;
                }

                validName = true;
            }

            decimal initialDeposit = 0;
            bool validDeposit = false;

            while (!validDeposit)
            {
                Console.Write("Enter Initial Deposit: ");
                if (decimal.TryParse(Console.ReadLine(), out initialDeposit))
                {
                    validDeposit = true;
                }
                else
                {
                    ConsoleHelper.WriteErrorLine("Invalid amount. Please enter a valid number.");
                }
            }

            try
            {
                _accountService.OpenAccount(holderName, initialDeposit);
            }
            catch (Exception ex)
            {
                ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");

                // If minimum deposit requirement wasn't met, let user try again
                if (ex.Message.Contains("Initial deposit must be at least"))
                {
                    validDeposit = false;
                    while (!validDeposit)
                    {
                        Console.Write("Enter Initial Deposit (minimum 1000): ");
                        if (decimal.TryParse(Console.ReadLine(), out initialDeposit))
                        {
                            try
                            {
                                _accountService.OpenAccount(holderName, initialDeposit);
                                validDeposit = true;
                            }
                            catch (Exception innerEx)
                            {
                                ConsoleHelper.WriteErrorLine($"Error: {innerEx.Message}");
                                if (!innerEx.Message.Contains("Initial deposit must be at least"))
                                {
                                    break; // Exit if different error
                                }
                            }
                        }
                        else
                        {
                            ConsoleHelper.WriteErrorLine("Invalid amount. Please enter a valid number.");
                        }
                    }
                }
            }

            WaitForKeyPress();
        }

        static void DepositMoney()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== DEPOSIT MONEY ===", ConsoleColor.Green);

            Guid accountNumber = Guid.Empty;
            bool validAccountNumber = false;

            while (!validAccountNumber)
            {
                Console.Write("Enter Account Number: ");
                if (Guid.TryParse(Console.ReadLine(), out accountNumber))
                {
                    validAccountNumber = true;
                }
                else
                {
                    ConsoleHelper.WriteErrorLine("Invalid account number. Please try again.");
                }
            }

            decimal amount = 0;
            bool validAmount = false;

            while (!validAmount)
            {
                Console.Write("Enter Amount to Deposit: ");
                if (decimal.TryParse(Console.ReadLine(), out amount))
                {
                    validAmount = true;
                }
                else
                {
                    ConsoleHelper.WriteErrorLine("Invalid amount. Please enter a valid number.");
                }
            }

            try
            {
                _accountService.Deposit(accountNumber, amount);
            }
            catch (Exception ex)
            {
                ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");

                if (ex.Message.Contains("Account not found"))
                {
                    validAccountNumber = false;
                    while (!validAccountNumber)
                    {
                        Console.Write("Enter a valid Account Number: ");
                        if (Guid.TryParse(Console.ReadLine(), out accountNumber))
                        {
                            try
                            {
                                _accountService.Deposit(accountNumber, amount);
                                validAccountNumber = true;
                            }
                            catch (Exception innerEx)
                            {
                                ConsoleHelper.WriteErrorLine($"Error: {innerEx.Message}");
                                if (!innerEx.Message.Contains("Account not found"))
                                {
                                    break; // Exit if different error
                                }
                            }
                        }
                        else
                        {
                            ConsoleHelper.WriteErrorLine("Invalid account number. Please try again.");
                        }
                    }
                }
                else if (ex.Message.Contains("Amount must be greater than 0"))
                {
                    validAmount = false;
                    while (!validAmount)
                    {
                        Console.Write("Enter a positive Amount to Deposit: ");
                        if (decimal.TryParse(Console.ReadLine(), out amount) && amount > 0)
                        {
                            try
                            {
                                _accountService.Deposit(accountNumber, amount);
                                validAmount = true;
                            }
                            catch (Exception innerEx)
                            {
                                ConsoleHelper.WriteErrorLine($"Error: {innerEx.Message}");
                                if (!innerEx.Message.Contains("Amount must be greater than 0"))
                                {
                                    break; // Exit if different error
                                }
                            }
                        }
                        else
                        {
                            ConsoleHelper.WriteErrorLine("Invalid amount. Please enter a positive number.");
                        }
                    }
                }
            }

            WaitForKeyPress();
        }

        static void WithdrawMoney()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== WITHDRAW MONEY ===", ConsoleColor.Green);

            Guid accountNumber = Guid.Empty;
            bool validAccountNumber = false;

            while (!validAccountNumber)
            {
                Console.Write("Enter Account Number: ");
                if (Guid.TryParse(Console.ReadLine(), out accountNumber))
                {
                    validAccountNumber = true;
                }
                else
                {
                    ConsoleHelper.WriteErrorLine("Invalid account number. Please try again.");
                }
            }

            decimal amount = 0;
            bool validAmount = false;

            while (!validAmount)
            {
                Console.Write("Enter Amount to Withdraw: ");
                if (decimal.TryParse(Console.ReadLine(), out amount))
                {
                    validAmount = true;
                }
                else
                {
                    ConsoleHelper.WriteErrorLine("Invalid amount. Please enter a valid number.");
                }
            }

            try
            {
                _accountService.Withdraw(accountNumber, amount);
            }
            catch (Exception ex)
            {
                ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");

                if (ex.Message.Contains("Account not found"))
                {
                    validAccountNumber = false;
                    while (!validAccountNumber)
                    {
                        Console.Write("Enter a valid Account Number: ");
                        if (Guid.TryParse(Console.ReadLine(), out accountNumber))
                        {
                            try
                            {
                                _accountService.Withdraw(accountNumber, amount);
                                validAccountNumber = true;
                            }
                            catch (Exception innerEx)
                            {
                                ConsoleHelper.WriteErrorLine($"Error: {innerEx.Message}");
                                if (!innerEx.Message.Contains("Account not found"))
                                {
                                    break; // Exit if different error
                                }
                            }
                        }
                        else
                        {
                            ConsoleHelper.WriteErrorLine("Invalid account number. Please try again.");
                        }
                    }
                }
                else if (ex.Message.Contains("Amount must be greater than 0"))
                {
                    validAmount = false;
                    while (!validAmount)
                    {
                        Console.Write("Enter a positive Amount to Withdraw: ");
                        if (decimal.TryParse(Console.ReadLine(), out amount) && amount > 0)
                        {
                            try
                            {
                                _accountService.Withdraw(accountNumber, amount);
                                validAmount = true;
                            }
                            catch (Exception innerEx)
                            {
                                ConsoleHelper.WriteErrorLine($"Error: {innerEx.Message}");
                                if (!innerEx.Message.Contains("Amount must be greater than 0"))
                                {
                                    break; // Exit if different error
                                }
                            }
                        }
                        else
                        {
                            ConsoleHelper.WriteErrorLine("Invalid amount. Please enter a positive number.");
                        }
                    }
                }
                else if (ex is InsufficientBalanceException)
                {
                    validAmount = false;
                    while (!validAmount)
                    {
                        Console.Write("Insufficient balance. Enter a smaller amount: ");
                        if (decimal.TryParse(Console.ReadLine(), out amount) && amount > 0)
                        {
                            try
                            {
                                _accountService.Withdraw(accountNumber, amount);
                                validAmount = true;
                            }
                            catch (Exception innerEx)
                            {
                                ConsoleHelper.WriteErrorLine($"Error: {innerEx.Message}");
                                if (!(innerEx is InsufficientBalanceException))
                                {
                                    break; // Exit if different error
                                }
                            }
                        }
                        else
                        {
                            ConsoleHelper.WriteErrorLine("Invalid amount. Please enter a positive number.");
                        }
                    }
                }
            }

            WaitForKeyPress();
        }

        static void DisplayAccountDetails()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== ACCOUNT DETAILS ===", ConsoleColor.Green);

            Guid accountNumber = Guid.Empty;
            bool validAccountNumber = false;

            while (!validAccountNumber)
            {
                Console.Write("Enter Account Number: ");
                if (Guid.TryParse(Console.ReadLine(), out accountNumber))
                {
                    try
                    {
                        _accountService.DisplayAccountDetails(accountNumber);
                        validAccountNumber = true;
                    }
                    catch (Exception ex)
                    {
                        ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");
                        if (!ex.Message.Contains("Account not found"))
                        {
                            break; // Exit if different error
                        }
                    }
                }
                else
                {
                    ConsoleHelper.WriteErrorLine("Invalid account number. Please try again.");
                }
            }

            WaitForKeyPress();
        }

        static void ApplyMonthlyInterest()
        {
            Console.Clear();
            ConsoleHelper.WriteColoredLine("=== APPLY MONTHLY INTEREST ===", ConsoleColor.Green);

            Guid accountNumber = Guid.Empty;
            bool validAccountNumber = false;

            while (!validAccountNumber)
            {
                Console.Write("Enter Account Number: ");
                if (Guid.TryParse(Console.ReadLine(), out accountNumber))
                {
                    try
                    {
                        _accountService.ApplyMonthlyInterest(accountNumber);
                        validAccountNumber = true;
                    }
                    catch (Exception ex)
                    {
                        ConsoleHelper.WriteErrorLine($"Error: {ex.Message}");
                        if (!ex.Message.Contains("Account not found"))
                        {
                            break; // Exit if different error
                        }
                    }
                }
                else
                {
                    ConsoleHelper.WriteErrorLine("Invalid account number. Please try again.");
                }
            }

            WaitForKeyPress();
        }

        static void WaitForKeyPress()
        {
            ConsoleHelper.WriteColoredLine("\nPress any key to continue...", ConsoleColor.Yellow);
            Console.ReadKey();
        }
    }
}