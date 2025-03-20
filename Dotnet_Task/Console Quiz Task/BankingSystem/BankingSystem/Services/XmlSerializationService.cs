using System;
using System.IO;
using System.Xml.Serialization;

namespace BankingSystem.Services
{
    public class XmlSerializationService
    {
        public void SerializeToXml<T>(T data, string filePath)
        {
            try
            {
                // Ensure the directory exists
                string directory = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                // Serialize the data to XML
                XmlSerializer serializer = new XmlSerializer(typeof(T));
                using (FileStream stream = new FileStream(filePath, FileMode.Create))
                {
                    serializer.Serialize(stream, data);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error serializing data to XML: {ex.Message}", ex);
            }
        }

        public T DeserializeFromXml<T>(string filePath)
        {
            try
            {
                if (!File.Exists(filePath))
                {
                    return default;
                }

                XmlSerializer serializer = new XmlSerializer(typeof(T));
                using (FileStream stream = new FileStream(filePath, FileMode.Open))
                {
                    return (T)serializer.Deserialize(stream);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deserializing XML data: {ex.Message}", ex);
            }
        }
    }
}