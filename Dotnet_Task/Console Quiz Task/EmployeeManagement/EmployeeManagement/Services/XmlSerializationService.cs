using System;
using System.IO;
using System.Xml.Serialization;

namespace EmployeeManagement.Services
{
    public class XmlSerializationService
    {
        public void SerializeToXml<T>(T data, string filePath)
        {
            try
            {
                // Create directory if it doesn't exist
                string directory = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrEmpty(directory))
                {
                    if (!Directory.Exists(directory))
                    {
                        Console.WriteLine($"Creating directory: {directory}");
                        Directory.CreateDirectory(directory);
                    }
                    else
                    {
                        Console.WriteLine($"Directory already exists: {directory}");
                    }
                }

                XmlSerializer serializer = new XmlSerializer(typeof(T));
                using (FileStream stream = new FileStream(filePath, FileMode.Create))
                {
                    Console.WriteLine($"Creating file: {filePath}");
                    serializer.Serialize(stream, data);
                }

                Console.WriteLine($"File successfully created at: {filePath}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error serializing data to XML: {ex.Message}");
                throw new Exception($"Error serializing data to XML: {ex.Message}", ex);
            }
        }

        public T DeserializeFromXml<T>(string filePath)
        {
            try
            {
                if (!File.Exists(filePath))
                {
                    Console.WriteLine($"File not found: {filePath}");
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
                Console.WriteLine($"Error deserializing XML data: {ex.Message}");
                throw new Exception($"Error deserializing XML data: {ex.Message}", ex);
            }
        }
    }
}
