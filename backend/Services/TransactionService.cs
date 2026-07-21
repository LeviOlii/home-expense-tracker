using HomeExpenseTracker.Data;
using HomeExpenseTracker.DTOs;
using HomeExpenseTracker.Exceptions;
using HomeExpenseTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeExpenseTracker.Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _context;

    public TransactionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TransactionResponseDto> CreateAsync(CreateTransactionDto dto)
    {
        var person = await _context.People.FindAsync(dto.PersonId)
            ?? throw new PersonNotFoundException(dto.PersonId);

        if (person.Age < 18 && dto.Type == TransactionType.Income)
        {
            throw new BusinessRuleException(
                "You must be at least 18 years old to create an income transaction.");
        }

        var transaction = new Transaction
        {
            Description = dto.Description,
            Amount = dto.Amount,
            Type = dto.Type,
            PersonId = dto.PersonId
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return MapToDto(transaction);
    }

    public async Task<PaginatedResponseDto<TransactionResponseDto>> ListAsync(
        int page, int pageSize, Guid? personId, TransactionType? type)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize is < 1 or > 100 ? 10 : pageSize;

        var query = _context.Transactions.AsNoTracking().AsQueryable();

        if (personId is not null)
            query = query.Where(t => t.PersonId == personId);

        if (type is not null)
            query = query.Where(t => t.Type == type);

        var totalTransactions = await query.CountAsync();

        var currentPageTransactions = await query
            .OrderByDescending(t => t.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TransactionResponseDto
            {
                Id = t.Id,
                Description = t.Description,
                Amount = t.Amount,
                Type = t.Type,
                PersonId = t.PersonId
            })
            .ToListAsync();

        return new PaginatedResponseDto<TransactionResponseDto>
        {
            Items = currentPageTransactions,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalTransactions
        };
    }

    private static TransactionResponseDto MapToDto(Transaction transaction) => new()
    {
        Id = transaction.Id,
        Description = transaction.Description,
        Amount = transaction.Amount,
        Type = transaction.Type,
        PersonId = transaction.PersonId
    };
}