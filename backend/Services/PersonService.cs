// Services/PersonService.cs
using HomeExpenseTracker.Data;
using HomeExpenseTracker.DTOs;
using HomeExpenseTracker.Exceptions;
using HomeExpenseTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeExpenseTracker.Services;

public class PersonService : IPersonService
{
    private readonly AppDbContext _context;

    public PersonService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PersonResponseDto> CreateAsync(CreatePersonDto dto)
    {
        var person = new Person
        {
            Name = dto.Name,
            Age = dto.Age
        };

        _context.People.Add(person);
        await _context.SaveChangesAsync();

        return MapToDto(person);
    }

    public async Task<List<PersonResponseDto>> ListAsync()
    {
        return await _context.People
            .AsNoTracking()
            .OrderBy(p => p.Name)
            .Select(p => new PersonResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Age = p.Age
            })
            .ToListAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var person = await _context.People.FindAsync(id)
            ?? throw new PersonNotFoundException(id);

        _context.People.Remove(person);
        await _context.SaveChangesAsync();
    }

    public async Task<TotalsResponseDto> GetTotalsAsync()
    {
        var people = await _context.People
            .AsNoTracking()
            .Include(p => p.Transactions)
            .OrderBy(p => p.Name)
            .ToListAsync();

        var totalsPerPerson = people.Select(p => new TotalPerPersonDto
        {
            PersonId = p.Id,
            Name = p.Name,
            TotalIncome = p.Transactions
                .Where(t => t.Type == TransactionType.Income)
                .Sum(t => t.Amount),
            TotalExpenses = p.Transactions
                .Where(t => t.Type == TransactionType.Expense)
                .Sum(t => t.Amount)
        }).ToList();

        return new TotalsResponseDto
        {
            People = totalsPerPerson,
            OverallIncome = totalsPerPerson.Sum(p => p.TotalIncome),
            OverallExpenses = totalsPerPerson.Sum(p => p.TotalExpenses)
        };
    }

    private static PersonResponseDto MapToDto(Person person) => new()
    {
        Id = person.Id,
        Name = person.Name,
        Age = person.Age
    };
}