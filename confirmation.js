// Load data from localStorage
const formData = JSON.parse(localStorage.getItem('formData'));

if (formData) {
  // Populate basic details
  // Format date
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(date);

  // Set formatted date in the confirmation page
  document.getElementById('confirmDate').innerText = formattedDate || 'N/A';

  document.getElementById('confirmTo').innerText = formData.to || 'N/A';
  document.getElementById('confirmTitle').innerText = formData.title || 'N/A';
  document.getElementById('confirmLocation').innerText = formData.location || 'N/A';

  // Populate Scope Table
  const scopeTableBody = document.getElementById('confirmScopeTable').querySelector('tbody');
  let scopeHasData = false;
  formData.scopeTable.forEach(row => {
    if (row.some(cell => cell.trim() !== '')) { // Check if any cell is non-empty
      scopeHasData = true;
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const td = document.createElement('td');
        td.innerText = cell || 'N/A';
        tr.appendChild(td);
      });
      scopeTableBody.appendChild(tr);
    }
  });

  if (!scopeHasData) {
    document.getElementById('scopeSection').style.display = 'none'; // Hide Scope Section if empty
  }

  // Populate Equipment Table
  const equipmentTableBody = document.getElementById('confirmEquipmentTable').querySelector('tbody');
  let equipmentHasData = false;
  formData.equipmentTable.forEach(row => {
    if (row.some(cell => cell.trim() !== '')) { // Check if any cell is non-empty
      equipmentHasData = true;
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const td = document.createElement('td');
        td.innerText = cell || 'N/A';
        tr.appendChild(td);
      });
      equipmentTableBody.appendChild(tr);
    }
  });

  if (!equipmentHasData) {
    document.getElementById('equipmentSection').style.display = 'none'; // Hide Equipment Section if empty
  }

  // Handle Discount Section
  if (formData.discountOption === 'yes' && parseFloat(formData.discountAmount) > 0) {
    document.getElementById('confirmDiscount').innerText = `₱${parseFloat(formData.discountAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  } else {
    document.getElementById('discountSection').style.display = 'none'; // Hide Discount Section if no discount
  }

  // Grand Total and Payment Terms
  document.getElementById('confirmGrandTotal').innerText = formData.grandTotal || '₱0.00';
  document.getElementById('confirmPaymentTerms').innerText = formData.paymentTerms || 'No payment terms specified.';
}

// Download PDF
function downloadPDF() {
  const element = document.getElementById('confirmationContent');
  const options = {
    margin: 1,
    filename: 'quotation.pdf',
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' }
  };
  html2pdf().set(options).from(element).save();
}