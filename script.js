// Prefill current date
document.getElementById('date').value = new Date().toISOString().split('T')[0];

// Add row function
function addRow(tableId) {
  const table = document.getElementById(tableId).querySelector('tbody');
  const columns = tableId === 'scopeTable' ? 2 : 3;  // 2 columns for scope, 3 columns for equipment
  const row = document.createElement('tr');

  for (let i = 0; i < columns; i++) {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = i === columns - 1 ? 'number' : 'text'; // Last column (price) is number
    input.min = "0";
    input.step = "0.01";
    input.addEventListener('input', calculateGrandTotal);  // Recalculate grand total on input
    cell.appendChild(input);
    row.appendChild(cell);
  }
  table.appendChild(row);
}

// Toggle discount input visibility
function toggleDiscount() {
  const discountInput = document.getElementById('discountInput');
  if (document.getElementById('discountOption').value === 'yes') {
    discountInput.style.display = 'block';  // Show discount field
  } else {
    discountInput.style.display = 'none';  // Hide discount field
    document.getElementById('discount').value = 0;  // Reset discount to 0
  }
  calculateGrandTotal();  // Recalculate grand total when discount changes
}

// Calculate Grand Total
function calculateGrandTotal() {
  let total = 0;

  // Add up scopeTable prices
  const scopePrices = document.querySelectorAll('#scopeTable tbody input[type="number"]');
  scopePrices.forEach(input => {
    if (input.value) {
      total += parseFloat(input.value);
    }
  });

  // Add up equipmentTable prices
  const equipmentPrices = document.querySelectorAll('#equipmentTable tbody input[type="number"]');
  equipmentPrices.forEach(input => {
    if (input.value) {
      total += parseFloat(input.value);
    }
  });

  // Subtract discount if applicable
  const discountOption = document.getElementById('discountOption').value;
  if (discountOption === 'yes') {
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    total -= discount;
