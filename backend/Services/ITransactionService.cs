using HomeExpenseTracker.DTOs;
using HomeExpenseTracker.Models;

namespace HomeExpenseTracker.Services;

public interface ITransactionService
{
    Task<TransactionResponseDto> CreateAsync(CreateTransactionDto dto);

    Task<PaginatedResponseDto<TransactionResponseDto>> ListAsync(
        int page, int pageSize, Guid? personId, TransactionType? type);
}