// Load data from localStorage
const formData = JSON.parse(localStorage.getItem('formData'));

if (formData) {
  document.getElementById('confirmDate').innerText = formData.date;
  document.getElementById('confirmTo').innerText = formData.to;
  document.getElementById('confirmTitle').innerText = formData.title;
  document.getElementById('confirmLocation').innerText = formData.location;

  // Populate Scope Table
  const scopeTable = document.getElementById('confirmScopeTable').querySelector('tbody');
  formData.scopeTable.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.innerText = cell;
      tr.appendChild(td);
    });
    scopeTable.appendChild(tr);
  });

  // Populate Equipment Table
  const equipmentTable = document.getElementById('confirmEquipmentTable').querySelector('tbody');
  formData.equipmentTable.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.innerText = cell;
      tr.appendChild(td);
    });
    equipmentTable.appendChild(tr);
  });

  document.getElementById('confirmDiscount').innerText = formData.discountOption === 'yes' ? `₱${parseFloat(formData.discountAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : 'None';
  document.getElementById('confirmGrandTotal').innerText = formData.grandTotal;
  document.getElementById('confirmPaymentTerms').innerText = formData.paymentTerms;
}

// Download PDF
function downloadPDF() {
  const element = document.getElementById('confirmationContent');
  html2pdf().from(element).save('quotation.pdf');
}
