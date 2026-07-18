using HomeExpenseTracker.Models;

namespace HomeExpenseTracker.DTOs;

public class TransactionResponseDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public Guid PersonId { get; set; }
}