

using System;


////1.Write a program in C# Sharp to create a file and add some text.
//Console.WriteLine("Welcome Aditya!");
//FileStream fs = File.Create("Sample1.txt");
//Console.WriteLine("File is Created:");
//fs.Close();

//String text = "File is created and here we are adding the text in it.";
//File.WriteAllText("Sample1.txt", text);
//Console.WriteLine("File is Created and text added.");

////2. Write a program in C# Sharp to create a file with text and read the file.
//string filePath = "Sample2.txt";
//string textToWrite = "This is the text that will be written to the Sample2.txt";
//File.WriteAllText(filePath, textToWrite);
//Console.WriteLine("Text written to the file.");
//fs.Close();
//string readText = File.ReadAllText(filePath);
//Console.WriteLine("Text read from the file:");
//Console.WriteLine(readText);


////3. Write a program in C# Sharp to create a file and write an array of strings to the file.
//string[] lines = {
//    "Line 1: This is the first line.",
//    "Line 2: Here comes the second line.",
//    "Line 3: Finally, the third line."
//};

//string filePath2 = "Sample3.txt";
//File.WriteAllLines(filePath2, lines);
//Console.WriteLine("Array of strings written to the file.");

//string[] readLines = File.ReadAllLines(filePath2);
//Console.WriteLine("Text read from the file:");
//foreach (string line in readLines)
//{
//    Console.WriteLine(line);
//}

////4.Write a program in C# Sharp to append some text to an existing file.  
//string appendText = "This is the appended text.\n";
//File.AppendAllText("Sample3.txt", appendText);
//Console.WriteLine("Text appended to the file.");


////5. Write a program in C# Sharp to read the first line from a file.
//string firstLine = File.ReadLines("Sample3.txt").First();
//Console.WriteLine("First line read from the file:");
//Console.WriteLine(firstLine);


////6 Write a program in C# Sharp to count the number of lines in a file.

//int lineCount = File.ReadLines("Sample2.txt").Count();
//Console.WriteLine("Number of lines in the file: " + lineCount);








namespace EmployeeManagementSystem
{
    public class Program
    {
        static void Main(string[] args)
        {
            EmployeeManager manager = new EmployeeManager();

            Console.WriteLine("Welcome to Employee Management System");

            while (true)
            {
                Console.WriteLine("\nPlease select an option:");
                Console.WriteLine("1. Add new employee");
                Console.WriteLine("2. Update existing employee");
                Console.WriteLine("3. Delete employee");
                Console.WriteLine("4. View all employees");
                Console.WriteLine("5. Find employee by email");
                Console.WriteLine("6. Exit");

                Console.Write("\nEnter your choice: ");
                string choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        manager.AddEmployee();
                        break;
                    case "2":
                        manager.UpdateEmployee();
                        break;
                    case "3":
                        manager.DeleteEmployee();
                        break;
                    case "4":
                        manager.DisplayAllEmployees();
                        break;
                    case "5":
                        manager.FindEmployeeByEmail();
                        break;
                    case "6":
                        Console.WriteLine("Thank you for using Employee Management System!");
                        return;
                    default:
                        Console.WriteLine("Invalid option. Please try again.");
                        break;
                }
            }
        }
    }
}
