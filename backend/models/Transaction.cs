namespace HomeExpenseTracker.Models

{
    public class Transaction
    {
        public Guid Id { get; set; }

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public TransactionType Type { get; set; }

        public Guid PersonId { get; set; }

        public Person? Person { get; set; }
    }    
}