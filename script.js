// Prefill current date
document.getElementById('date').value = new Date().toISOString().split('T')[0];

// Add row function
function addRow(tableId) {
  const table = document.getElementById(tableId).querySelector('tbody');
  const columns = tableId === 'scopeTable' ? 2 : 4; // scopeTable has 2 cols, equipmentTable has 4
  const row = document.createElement('tr');

  for (let i = 0; i < columns; i++) {
    const cell = document.createElement('td');
    if (tableId === 'equipmentTable' && i === 0) {
      // Equipment Table, QTY column (first column) = number input
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = "0";
      qtyInput.style.width = '60px';
      cell.appendChild(qtyInput);
    } else if (tableId === 'equipmentTable' && i === 1) {
      // Equipment Table, UOM select
      const uomSelect = document.createElement('select');
      ['pc', 'set', 'box', 'unit', 'lot'].forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        uomSelect.appendChild(option);
      });
      cell.appendChild(uomSelect);
    } else if ((tableId === 'equipmentTable' && i === 2) || (tableId === 'scopeTable' && i === 0)) {
      // Description columns
      const descInput = document.createElement('input');
      descInput.type = 'text';
      descInput.style.width = '200px';
      cell.appendChild(descInput);
    } else {
      // Price columns
      const priceInput = document.createElement('input');
      priceInput.type = 'text';
      priceInput.style.width = '100px';
      priceInput.addEventListener('blur', formatPrice); // <<< peso format
      priceInput.addEventListener('input', calculateGrandTotal); // <<< update total
      cell.appendChild(priceInput);
    }
    row.appendChild(cell);
  }
  table.appendChild(row);
}

// Format price
function formatPrice(event) {
  const input = event.target;
  input.removeEventListener('input', calculateGrandTotal);
  let value = input.value.replace(/[^\d.]/g, '');
  let number = parseFloat(value);

  if (!isNaN(number)) {
    input.value = number.toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    });
  } else {
    input.value = '';
  }
  input.addEventListener('input', calculateGrandTotal);
}

// Toggle discount input
function toggleDiscount() {
  const discountInputDiv = document.getElementById('discountInput');
  const discountOption = document.getElementById('discountOption').value;
  if (discountOption === 'yes') {
    discountInputDiv.style.display = 'block';
  } else {
    discountInputDiv.style.display = 'none';
    document.getElementById('discount').value = 0;
  }
  calculateGrandTotal();
}

// Calculate Grand Total
function calculateGrandTotal() {
  let total = 0;

  // Add up scopeTable prices
  const scopePrices = document.querySelectorAll('#scopeTable tbody input');
  scopePrices.forEach(input => {
    let value = input.value.replace(/[^\d.]/g, '');
    if (value) total += parseFloat(value) || 0;
  });

  // Add up ONLY the Price column of equipmentTable
  const equipmentRows = document.querySelectorAll('#equipmentTable tbody tr');
  equipmentRows.forEach(row => {
    const cells = row.querySelectorAll('td input, td select');
    if (cells.length > 0) {
      const priceInput = cells[3]; // 4th cell is price
      if (priceInput && priceInput.value) {
        let value = priceInput.value.replace(/[^\d.]/g, '');
        total += parseFloat(value) || 0;
      }
    }
  });

  // Log to check total before discount
  console.log('Total before discount:', total);

  // Subtract discount if applicable
  const discountOption = document.getElementById('discountOption').value;
  let discountValue = parseFloat(document.getElementById('discount').value) || 0;
  console.log('Discount value (before adjustment):', discountValue);

  if (discountOption === 'yes') {
    const discountType = document.getElementById('discountType')?.value || 'amount';

    console.log('Discount type:', discountType);

    if (discountType === 'percentage') {
      // Apply percentage discount
      discountValue = total * (discountValue / 100);  // calculate the percentage amount
      total -= discountValue;  // subtract percentage from total
      console.log('Discount applied (percentage):', discountValue);
    } else {
      // Apply exact amount discount
      total -= discountValue;
      console.log('Discount applied (amount):', discountValue);
    }
  }

  // Log to check total after discount
  console.log('Total after discount:', total);

  // Prevent negative total
  if (total < 0) total = 0;

  // Format grand total
  document.getElementById('grandTotal').innerText = total.toLocaleString('en-PH', {
    style: 'currency',
    currency: 'PHP'
  });
}


// Save form and redirect to confirmation
function handleSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  // Save form data
  const formData = {
    date: document.getElementById('date').value,
    to: document.getElementById('to').value,
    title: document.getElementById('title').value,
    location: document.getElementById('location').value,
    scopeTable: getTableData('scopeTable'),
    equipmentTable: getTableData('equipmentTable'),
    discountOption: document.getElementById('discountOption').value,
    discountType: document.getElementById('discountType')?.value || 'amount',
    discountAmount: document.getElementById('discount').value,
    grandTotal: document.getElementById('grandTotal').innerText,
    paymentTerms: document.getElementById('paymentTerms').value
  };

  localStorage.setItem('formData', JSON.stringify(formData));
  window.location.href = 'confirmation.html';
}

// Helper function to get table data
function getTableData(tableId) {
  const table = document.getElementById(tableId);
  const rows = table.querySelectorAll('tbody tr');
  const data = [];
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const rowData = [];

    cells.forEach(cell => {
      const input = cell.querySelector('input, select');
      if (input) {
        rowData.push(input.value);
      } else {
        rowData.push('');
      }
    });

    data.push(rowData);
  });
  return data;
}

// Discount input listeners
document.getElementById('discount').addEventListener('input', calculateGrandTotal);
document.getElementById('discountType').addEventListener('change', calculateGrandTotal);
