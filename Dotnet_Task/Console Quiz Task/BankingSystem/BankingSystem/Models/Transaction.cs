using System;

namespace BankingSystem.Models
{
    public class Transaction
    {
        public Guid TransactionId { get; set; } = Guid.NewGuid();
        public string Type { get; set; } 
        public decimal Amount { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}