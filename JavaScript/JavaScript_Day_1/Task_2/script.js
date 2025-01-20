let currentStep = 0; // Initial step index set to 0
let formDetails = document.getElementById("formDetails"); // Form details section
let components = document.getElementsByClassName("component"); // Form ke sabhi components
let steps = document.getElementsByClassName("step"); // Steps for navigation

// Function jo current step ko form mein show karega
function showStep(step) {
  
  // Sabhi form components ko hide karna
  for (let i = 0; i < components.length; i++) {
    components[i].style.display = "none";
  }

  // Har step se "active" class ko remove karna
  for (let i = 0; i < steps.length; i++) {
    steps[i].classList.remove("active");
  }

  // Agar ye last step hai, toh form details ko show karenge
  if (step == components.length) {
    formDetails.style.display = "block"; // Show form details
  } else {
    components[step].style.display = "block"; // Current step ko show karo
    formDetails.style.display = "none"; // Form details ko hide karo
  }

  // Current step ko active bana do
  steps[step].classList.add("active");

  // Agar last step hai toh button ka text "Submit" set karo, warna "Next"
  if (step == components.length - 1) {
    document.getElementById("nextBtn").innerHTML = "Submit"; 
  } else {
    document.getElementById("nextBtn").innerHTML = "Next"; // Default button text
  }

  // Agar first step hai toh "Prev" button ko hide karo, nahi toh show karo
  if (step == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
}

// Function jo form ko validate karega based on current step
function validateForm() {
  let valid = true;

  // First step validation (Name aur ZIP code)
  if (currentStep === 0) {
    const firstName = document.getElementById("firstName");
    const firstNameError = document.getElementById("firstNameError");
    if (
      firstName.value.trim().length < 3 ||
      !/^[a-zA-Z]+$/.test(firstName.value)
    ) {
      firstNameError.textContent =
        "First name must be at least 3 characters and contain only letters."; // Error message
      valid = false;
    } else {
      firstNameError.textContent = ""; // Error ko clear karna
    }
    const lastName = document.getElementById("lastName");
    const lastNameError = document.getElementById("lastNameError");
    if (
      lastName.value.trim().length < 3 ||
      !/^[a-zA-Z]+$/.test(lastName.value)
    ) {
      lastNameError.textContent =
        "Last name must be at least 3 characters and contain only letters."; // Error message
      valid = false;
    } else {
      lastNameError.textContent = ""; // Error ko clear karna
    }

    // ZIP code validation
    const zip = document.getElementById("zip");
    const zipError = document.getElementById("zipError");
    if (!/^\d{6}$/.test(zip.value)) {
      zipError.textContent = "Enter a valid 6-digit ZIP code."; // Error message
      valid = false;
    } else {
      zipError.textContent = ""; // Error ko clear karna
    }

    return valid;
  } else if (currentStep === 1) {
    // Email, password aur confirm password validation
    const email = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const password = document.getElementById("password");
    const passwordError = document.getElementById("passwordError");
    const cpassword = document.getElementById("cpassword");
    const cpasswordError = document.getElementById("cpasswordError");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      emailError.textContent = "Enter a valid email address."; // Error message
      valid = false;
    } else {
      emailError.textContent = ""; // Error ko clear karna
    }

    if (password.value.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters."; // Error message
      valid = false;
    } else {
      passwordError.textContent = ""; // Error ko clear karna
    }

    if (password.value !== cpassword.value) {
      cpasswordError.textContent = "Passwords mismatch."; // Error message
      valid = false;
    } else {
      cpasswordError.textContent = ""; // Error ko clear karna
    }

    return valid;
  }
  
  // Bank details validation
  if (currentStep === 2) {
    let valid = true;
    const bank = document.getElementById("bank");
    const bankError = document.getElementById("bankError");
    if (bank.value === "") {
      bankError.textContent = "Please select a bank."; // Error message
      valid = false;
    } else {
      bankError.textContent = ""; // Error ko clear karna
    }

    const branch = document.getElementById("branch");
    const branchError = document.getElementById("branchError");
    if (branch.value === "") {
      branchError.textContent = "Please select a branch."; // Error message
      valid = false;
    } else {
      branchError.textContent = ""; // Error ko clear karna
    }

    const account = document.getElementById("account");
    const accountError = document.getElementById("accountError");
    if (account.value === "") {
      accountError.textContent = "Please select an account type."; // Error message
      valid = false;
    } else {
      accountError.textContent = ""; // Error ko clear karna
    }

    const accountNumber = document.getElementById("accountNumber");
    const accountNumberError = document.getElementById("accountNumberError");
    if (!/^\d{12}$/.test(accountNumber.value)) {
      accountNumberError.textContent = "Account number must be 12 digits."; // Error message
      valid = false;
    } else {
      accountNumberError.textContent = ""; // Error ko clear karna
    }

    return valid;
  }
  
  // Card details validation
  if (currentStep === 3) {
    let valid = true;

    const card = document.getElementById("card");
    const cardError = document.getElementById("cardError");
    if (card.value === "") {
      cardError.textContent = "Please select a card type."; // Error message
      valid = false;
    } else {
      cardError.textContent = ""; // Error ko clear karna
    }

    const holderName = document.getElementById("holderName");
    const holderNameError = document.getElementById("holderNameError");
    if (!/^[a-zA-Z\s]{3,}$/.test(holderName.value)) {
      holderNameError.textContent =
        "Holder name must be at least 3 alphabetic characters."; // Error message
      valid = false;
    } else {
      holderNameError.textContent = ""; // Error ko clear karna
    }

    const cardNumber = document.getElementById("cardNumber");
    const cardNumberError = document.getElementById("cardNumberError");
    if (!/^\d{16}$/.test(cardNumber.value)) {
      cardNumberError.textContent = "Card number must be 16 digits."; // Error message
      valid = false;
    } else {
      cardNumberError.textContent = ""; // Error ko clear karna
    }

    const cvv = document.getElementById("cvv");
    const cvvError = document.getElementById("cvvError");
    if (!/^\d{3}$/.test(cvv.value)) {
      cvvError.textContent = "CVV must be exactly 3 digits."; // Error message
      valid = false;
    } else {
      cvvError.textContent = ""; // Error ko clear karna
    }

    const date = document.getElementById("date");
    const dateError = document.getElementById("dateError");
    if (!date.value || new Date(date.value) < new Date()) {
      dateError.textContent = "Please select a valid expiry date."; // Error message
      valid = false;
    } else {
      dateError.textContent = ""; // Error ko clear karna
    }

    return valid;
  }
}

// Function jo navigation handle karega (next ya previous)
function nextPrev(n) {
  if (n === 1 && !validateForm()) return; // Agar validation fail ho, toh agla step na jaaye

  let components = document.getElementsByClassName("component"); 

  // Agar last step hai, toh form details ko show karo
  if (n == 1 && currentStep == components.length - 1) {
    currentStep += n;
    showFormDetails(); // Show form details
  } else {
    currentStep += n; // Agla ya previous step set karo
    if (currentStep >= components.length) {
      currentStep = components.length; // Step ko limit ke andar rakho
    }
    if (currentStep < 0) {
      currentStep = 0; // Step ko 0 se kam na hone do
    }
    showStep(currentStep); // Current step ko display karo
  }

  console.log(currentStep); // Debugging step index
  console.log(components.length); // Debugging number of components
}

// Function jo form details ko final step pe show karega
function showFormDetails() {
  const btnsContainer = document.getElementById("btns-container");

  // Buttons ko visible karna agar zaroorat ho
  btnsContainer.style.display = "block";

  // Sabhi components ko hide karna
  for (let i = 0; i < components.length; i++) {
    components[i].style.display = "none";
  }

  // Form details section ko show karna
  formDetails.style.display = "block";

  // Form data ko table mein display karna
  let details = `
          <h2 class="text-center">USER DETAILS</h2>
          <div class="table-responsive">
          <table class="table-container">
              <tr>
                  <th>Field</th>
                  <th>Value</th>
              </tr>
              <tr>
                  <td>First Name</td>
                  <td>${document.getElementById("firstName").value}</td>
              </tr>
              <tr>
                  <td>Last Name</td>
                  <td>${document.getElementById("lastName").value}</td>
              </tr>
              <tr>
                  <td>Email</td>
                  <td>${document.getElementById("email").value}</td>
              </tr>
              <tr>
                  <td>Username</td>
                  <td>${document.getElementById("userName").value}</td>
              </tr>
              <tr>
                  <td>Bank</td>
                  <td>${document.getElementById("bank").value}</td>
              </tr>
              <tr>
                  <td>Branch</td>
                  <td>${document.getElementById("branch").value}</td>
              </tr>
              <tr>
                  <td>Account Type</td>
                  <td>${document.getElementById("account").value}</td>
              </tr>
              <tr>
                  <td>Card Type</td>
                  <td>${document.getElementById("card").value}</td>
              </tr>
              <tr>
                  <td>Cardholder Name</td>
                  <td>${document.getElementById("holderName").value}</td>
              </tr>
              <tr>
                  <td>Card Number</td>
                  <td>${document.getElementById("cardNumber").value}</td>
              </tr>
              <tr>
                  <td>CVV</td>
                  <td>${document.getElementById("cvv").value}</td>
              </tr>
              <tr>
                  <td>Expiry Date</td>
                  <td>${document.getElementById("date").value}</td>
              </tr>
          </table></div>
      `;
  document.getElementById("formDetails").innerHTML = details;
}

// Pehle step ko display karna
showStep(currentStep);
