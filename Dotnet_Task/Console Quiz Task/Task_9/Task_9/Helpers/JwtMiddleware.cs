using Task_9.Services.Interfaces;

namespace Task_9.Helpers
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ITokenService tokenService)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token != null)
                AttachUserToContext(context, tokenService, token);

            await _next(context);
        }

        private void AttachUserToContext(HttpContext context, ITokenService tokenService, string token)
        {
            var userId = tokenService.ValidateAccessToken(token);
            if (userId != null)
            {
                // For additional security, add the validated userId to HttpContext
                context.Items["UserId"] = userId.Value;
            }
        }
    }
}