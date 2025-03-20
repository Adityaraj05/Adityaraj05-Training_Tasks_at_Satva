using System;
using System.Collections.Generic;

namespace BankingSystem.Models
{
    public class Account
    {
        public Guid AccountNumber { get; set; } = Guid.NewGuid();
        public string HolderName { get; set; }
        public decimal Balance { get; set; }
        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}