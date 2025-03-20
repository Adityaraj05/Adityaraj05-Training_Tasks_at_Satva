import bcrypt from "bcryptjs";

const hashedPassword = "$2a$10$rrCvCl8I1S.X9aNPJzxE2.XGKhvJJAwNB6mSVmG.S4.ynQ4oTbH3";
const enteredPassword = "aditya01"; 

const isMatch = bcrypt.compareSync(enteredPassword, hashedPassword);

if (isMatch) {
  console.log("✅ Password Matched!");
} else {
  console.log("❌ Incorrect Password!");
}
