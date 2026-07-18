// DTOs/CreateTransactionDto.cs
using System.ComponentModel.DataAnnotations;
using HomeExpenseTracker.Models;

namespace HomeExpenseTracker.DTOs;

public class CreateTransactionDto
{
    [Required]
    [MaxLength(200)]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    [EnumDataType(typeof(TransactionType))]
    public TransactionType Type { get; set; }

    [Required]
    public Guid PersonId { get; set; }
}