using HomeExpenseTracker.DTOs;
using HomeExpenseTracker.Services;
using Microsoft.AspNetCore.Mvc;

namespace HomeExpenseTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PeopleController : ControllerBase
{
    private readonly IPersonService _personService;

    public PeopleController(IPersonService personService)
    {
        _personService = personService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(PersonResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreatePersonDto dto)
    {
        var person = await _personService.CreateAsync(dto);
        return CreatedAtAction(nameof(List), new { }, person);
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<PersonResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> List()
    {
        var people = await _personService.ListAsync();
        return Ok(people);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _personService.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("totals")]
    [ProducesResponseType(typeof(TotalsResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotals()
    {
        var totals = await _personService.GetTotalsAsync();
        return Ok(totals);
    }
}
