
using HomeExpenseTracker.DTOs;

namespace HomeExpenseTracker.Services;

public interface IPersonService
{
    Task<PersonResponseDto> CreateAsync(CreatePersonDto dto);
    Task<List<PersonResponseDto>> ListAsync();
    Task DeleteAsync(Guid id);
    Task<TotalsResponseDto> GetTotalsAsync();
}