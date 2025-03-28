using Microsoft.AspNetCore.Mvc;

namespace Task_6.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            if (string.IsNullOrEmpty(TempData["UserName"] as string))
            {
                return RedirectToAction("Login", "Account");
            }
            return View();
        }
    }
}