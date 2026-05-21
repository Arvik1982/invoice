import { formatCurrency, formatDate } from "@/shared/lib/utils/formaters";
import { ContractorDetails, Invoice } from "@/types/main";

export const invoiceHtml = (
  onlyCertificate: boolean,
  invoice: Invoice,
  contractorDetails: ContractorDetails
) => {
  return onlyCertificate
    ? ""
    : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Счет №${invoice.invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Roboto', sans-serif;
      font-size: 13px;
      line-height: 1.4;
      color: #2c3e50;
      padding: 20px;
      background: #fff;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      padding: 25px;
      border: 1px solid #ddd;
      position: relative;
    }
    
    .header {
      text-align: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #2c3e50;
    }
    
    .invoice-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 8px;
      text-transform: uppercase;
      color: #2c3e50;
    }
    
    .invoice-number {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 6px;
      color: #2c3e50;
    }
    
    .date {
      font-size: 13px;
      color: #666;
      margin-top: 5px;
    }
    
    .sections {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 20px;
    }
    
    .section {
      width: 48%;
      padding: 15px;
      border: 1px solid #ddd;
      background: #fff;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #2c3e50;
      padding-bottom: 8px;
      border-bottom: 1px solid #ddd;
    }
    
    .company-info p,
    .client-info p {
      margin: 6px 0;
      font-size: 12px;
      line-height: 1.3;
      color: #333;
    }
    
    .label {
      font-weight: 600;
      color: #444;
      min-width: 75px;
      display: inline-block;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12px;
      border: 1px solid #ddd;
    }
    
    th {
      background: #f0f0f0;
      font-weight: 600;
      text-align: left;
      padding: 10px 8px;
      color: #2c3e50;
      font-size: 12px;
      border: 1px solid #ddd;
    }
    
    td {
      padding: 8px;
      border: 1px solid #ddd;
      vertical-align: middle;
      color: #333;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .total-section {
      margin-top: 20px;
      padding: 20px;
      background: #f9f9f9;
      border: 1px solid #ddd;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      font-size: 13px;
      color: #2c3e50;
    }
    
    .total-amount {
      font-size: 18px;
      font-weight: 700;
      text-align: right;
      margin-top: 10px;
      color: #2c3e50;
      padding: 10px 15px;
      background: white;
      border: 1px solid #ddd;
      display: inline-block;
      float: right;
    }
    
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    
    .signature-block {
      width: 45%;
      padding: 15px;
    }
    
    .signature-line {
      margin-top: 30px;
      border-top: 1px solid #2c3e50;
      padding-top: 5px;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      text-align: center;
      font-size: 11px;
      color: #666;
      border-top: 1px solid #ddd;
    }
    
    .footer p {
      margin: 4px 0;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    .note {
      margin-top: 15px;
      padding: 10px;
      background: #f9f9f9;
      border: 1px solid #ddd;
      font-size: 11px;
      color: #333;
    }
    
    @media print {
      body {
        padding: 0;
        background: white;
      }
      
      .page {
        width: 100%;
        min-height: 100%;
        margin: 0;
        padding: 20px;
        border: none;
        page-break-after: always;
      }
      
      .footer {
        position: fixed;
        bottom: 10px;
        width: calc(100% - 40px);
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1 class="invoice-title">СЧЕТ НА ОПЛАТУ</h1>
      <div class="invoice-number">№ ${invoice.invoiceNumber}</div>
      <div class="date">от ${formatDate(invoice.date)}</div>
    </div>
    
    <div class="sections">
      <div class="section">
        <div class="section-title">ИСПОЛНИТЕЛЬ</div>
        <div class="company-info">
          ${
            contractorDetails
              ? `
            <p><span class="label">Организация:</span> ${contractorDetails.name || contractorDetails.name || ""}</p>
            <p><span class="label">Инн:</span> ${contractorDetails.inn || ""}</p>
            <p><span class="label">Адрес:</span> ${contractorDetails.address || ""}</p>
            <p><span class="label">Телефон:</span> ${contractorDetails.phone || ""}</p>
            <p><span class="label">Банк:</span> ${contractorDetails.bankName || ""}</p>
            <p><span class="label">Счет:</span> ${contractorDetails.accountNumber || ""}</p>
            <p><span class="label">Бик:</span> ${contractorDetails.bik || ""}</p>
          `
              : "<p>Реквизиты не указаны</p>"
          }
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">ЗАКАЗЧИК</div>
        <div class="client-info">
          <p><span class="label">Заказчик:</span> ${invoice.invoiceDetails.client.clientName}</p>
          <p><span class="label">Инн:</span> ${invoice.invoiceDetails.client.inn || ""}</p>
          ${invoice.invoiceDetails.client.phone ? `<p><span class="label">Телефон:</span> ${invoice.invoiceDetails.client.phone}</p>` : ""}
          ${invoice.invoiceDetails.client.email ? `<p><span class="label">Email:</span> ${invoice.invoiceDetails.client.email}</p>` : ""}
        </div>
      </div>
    </div>
    
    <div style="margin: 10px 0 15px 0;">
      <div class="section-title">Услуги</div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 60%;">Наименование Услуги</th>
          <th style="width: 10%;">Кол-во</th>
          <th style="width: 15%;">Цена</th>
          <th style="width: 15%;">Сумма</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.invoiceDetails.services
          .map(
            (service, index) => `
          <tr>
            <td>${service.ServiceItem}</td>
            <td class="text-right">${service.quantity}</td>
            <td class="text-right">${formatCurrency(service.price)}</td>
            <td class="text-right">${formatCurrency(service.quantity * service.price)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    
    <div class="total-section">
      <div class="total-row">
        <span>Итого:</span>
        <span>${formatCurrency(invoice.invoiceDetails.totalSumm)}</span>
      </div>
      
      ${
        invoice.invoiceDetails.totalSumm > 0
          ? `
        <div class="total-row">
          <span>Всего к оплате:</span>
          <span>${formatCurrency(invoice.invoiceDetails.totalSumm)}</span>
        </div>
      `
          : ""
      }
      
      <div class="total-amount">
        ${formatCurrency(invoice.invoiceDetails.totalSumm)}
      </div>
    </div>
    
    <div class="signatures">
      <div class="signature-block">
        <p>Исполнитель:</p>
        ${renderSignature()}
      </div>
      
      <div class="signature-block">
        <p>Заказчик:</p>
        <div class="signature-line"></div>
        <p style="margin-top: 8px; font-size: 10px; color: #333;">
          Подпись, печать
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p>Счет действителен в течение 5 банковских дней</p>
      <p>Сгенерировано в приложении ${new Date().toLocaleDateString("ru-RU")}</p>
    </div>
  </div>
`;
};
