namespace HomeExpenseTracker.Exceptions;

public class PersonNotFoundException : Exception
{
    public PersonNotFoundException(Guid id)
        : base($"Person with id '{id}' was not found.") { }
}