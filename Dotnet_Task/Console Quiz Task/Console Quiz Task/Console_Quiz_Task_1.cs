using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
namespace Console_Quiz_Task
{
    class Console_Quiz_Task_1
    {
        static void Main()
        {
            Console.Write("Enter your name: ");
            string userName;
            while (true)
            {
                userName = Console.ReadLine()?.Trim();
                if (!string.IsNullOrEmpty(userName) && Regex.IsMatch(userName, @"^[a-zA-Z\s]+$"))
                {
                    break;
                }
                else
                {
                    WriteColoredText("Invalid input! Please enter a string only.", ConsoleColor.Red);
                    Console.Write("Enter your name: ");
                }
            }
            Console.WriteLine($"\nWelcome {userName}! Let's start the Physics Quiz.\n");

            string[] questions = {
                "What is the unit of force?",
                "Who proposed the three laws of motion?",
                "What is the speed of light in vacuum?",
                "What is the SI unit of electric current?",
                "Which fundamental force keeps planets in orbit around the Sun?",
                "What is the charge of an electron?",
                "What is the first law of thermodynamics based on?",
                "Which subatomic particle has no charge?",
                "What type of wave is sound in air?",
                "What does E=mc^2 represent?"
            };

            string[,] options = {
                { "A. Joule", "B. Newton", "C. Pascal", "D. Watt" },
                { "A. Galileo", "B. Einstein", "C. Newton", "D. Tesla" },
                { "A. 3.00 × 10^8 m/s", "B. 2.99 × 10^6 m/s", "C. 3.50 × 10^8 m/s", "D. 1.50 × 10^8 m/s" },
                { "A. Volt", "B. Coulomb", "C. Ampere", "D. Ohm" },
                { "A. Strong Nuclear Force", "B. Weak Nuclear Force", "C. Gravity", "D. Electromagnetic Force" },
                { "A. Positive", "B. Negative", "C. Neutral", "D. Zero" },
                { "A. Law of conservation of energy", "B. Law of motion", "C. Law of entropy", "D. Law of relativity" },
                { "A. Proton", "B. Neutron", "C. Electron", "D. Photon" },
                { "A. Transverse", "B. Longitudinal", "C. Electromagnetic", "D. Standing" },
                { "A. Law of motion", "B. Conservation of charge", "C. Mass-energy equivalence", "D. Quantum mechanics" }
            };

            char[] answers = { 'B', 'C', 'A', 'C', 'C', 'B', 'A', 'B', 'B', 'C' };
            char[] validOptions = { 'A', 'B', 'C', 'D' };

            Random rand = new Random();
            List<int> shuffledIndexes = new List<int>();
            HashSet<int> askedQuestions = new HashSet<int>();

            while (shuffledIndexes.Count < questions.Length)
            {
                int questionIndex = rand.Next(questions.Length);
                if (askedQuestions.Add(questionIndex))
                {
                    shuffledIndexes.Add(questionIndex);
                }
            }

            int score = 0;

            for (int i = 0; i < shuffledIndexes.Count; i++)
            {
                int questionIndex = shuffledIndexes[i];

                Console.WriteLine($"{i + 1}. {questions[questionIndex]}");
                for (int j = 0; j < options.GetLength(1); j++)
                {
                    Console.WriteLine(options[questionIndex, j]);
                }

                char userAnswer;

            retry:
                Console.Write("\nYour answer: ");
                string input = Console.ReadLine()?.Trim().ToUpper();

                if (!string.IsNullOrEmpty(input) && input.Length == 1 && Array.Exists(validOptions, opt => opt == input[0]))
                {
                    userAnswer = input[0];
                }
                else
                {
                    WriteColoredText("Invalid choice! Please select a valid option from A, B, C, D.", ConsoleColor.Red);
                    Console.WriteLine();
                    goto retry;
                }

                if (userAnswer == answers[questionIndex])
                {
                    WriteColoredText("Correct Answer!", ConsoleColor.Green);
                    Console.WriteLine("\n");
                    score++;
                }
                else
                {
                    WriteColoredText($"Incorrect Answer! The correct answer is {answers[questionIndex]}.", ConsoleColor.Red);
                    Console.WriteLine("\n");
                }
            }

            double percentage = ((double)score / questions.Length) * 100;
            Console.WriteLine($"\n{userName}, your final score: {score}/{questions.Length} ({percentage}%)");

            if (percentage >= 70)
            {
                WriteColoredText("Congratulations! You have passed the quiz.", ConsoleColor.Green);
                Console.WriteLine("\nWell Done!");
            }
            else
            {
                WriteColoredText("Sorry! You have failed the quiz.", ConsoleColor.Red);
                Console.WriteLine("\nBetter luck next time!");
            }

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }

      
        static void WriteColoredText(string text, ConsoleColor backgroundColor)
        {
            ConsoleColor originalBgColor = Console.BackgroundColor;
            Console.BackgroundColor = backgroundColor;
            Console.Write(text);
            Console.BackgroundColor = originalBgColor;
            Console.WriteLine(); 
        }
    }
}