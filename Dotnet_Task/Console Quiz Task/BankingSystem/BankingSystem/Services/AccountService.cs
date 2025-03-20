using System;
using System.Collections.Generic;
using System.Linq;
using BankingSystem.Models;
using BankingSystem.Exceptions;
using BankingSystem.Utilities;
using BankingSystem.Services;

namespace BankingSystem.Services
{
    public class AccountService
    {
        private List<Account> _accounts;
        private readonly string _accountsFilePath;
        private readonly XmlSerializationService _xmlSerializationService;

        public AccountService()
        {
            _accountsFilePath = ConfigManager.GetSetting("AccountsFilePath");
            _xmlSerializationService = new XmlSerializationService();
            LoadAccounts();
        }

        private void LoadAccounts()
        {
            try
            {
                _accounts = _xmlSerializationService.DeserializeFromXml<List<Account>>(_accountsFilePath);
                if (_accounts == null)
                {
                    _accounts = new List<Account>();
                }
            }
            catch (Exception)
            {
                _accounts = new List<Account>();
            }
        }

        private void SaveAccounts()
        {
            _xmlSerializationService.SerializeToXml(_accounts, _accountsFilePath);
        }

        public void OpenAccount(string holderName, decimal initialDeposit)
        {
            // Enhanced validation for holder name
            if (string.IsNullOrWhiteSpace(holderName))
            {
                throw new ArgumentNullException(nameof(holderName), "Holder name is required.");
            }

            if (holderName.Any(char.IsDigit))
            {
                throw new ArgumentException("Holder name cannot contain digits.", nameof(holderName));
            }

            if (holderName.Length < 2)
            {
                throw new ArgumentException("Holder name must be at least 2 characters long.", nameof(holderName));
            }

            // Enhanced validation for initial deposit
            if (initialDeposit < 0)
            {
                throw new ArgumentException("Initial deposit cannot be negative.", nameof(initialDeposit));
            }

            if (initialDeposit < 1000)
            {
                throw new InvalidOperationException("Initial deposit must be at least 1000.");
            }

            var account = new Account
            {
                HolderName = holderName,
                Balance = initialDeposit
            };

            _accounts.Add(account);
            SaveAccounts();
            ConsoleHelper.WriteSuccessLine($"Account opened successfully! Your account number is: {account.AccountNumber}");
        }

        public void Deposit(Guid accountNumber, decimal amount)
        {
           
            if (accountNumber == Guid.Empty)
            {
                throw new ArgumentException("Account number cannot be empty.", nameof(accountNumber));
            }

          
            if (amount <= 0)
            {
                throw new ArgumentException("Deposit amount must be greater than zero.", nameof(amount));
            }

            PerformTransaction(accountNumber, amount, "Deposit");
        }

        public void Withdraw(Guid accountNumber, decimal amount)
        {
            // Validate account number
            if (accountNumber == Guid.Empty)
            {
                throw new ArgumentException("Account number cannot be empty.", nameof(accountNumber));
            }

            if (amount <= 0)
            {
                throw new ArgumentException("Withdrawal amount must be greater than zero.", nameof(amount));
            }

            PerformTransaction(accountNumber, amount, "Withdrawal");
        }

        private void PerformTransaction(Guid accountNumber, decimal amount, string transactionType)
        {
            var account = _accounts.FirstOrDefault(a => a.AccountNumber == accountNumber);
            if (account == null)
            {
                throw new ArgumentException("Account not found.");
            }

            if (amount <= 0)
            {
                throw new InvalidOperationException("Amount must be greater than 0.");
            }

            if (transactionType == "Withdrawal" && account.Balance < amount)
            {
                throw new InsufficientBalanceException("Insufficient balance for withdrawal.");
            }

            if (transactionType == "Deposit")
            {
                account.Balance += amount;
            }
            else if (transactionType == "Withdrawal")
            {
                account.Balance -= amount;
            }

            account.Transactions.Add(new Transaction
            {
                Type = transactionType,
                Amount = amount
            });

            SaveAccounts();
            ConsoleHelper.WriteSuccessLine($"{transactionType} successful!");
        }

        public void DisplayAccountDetails(Guid accountNumber)
        {
           
            if (accountNumber == Guid.Empty)
            {
                throw new ArgumentException("Account number cannot be empty.", nameof(accountNumber));
            }

            var account = _accounts.FirstOrDefault(a => a.AccountNumber == accountNumber);
            if (account == null)
            {
                throw new ArgumentException("Account not found.");
            }

            ConsoleHelper.WriteInfoLine($"Account Number: {account.AccountNumber}");
            ConsoleHelper.WriteInfoLine($"Holder Name: {account.HolderName}");
            ConsoleHelper.WriteInfoLine($"Balance: {account.Balance}");
            ConsoleHelper.WriteInfoLine("Transaction History:");
            foreach (var transaction in account.Transactions)
            {
                ConsoleHelper.WriteInfoLine($"{transaction.Timestamp}: {transaction.Type} of {transaction.Amount}");
            }
        }

        public void ApplyMonthlyInterest(Guid accountNumber)
        {
            // Validate account number
            if (accountNumber == Guid.Empty)
            {
                throw new ArgumentException("Account number cannot be empty.", nameof(accountNumber));
            }

            var account = _accounts.FirstOrDefault(a => a.AccountNumber == accountNumber);
            if (account == null)
            {
                throw new ArgumentException("Account not found.");
            }

            decimal interestRate;
            try
            {
                interestRate = decimal.Parse(ConfigManager.GetSetting("InterestRate"));
            }
            catch (Exception)
            {
                throw new InvalidOperationException("Unable to retrieve interest rate configuration.");
            }

            if (interestRate <= 0)
            {
                throw new InvalidOperationException("Interest rate must be greater than zero.");
            }

            decimal interest = account.Balance * (interestRate / 100);
            account.Balance += interest;
            account.Transactions.Add(new Transaction
            {
                Type = "Interest",
                Amount = interest,
                Timestamp = DateTime.Now
            });

            SaveAccounts();
            ConsoleHelper.WriteSuccessLine($"Monthly interest of {interest} applied to the account.");
        }
    }
}