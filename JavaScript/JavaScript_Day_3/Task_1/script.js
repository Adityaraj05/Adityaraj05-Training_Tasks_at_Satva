
let rows = [];
let summaryRows = [];
const projectOptions = ['JAVA Script Project', 'Satva Solution'];
const phaseOptions = ['Communication', 'Analysis', 'Development', 'Deployment'];
const statusOptions = ['Completed', 'Pending', 'Working'];

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    if (rows.length === 0) {
        addRows(); // Add default row if no rows exist
    }
    renderTables();
});

function loadFromLocalStorage() {
const savedData = localStorage.getItem('timeLogData');
const savedSummaryData = localStorage.getItem('summaryData');

if (savedSummaryData) {
summaryRows = JSON.parse(savedSummaryData);
}

if (savedData) {
rows = JSON.parse(savedData);
// Clear all rows except the first row and reset its fields
if (rows.length > 0) {
    rows = [createRow()]; // Keep only one empty row
}
} else {
rows = [createRow()]; // Initialize with one empty row if no saved data
}
}


function createDropdown(options, value, onchange) {
    const select = document.createElement('select');
    select.innerHTML = `<option value="">Select option</option>`;
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        if (option === value) optionElement.selected = true;
        select.appendChild(optionElement);
    });
    select.onchange = onchange;
    return select;
}

function createRow() {
    return {
        id: Date.now() + Math.random(),
        projectName: '',
        timeLogDate: '',
        phase: '',
        status: '',
        loggedHours: '',
        billableHours: '',
        notes: '',
        outOfStock: false,
        bcLink: '',
        bcDescription: ''
    };
}

function showPopup(message = 'Row added successfully!') {
    const popup = document.getElementById('successPopup');
    popup.textContent = message;
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

function handleInputChange(id, field, value) {
    rows = rows.map(row => {
        if (row.id === id) {
            const updatedRow = { ...row, [field]: value };

            // Ensure loggedHours and billableHours relationship
            if (field === 'loggedHours') {
                updatedRow.billableHours = value; // Reflect loggedHours in billableHours
            } else if (field === 'billableHours') {
                if (parseFloat(value) > parseFloat(row.loggedHours)) {
                    updatedRow.billableHours = row.loggedHours; // Prevent billableHours from exceeding loggedHours
                }
            }

            // Ensure loggedHours is always greater than or equal to billableHours
            if (parseFloat(updatedRow.billableHours) > parseFloat(updatedRow.loggedHours)) {
                updatedRow.loggedHours = updatedRow.billableHours; // Adjust loggedHours to match billableHours if necessary
            }

            if (isRowComplete(updatedRow)) {
                moveToSummary(updatedRow);
            }
            return updatedRow;
        }
        return row;
    });
    saveToLocalStorage();
    renderTables();
}


function isRowComplete(row) {
    return row.projectName && 
           row.timeLogDate && 
           row.phase && 
           row.status && 
           row.loggedHours && 
           row.billableHours && 
           row.notes;
}

function moveToSummary(row) {
    const existingIndex = summaryRows.findIndex(r => r.id === row.id);
    if (existingIndex === -1) {
        summaryRows.push({...row});
        showPopup('Row added successfully!');
    } else {
        summaryRows[existingIndex] = {...row};
        showPopup('Row updated successfully!');
    }
    
    // Remove the row from main table if it's not the default row
    rows = rows.filter(r => r.id !== row.id);
    if (rows.length === 0) {
        addRows(); // Add default row
    }
    
    saveToLocalStorage();
    renderTables();
}

function saveToLocalStorage() {
    localStorage.setItem('timeLogData', JSON.stringify(rows));
    localStorage.setItem('summaryData', JSON.stringify(summaryRows));
}

function renderTables() {
    renderMainTable();
    renderSummaryTable();
}

function renderMainTable() {
    const mainTableBody = document.getElementById('mainTableBody');
    mainTableBody.innerHTML = '';

    rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td></td>
            <td><input type="date" value="${row.timeLogDate}" onchange="handleInputChange(${row.id}, 'timeLogDate', this.value)"></td>
            <td></td>
            <td></td>
            <td><input type="number" value="${row.loggedHours}" onchange="handleInputChange(${row.id}, 'loggedHours', this.value)"></td>
            <td><input type="number" value="${row.billableHours}" onchange="handleInputChange(${row.id}, 'billableHours', this.value)"></td>
            <td><input type="text" value="${row.notes}" onchange="handleInputChange(${row.id}, 'notes', this.value)"></td>
            <td><input type="checkbox" ${row.outOfStock ? 'checked' : ''} onchange="handleInputChange(${row.id}, 'outOfStock', this.checked)"></td>
            <td><input type="text" value="${row.bcLink}" onchange="handleInputChange(${row.id}, 'bcLink', this.value)"></td>
            <td><input type="text" value="${row.bcDescription}" onchange="handleInputChange(${row.id}, 'bcDescription', this.value)"></td>
            
        `;

        const projectCell = tr.cells[1];
        projectCell.appendChild(createDropdown(projectOptions, row.projectName, 
            (e) => handleInputChange(row.id, 'projectName', e.target.value)));

        const phaseCell = tr.cells[3];
        phaseCell.appendChild(createDropdown(phaseOptions, row.phase,
            (e) => handleInputChange(row.id, 'phase', e.target.value)));

        const statusCell = tr.cells[4];
        statusCell.appendChild(createDropdown(statusOptions, row.status,
            (e) => handleInputChange(row.id, 'status', e.target.value)));

        mainTableBody.appendChild(tr);
    });
}

function renderSummaryTable() {
    const summaryTableBody = document.getElementById('summaryTableBody');
    summaryTableBody.innerHTML = '';

    summaryRows.forEach((row) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.projectName}</td>
            <td>${row.timeLogDate}</td>
            <td>${row.phase}</td>
            <td>${row.status}</td>
            <td>${row.loggedHours}</td>
            <td>${row.billableHours}</td>
            <td>${row.notes}</td>
            <td>${row.outOfStock ? 'true' : 'false'}</td>
            <td>${row.bcLink}</td>
            <td>${row.bcDescription}</td>
            <td><button class="edit-btn" onclick="editSummaryRow(${row.id})">Edit</button></td>
        `;
        summaryTableBody.appendChild(tr);
    });
}

function editSummaryRow(id) {
    const row = summaryRows.find(r => r.id === id);
    if (row) {
        // Move the row back to main table for editing
        summaryRows = summaryRows.filter(r => r.id !== id);
        rows.push({...row});
        saveToLocalStorage();
        renderTables();
        showPopup('Row moved to edit mode');
    }
}

function addRows() {
    const count = parseInt(document.getElementById('rowCount').value) || 1;
    const newRows = Array(count).fill().map(() => createRow());
    rows = [...rows, ...newRows];
    saveToLocalStorage();
    renderTables();
}

function deleteLastRows() {
    if (rows.length > 1) {
        rows.pop(); // Remove only the last row
    } else {
        alert('Cannot delete the last row. At least one row must remain.');
    }
    saveToLocalStorage();
    renderTables();
}

