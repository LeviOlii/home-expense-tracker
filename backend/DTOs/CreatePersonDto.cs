using System.ComponentModel.DataAnnotations;

namespace HomeExpenseTracker.DTOs;

public class CreatePersonDto
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 150)]
    public int Age { get; set; }
}