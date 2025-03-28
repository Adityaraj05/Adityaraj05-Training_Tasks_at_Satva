using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Data.SqlClient;

namespace Task_6.Data
{
    public static class SecurityHelper

    {
       

        public static string EncryptPassword(string password)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Convert.FromBase64String("YzJRd1pqVXpabk56UURNeE5XZGxZWHA2VzBGR1UyZHo=");
                aesAlg.IV = Convert.FromBase64String("dmJuZ2hqdHl1Z2hqa2xxcQ==");

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(password);
                        }
                    }
                    return Convert.ToBase64String(msEncrypt.ToArray());
                }
            }
        }

        public static string DecryptPassword(string encryptedPassword)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Convert.FromBase64String("YzJRd1pqVXpabk56UURNeE5XZGxZWHA2VzBGR1UyZHo=");
                aesAlg.IV = Convert.FromBase64String("dmJuZ2hqdHl1Z2hqa2xxcQ==");

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(encryptedPassword)))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
        }
    }

}