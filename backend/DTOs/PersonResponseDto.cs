namespace HomeExpenseTracker.DTOs;

public class PersonResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
}