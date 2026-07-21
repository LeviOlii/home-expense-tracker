using HomeExpenseTracker.DTOs;
using HomeExpenseTracker.Models;
using HomeExpenseTracker.Services;
using Microsoft.AspNetCore.Mvc;

namespace HomeExpenseTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(TransactionResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
    {
        var transaction = await _transactionService.CreateAsync(dto);
        return CreatedAtAction(nameof(List), new { }, transaction);
    }

    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponseDto<TransactionResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] Guid? personId = null,
        [FromQuery] TransactionType? type = null)
    {
        var result = await _transactionService.ListAsync(page, pageSize, personId, type);
        return Ok(result);
    }
}
