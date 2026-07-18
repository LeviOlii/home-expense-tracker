namespace HomeExpenseTracker.DTOs;

public class TotalPerPersonDto
{
    public Guid PersonId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal Balance => TotalIncome - TotalExpenses;
}

public class TotalsResponseDto
{
    public List<TotalPerPersonDto> People { get; set; } = new();
    public decimal OverallIncome { get; set; }
    public decimal OverallExpenses { get; set; }
    public decimal OverallBalance => OverallIncome - OverallExpenses;
}