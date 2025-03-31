
namespace Task_9.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }  // Indicates if the request was successful
        public string Message { get; set; } // Provides a success/error message
        public T Data { get; set; }  // Generic data payload
        public List<string> Errors { get; set; } // List of validation or other errors

        public ApiResponse(bool success, string message, T data, List<string> errors = null)
        {
            Success = success;
            Message = message;
            Data = data;
            Errors = errors ?? new List<string>();
        }

        public static ApiResponse<T> SuccessResponse(string message, T data)
        {
            return new ApiResponse<T>(true, message, data);
        }

        public static ApiResponse<T> ErrorResponse(string message, List<string> errors = null)
        {
            return new ApiResponse<T>(false, message, default, errors);
        }

        internal static object? SuccessResponse(string v)
        {
            throw new NotImplementedException();
        }
    }

}
