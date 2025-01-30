const showLoader = () => {
  loaderContainer.style.display = "flex";
};
const hideLoader = () => {
  loaderContainer.style.display = "none";
};

const jwtToken = localStorage.getItem("jwtToken");

if (!jwtToken) {
  window.location.href = "index.html";
}

const handleLogout = () => {
  showLoader();
  setTimeout(() => {
    hideLoader();
    localStorage.removeItem("jwtToken");
    window.location.href = "index.html";
  }, 1000);
};
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    event.target.classList.add("active");

    const sectionId = event.target.dataset.section;
    document
      .querySelectorAll(".action-btn")
      .forEach((btn) => btn.classList.add("d-none"));

    // Show the correct button based on the section
    if (sectionId === "reconciled-section") {
      document.getElementById("unreconcileBtn").classList.remove("d-none");
    } else if (sectionId === "exclude-section") {
      document.getElementById("excludeBtn").classList.remove("d-none");
    } else {
      document.getElementById("reconcileBtn").classList.remove("d-none");
    }

    changeContent(sectionId);
  });
});

document.getElementById("reconcileBtn").addEventListener("click", handleReconciliation);
document.getElementById("unreconcileBtn").addEventListener("click", handleUnreconciliation);
document.getElementById("excludeBtn").addEventListener("click", handleExclusion);

function changeContent(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.style.display = "none";
  });
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = "flex";
  }
}

const company1List = document.getElementById("company1");
const company2List = document.getElementById("company2");
const reconciledList = document.getElementById("reconciled");

let transactions = [];

async function fetchTransactions() {
  showLoader();
  try {
    const response = await fetch(
      "http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    transactions = await response.json();
    renderTransactions();
    renderReconciledTransactions();
  } catch (error) {
    console.error("Error fetching transactions:", error);
  } finally {
    hideLoader();
  }
}

function generateUniqueId(companyId, transactionId) {
  return `company${companyId}_${transactionId}`;
}

function createTransactionHTML(transaction, companyId) {
  const uniqueId = generateUniqueId(companyId, transaction.transactionId);
  return `
        <div class="transaction p-2 bg-light border rounded" draggable="true" 
            data-id="${uniqueId}" 
            data-original-id="${transaction.transactionId}"
            data-company="${companyId}"
            data-amount="${transaction.amount}">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    ${transaction.transactionType.toUpperCase()}: ${
    transaction.date
  }
                </div>
                <div>
                    $${transaction.amount}
                    <i class="bi bi-chevron-down toggle-lines cursor-pointer" tabindex="0" data-id="${uniqueId}"></i>
                </div>
            </div>
            <div class="lines mt-2 collapse" id="lines-${uniqueId}">
                ${transaction.lines
                  .map(
                    (line) => `
                    <div class="row bg-light border rounded py-2 px-3 mb-2 mx-1">
                        <span class="col-6">${line.account}</span>
                        <span class="col-3">$${line.amount}</span>
                        <span class="${
                          line.isCredit
                            ? "text-success col-3"
                            : "text-danger col-3"
                        }">
                            ${line.isCredit ? "Credit" : "Debit"}
                        </span>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;
}

function createTransactionHTMLwithCheck(transaction, companyId, isExcluded) {
  const uniqueId = generateUniqueId(companyId, transaction.transactionId);
  return `
        <div class="transaction p-2 bg-light border rounded" draggable="true" 
            data-id="${uniqueId}" 
            data-original-id="${transaction.transactionId}"
            data-company="${companyId}"
            data-amount="${transaction.amount}">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <input type="checkbox" class="form-check-input me-2" ${
                      isExcluded ? "checked" : ""
                    }>
                     ${transaction.transactionType.toUpperCase()}: ${
    transaction.date
  }
                </div>
                <div>
                    $${transaction.amount}
                    <i class="bi bi-chevron-down toggle-lines cursor-pointer" tabindex="0" data-id="${uniqueId}"></i>
                </div>
            </div>
             <div class="lines mt-2 collapse" id="lines-${uniqueId}">
                ${transaction.lines
                  .map(
                    (line) => `
                    <div class="row bg-light border rounded py-2 px-3 mb-2 mx-1">
                        <span class="col-6">${line.account}</span>
                        <span class="col-3">$${line.amount}</span>
                        <span class="${
                          line.isCredit
                            ? "text-success col-3"
                            : "text-danger col-3"
                        }">
                            ${line.isCredit ? "Credit" : "Debit"}
                        </span>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;
}
let excludedTransactions = JSON.parse(
  localStorage.getItem("excludedTransactions")
) || {
  company1: [],
  company2: [],
};

function renderTransactions() {
  company1List.innerHTML = "";
  company2List.innerHTML = "";
  reconciledList.innerHTML = "";
  const mappedTransactions =
    JSON.parse(localStorage.getItem("mappedTransactions")) || {};

  const excludeDiv = document.getElementById("exclude-div");
  if (transactions.length == 0) {
    reconciledList.innerHTML = `<p class="text-center text-muted">No transactions found.</p>`;
    excludeDiv.innerHTML = `<p class="text-center text-muted">No transactions found.</p>`;
    return;
  }

  const filteredCompany1Transactions = transactions.toCompanyTransaction.filter(
    (entry) => {
      const uniqueId = generateUniqueId(1, entry.transactionId);
      return !excludedTransactions.company1.includes(uniqueId);
    }
  );
  const filteredCompany2Transactions =
    transactions.fromCompanyTransaction.filter((entry) => {
      const uniqueId = generateUniqueId(2, entry.transactionId);
      return !excludedTransactions.company2.includes(uniqueId);
    });

  const finalFilteredCompany1Transactions = filteredCompany1Transactions.filter(
    (entry) => {
      const uniqueId = generateUniqueId(1, entry.transactionId);
      return !mappedTransactions[uniqueId];
    }
  );

  const finalFilteredCompany2Transactions = filteredCompany2Transactions.filter(
    (entry) => {
      const uniqueId = generateUniqueId(2, entry.transactionId);
      return !Object.values(mappedTransactions).some(
        (arr) => Array.isArray(arr) && arr.includes(uniqueId)
      );
    }
  );

  finalFilteredCompany1Transactions.forEach((entry) => {
    const transactionHTML = createTransactionHTML(entry, 1);
    company1List.innerHTML += transactionHTML;
  });

  finalFilteredCompany2Transactions.forEach((entry) => {
    const transactionHTML = createTransactionHTML(entry, 2);
    company2List.innerHTML += transactionHTML;
  });

  addDragAndDropListeners();

  const excludeCompany1 = document.getElementById("exclude-company1");
  const excludeCompany2 = document.getElementById("exclude-company2");

  excludeCompany1.innerHTML = "";
  excludeCompany2.innerHTML = "";

  transactions.toCompanyTransaction.forEach((entry) => {
    const uniqueId = generateUniqueId(1, entry.transactionId);
    const transactionHTML = createTransactionHTMLwithCheck(
      entry,
      1,
      excludedTransactions.company1.includes(uniqueId)
    );
    excludeCompany1.innerHTML += transactionHTML;
  });
  transactions.fromCompanyTransaction.forEach((entry) => {
    const uniqueId = generateUniqueId(2, entry.transactionId);
    const transactionHTML = createTransactionHTMLwithCheck(
      entry,
      2,
      excludedTransactions.company2.includes(uniqueId)
    );
    excludeCompany2.innerHTML += transactionHTML;
  });
}
function addDragAndDropListeners() {
    const draggableElements = document.querySelectorAll("#company2 .transaction");
    const droppableList = document.getElementById("reconciled");
  
    draggableElements.forEach((el) => {
      el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", el.getAttribute("data-id"));
      });
    });
  
    droppableList.addEventListener("dragover", (e) => {
      e.preventDefault();
      droppableList.classList.add("drag-over");
    });
  
    droppableList.addEventListener("dragleave", () => {
      droppableList.classList.remove("drag-over");
    });
  
    droppableList.addEventListener("drop", (e) => {
      e.preventDefault();
      droppableList.classList.remove("drag-over");
      const transactionId = e.dataTransfer.getData("text/plain");
      const draggedTransaction = document.querySelector(
        `[data-id="${transactionId}"]`
      );
      if (draggedTransaction) {
        droppableList.appendChild(draggedTransaction);
        draggedTransaction.classList.add("excluded");
        computeAmount();
      }
    });
  }
  

let amount = 0;

function computeAmount() {
  amount = 0;
  const elements = document.querySelectorAll("#reconciled .transaction");
  elements.forEach((el) => {
    const transactionAmount = parseFloat(el.getAttribute("data-amount"));
    if (!isNaN(transactionAmount)) {
      amount += transactionAmount;
    }
  });
}

function renderReconciledTransactions() {
  const reconciledCompany1 = document.getElementById("reconciled-company1");
  const reconciledCompany2 = document.getElementById("reconciled-company2");
  const centralDiv = document.getElementById("reconciled-div");
  const mappedTransactions =
    JSON.parse(localStorage.getItem("mappedTransactions")) || {};

  reconciledCompany1.innerHTML = "";
  reconciledCompany2.innerHTML = "";
  Object.entries(mappedTransactions).forEach(
    ([company1Id, reconciledItems]) => {
      const company1Transaction = transactions.toCompanyTransaction.find(
        (t) => generateUniqueId(1, t.transactionId) === company1Id
      );

      if (company1Transaction) {
        reconciledCompany1.innerHTML += createTransactionHTMLwithCheck(
          company1Transaction,
          1
        );
        reconciledItems.forEach((reconciledId) => {
          const company2Transaction = transactions.fromCompanyTransaction.find(
            (t) => generateUniqueId(2, t.transactionId) === reconciledId
          );
          if (company2Transaction) {
            reconciledCompany2.innerHTML += createTransactionHTMLwithCheck(
              company2Transaction,
              2
            );
          }
        });

        const emptySpaces = reconciledItems.length - 1;
        for (let i = 0; i < emptySpaces; i++) {
          const emptyDiv = document.createElement("div");
          emptyDiv.classList.add(
            "transaction",
            "p-2",
            "bg-light",
            "border",
            "rounded",
            "py-"
          );
          emptyDiv.textContent = "N/A";
          emptyDiv.style.opacity = "0.5";
          reconciledCompany1.appendChild(emptyDiv);
        }
      }
    }
  );
}

function handleUnreconciliation() {
  const company1elements = document.querySelectorAll(
    "#reconciled-company1 .transactions"
  );
  const company2elements = document.querySelectorAll(
    "#reconciled-company2 .transactions"
  );
  const mappedTransactions =
    JSON.parse(localStorage.getItem("mappedTransactions")) || {};
  const selectedTransactions = getSelectedTransactionsforReconciled();
  if (selectedTransactions.length > 0) {
    selectedTransactions.forEach((selectedTransaction) => {
      const company1Transaction = transactions.toCompanyTransaction.find(
        (t) =>
          generateUniqueId(1, t.transactionId) ===
          selectedTransaction.dataset.id
      );
      const company2Transaction = transactions.fromCompanyTransaction.find(
        (t) =>
          generateUniqueId(2, t.transactionId) ===
          selectedTransaction.dataset.id
      );

      if (company1Transaction) {
        const key = generateUniqueId(1, company1Transaction.transactionId);
        delete mappedTransactions[key];
        return;
      }

      if (company2Transaction) {
        const keyToRemove = generateUniqueId(
          2,
          company2Transaction.transactionId
        );
        let company1KeyToRemove = null;

        Object.keys(mappedTransactions).forEach((company1Key) => {
          if (mappedTransactions[company1Key].includes(keyToRemove)) {
            company1KeyToRemove = company1Key;
          }
        });
        if (company1KeyToRemove) {
          delete mappedTransactions[company1KeyToRemove];
          return;
        }
      }
    });
    localStorage.setItem(
      "mappedTransactions",
      JSON.stringify(mappedTransactions)
    );
    Swal.fire({
      icon: "success",
      title: "Unreconciliation Successful",
      text: "Selected transactions have been removed from reconciliation.",
      confirmButtonText: "OK",
    });

    renderReconciledTransactions();
  } else {
    Swal.fire({
      icon: "error",
      title: "Unreconciliation Failed",
      text: "No transactions selected for removal.",
      confirmButtonText: "Try Again",
    });
  }
}

function handleReconciliation() {
  const company1elements = document.querySelectorAll("#company1 .transaction");
  const reconciledelements = document.querySelectorAll("#reconciled .transaction");
  const mappedTransactions = JSON.parse(localStorage.getItem("mappedTransactions")) || {};

  // Loop through all company1 transactions
  company1elements.forEach((el) => {
    const transactionAmount = parseFloat(el.getAttribute("data-amount"));
    const totalSum = parseFloat(el.querySelector(".sum-display").innerText.replace('Total: $', ''));

    if (!isNaN(transactionAmount) && totalSum === transactionAmount) {
      const company1Id = el.getAttribute("data-id");
      mappedTransactions[company1Id] = Array.from(reconciledelements).map(
        (reconciled) => reconciled.getAttribute("data-id")
      );

      el.remove();
      reconciledelements.forEach((reconciled) => {
        const original = document.querySelector(
          `#company2 [data-id="${reconciled.getAttribute("data-id")}"]`
        );
        if (original) original.remove();
        reconciled.remove();
      });

      localStorage.setItem("mappedTransactions", JSON.stringify(mappedTransactions));
      renderReconciledTransactions();

      Swal.fire({
        icon: "success",
        title: "Reconciliation Successful",
        text: "The matching transactions have been reconciled successfully!",
        confirmButtonText: "OK",
      });
      return;
    }
  });

  Swal.fire({
    icon: "error",
    title: "Reconciliation Failed",
    text: `No transactions in company 1 match the total amount ($${totalSum}) or at least move one transaction.`,
    confirmButtonText: "Try Again",
  });
}
function handleReconciliation() {
  const company1elements = document.querySelectorAll("#company1 .transaction");
  const reconciledelements = document.querySelectorAll("#reconciled .transaction");
  const mappedTransactions = JSON.parse(localStorage.getItem("mappedTransactions")) || {};

  // Loop through all company1 transactions
  company1elements.forEach((el) => {
    const transactionAmount = parseFloat(el.getAttribute("data-amount"));
    const totalSum = parseFloat(el.querySelector(".sum-display").innerText.replace('Total: $', ''));

    if (!isNaN(transactionAmount) && totalSum === transactionAmount) {
      const company1Id = el.getAttribute("data-id");
      mappedTransactions[company1Id] = Array.from(reconciledelements).map(
        (reconciled) => reconciled.getAttribute("data-id")
      );

      el.remove();
      reconciledelements.forEach((reconciled) => {
        const original = document.querySelector(
          `#company2 [data-id="${reconciled.getAttribute("data-id")}"]`
        );
        if (original) original.remove();
        reconciled.remove();
      });

      localStorage.setItem("mappedTransactions", JSON.stringify(mappedTransactions));
      renderReconciledTransactions();

      Swal.fire({
        icon: "success",
        title: "Reconciliation Successful",
        text: "The matching transactions have been reconciled successfully!",
        confirmButtonText: "OK",
      });
      return;
    }
  });

  Swal.fire({
    icon: "error",
    title: "Reconciliation Failed",
    text: `No transactions in company 1 match the total amount ($${totalSum}) or at least move one transaction.`,
    confirmButtonText: "Try Again",
  });
}


document.addEventListener("click", (event) => {
  const toggleBtn = event.target.closest(".toggle-lines");
  if (!toggleBtn) return;

  const transactionId = toggleBtn.dataset.id;
  const linesElement = document.getElementById(`lines-${transactionId}`);

  if (!linesElement) {
    console.warn(`Element with ID 'lines-${transactionId}' not found.`);
    return;
  }
  event.stopPropagation();
  if (
    linesElement.style.display === "none" ||
    linesElement.classList.contains("collapse")
  ) {
    linesElement.style.display = "block";
    linesElement.classList.remove("collapse");
    console.log(`Transaction ID: ${transactionId} Expanded`);
  } else {
    linesElement.style.display = "none";
    linesElement.classList.add("collapse");
    console.log(`Transaction ID: ${transactionId} Collapsed`);
  }
});

function handleExclusion() {
  const selectedTransactions = getSelectedTransactions();
  console.log(selectedTransactions.length);
  if (selectedTransactions.length === 0) {
    localStorage.removeItem("excludedTransactions");
    Swal.fire({
      icon: "success",
      title: "No Transactions Selected",
      text: "All transactions are include.",
      confirmButtonText: "OK",
    });
    return;
  }
  excludedTransactions = {
    company1: [],
    company2: [],
  };
  // localStorage.removeItem("excludedTransactions");
  selectedTransactions.forEach((transaction) => {
    const companyId = transaction.getAttribute("data-company");
    const transactionId = transaction.getAttribute("data-id");

    if (
      companyId === "1" &&
      !excludedTransactions.company1.includes(transactionId)
    ) {
      excludedTransactions.company1.push(transactionId);
    } else if (
      companyId === "2" &&
      !excludedTransactions.company2.includes(transactionId)
    ) {
      excludedTransactions.company2.push(transactionId);
    }
  });

  saveExcludedTransactions();
  renderTransactions();

  Swal.fire({
    icon: "success",
    title: "Transactions Excluded",
    text: "Selected transactions have been excluded successfully.",
    confirmButtonText: "OK",
  });
}

document.getElementById("selectAllBtn").addEventListener("click", function () {
  const checkboxes = document.querySelectorAll(
    '#exclude-section input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => (checkbox.checked = true));
});

document
  .getElementById("deselectAllBtn")
  .addEventListener("click", function () {
    const checkboxes = document.querySelectorAll(
      '#exclude-section input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
  });

function getSelectedTransactionsforReconciled() {
  const selectedCheckboxes = document.querySelectorAll(
    '#reconciled-section input[type="checkbox"]:checked'
  );
  return Array.from(selectedCheckboxes).map((checkbox) =>
    checkbox.closest(".transaction")
  );
}

function getSelectedTransactions() {
  const selectedCheckboxes = document.querySelectorAll(
    '#exclude-section input[type="checkbox"]:checked'
  );
  return Array.from(selectedCheckboxes).map((checkbox) =>
    checkbox.closest(".transaction")
  );
}

function saveExcludedTransactions() {
  localStorage.setItem(
    "excludedTransactions",
    JSON.stringify(excludedTransactions)
  );
}

window.addEventListener("DOMContentLoaded", () => {
  fetchTransactions();
});