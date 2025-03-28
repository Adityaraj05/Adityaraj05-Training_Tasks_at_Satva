using Microsoft.Data.SqlClient;

namespace Task_6.Data
{

    public static class DatabaseHelper
    {
        private static string ConnectionString ="Server=DESKTOP-VFJ5P9P\\SQLEXPRESS;Database=dotnet_task_6;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

        public static SqlConnection GetConnection()
        {
            return new SqlConnection(ConnectionString);
        }

        public static bool ValidateEmail(string email)
        {
            using (SqlConnection conn = GetConnection())
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Users WHERE Email = @Email", conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);
                    return (int)cmd.ExecuteScalar() == 0;
                }
            }
        }
    }
}
