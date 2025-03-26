namespace ProductManagementAPI.Models
{
    public class CommonResponse<T>
    {
        public int Status { get; set; }
        public string? Message { get; set; } 
        public T Data { get; set; }

        public static CommonResponse<T> Success(T data, string message = "Operation successful")
        {
            return new CommonResponse<T>
            {
                Status = 1,
                Message = message,
                Data = data
            };
        }

        public static CommonResponse<T> Failure(string message = "Operation failed")
        {
            return new CommonResponse<T>
            {
                Status = 0,
                Message = message,
                Data = default
            };
        }
    }
}