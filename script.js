// Prefill current date
document.getElementById('date').value = new Date().toISOString().split('T')[0];

// Add row function
function addRow(tableId) {
  const table = document.getElementById(tableId).querySelector('tbody');
  const columns = tableId === 'scopeTable' ? 2 : 3;
  const row = document.createElement('tr');

  for (let i = 0; i < columns; i++) {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = i === columns - 1 ? 'number' : 'text'; // Last column (price) is number
    input.min = "0";
    input.step = "0.01";
    input.addEventListener('input', calculateGrandTotal);
    cell.appendChild(input);
    row.appendChild(cell);
  }
  table.appendChild(row);
}

// Toggle discount input
function toggleDiscount() {
  const discountInput = document.getElementById('discountInput');
  if (document.getElementById('discountOption').value === 'yes') {
    discountInput.style.display = 'block';
  } else {
    discountInput.style.display = 'none';
    document.getElementById('discount').value = 0;
  }
  calculateGrandTotal();
}

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
  }

  // Prevent negative total
  if (total < 0) total = 0;

  // Format as Philippine Peso with commas
  const formattedTotal = total.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
  document.getElementById('grandTotal').innerText = formattedTotal;
}

  document.getElementById('grandTotal').innerText = total.toFixed(2);
}

// Discount field triggers recalculation too
document.getElementById('discount').addEventListener('input', calculateGrandTotal);
