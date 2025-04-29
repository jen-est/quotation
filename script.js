document.getElementById('date').value = new Date().toISOString().split('T')[0];

function addRow(tableId) {
  const table = document.getElementById(tableId).querySelector('tbody');
  const columns = tableId === 'scopeTable' ? 2 : 3;
  const row = document.createElement('tr');

  for (let i = 0; i < columns; i++) {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'text';
    cell.appendChild(input);
    row.appendChild(cell);
  }
  table.appendChild(row);
}

function toggleDiscount() {
  const discountInput = document.getElementById('discountInput');
  discountInput.style.display = document.getElementById('discountOption').value === 'yes' ? 'block' : 'none';
}

// TODO: Add total calculation logic here
