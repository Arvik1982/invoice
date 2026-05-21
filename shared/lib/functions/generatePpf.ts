import { Invoice } from "@/types/main";

export const generatePdfHtml = (
  invoice: Invoice,
  contractorDetails: any,
  settings: any,
): string => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: settings?.currency || "RUB",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Счет №${invoice.invoiceNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

        body {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #4CAF50;
        }

        .invoice-title {
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .invoice-number {
          font-size: 20px;
          color: #7f8c8d;
          font-weight: 500;
        }

        .date {
          font-size: 16px;
          color: #7f8c8d;
        }

        .sections {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          margin-bottom: 30px;
        }

        .section {
          flex: 1;
          min-width: 300px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #eee;
        }

        .company-info p,
        .client-info p {
          margin: 8px 0;
          font-size: 14px;
          line-height: 1.5;
        }

        .label {
          font-weight: 600;
          color: #555;
          display: inline-block;
          width: 100px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 14px;
        }

        th {
          background-color: #f8f9fa;
          font-weight: 600;
          text-align: left;
          padding: 12px 8px;
          border: 1px solid #dee2e6;
          color: #495057;
        }

        td {
          padding: 10px 8px;
          border: 1px solid #dee2e6;
          vertical-align: top;
        }

        .services-table th:first-child {
          width: 40%;
        }

        .text-right {
          text-align: right;
        }

        .text-center {
          text-align: center;
        }

        .total-section {
          margin-top: 30px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 6px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          font-size: 16px;
        }

        .total-amount {
          font-size: 24px;
          font-weight: 700;
          color: #4CAF50;
          text-align: right;
          margin-top: 10px;
        }

        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 12px;
          color: #7f8c8d;
        }

        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px dashed #ddd;
        }

        .signature-block {
          width: 45%;
        }

        .signature-line {
          margin-top: 50px;
          border-top: 1px solid #333;
          padding-top: 5px;
        }

        .notes {
          margin-top: 20px;
          font-size: 12px;
          color: #666;
          line-height: 1.5;
        }

        @media print {
          body {
            padding: 0;
          }

          .container {
            border: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Заголовок -->
        <div class="header">
          <h1 class="invoice-title">СЧЕТ НА ОПЛАТУ</h1>
          <div class="invoice-number">№ ${invoice.invoiceNumber}</div>
          <div class="date">от ${formatDate(invoice.date)}</div>
        </div>

        <div class="sections">
          <!-- Исполнитель -->
          <div class="section">
            <h2 class="section-title">ИСПОЛНИТЕЛЬ</h2>
            <div class="company-info">
              ${
                contractorDetails
                  ? `
                <p><span class="label">Организация:</span> ${contractorDetails.companyName || ""}</p>
                <p><span class="label">Инн:</span> ${contractorDetails.inn || ""}</p>
                <p><span class="label">Адрес:</span> ${contractorDetails.address || ""}</p>
                <p><span class="label">Телефон:</span> ${contractorDetails.phone || ""}</p>
                <p><span class="label">Email:</span> ${contractorDetails.email || ""}</p>
                <p><span class="label">Банк:</span> ${contractorDetails.bankName || ""}</p>
                <p><span class="label">Счет:</span> ${contractorDetails.accountNumber || ""}</p>
                <p><span class="label">Бик:</span> ${contractorDetails.bik || ""}</p>
              `
                  : "<p>Реквизиты не указаны</p>"
              }
            </div>
          </div>

          <!-- Заказчик -->
          <div class="section">
            <h2 class="section-title">ЗАКАЗЧИК</h2>
            <div class="client-info">
              <p><span class="label">Заказчик:</span> ${invoice.invoiceDetails.client.clientName}</p>
              <p><span class="label">Инн:</span> ${invoice.invoiceDetails.client.inn || ""}</p>
              ${invoice.invoiceDetails.client.phone ? `<p><span class="label">Телефон:</span> ${invoice.invoiceDetails.client.phone}</p>` : ""}
              ${invoice.invoiceDetails.client.email ? `<p><span class="label">Email:</span> ${invoice.invoiceDetails.client.email}</p>` : ""}
            </div>
          </div>
        </div>

        <!-- Услуги -->
        <h2 class="section-title">Услуги</h2>
        <table class="services-table">
          <thead>
            <tr>
              <th>Наименование Услуги</th>
              <th>Кол-во</th>
              <th>Ед.</th>
              <th>Цена</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.invoiceDetails.services
              .map(
                (service, index) => `
              <tr>
                <td>${service.ServiceItem}</td>
                <td class="text-right">${service.quantity}</td>
                <td>${service.name}</td>
                <td class="text-right">${formatCurrency(service.price)}</td>
                <td class="text-right">${formatCurrency(service.quantity * service.price)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <!-- Итого -->
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

        ${
          invoice.invoiceDetails.client
            ? `
          <div class="notes">
            <strong>Примечание:</strong> ${invoice.invoiceDetails.client}
          </div>
        `
            : ""
        }

        <!-- Подписи -->
        <div class="signatures">
          <div class="signature-block">
            <p>Исполнитель:</p>
            <div class="signature-line"></div>
            <p style="margin-top: 5px; font-size: 11px;">${contractorDetails?.directorName || "ФИО"}</p>
            <p style="font-size: 11px;">${contractorDetails?.position || "Должность"}</p>
          </div>

          <div class="signature-block">
            <p>Заказчик:</p>
            <div class="signature-line"></div>
            <p style="margin-top: 5px; font-size: 11px;">Подпись, печать</p>
          </div>
        </div>

        <!-- Футер -->
        <div class="footer">
          <p>Счет действителен в течение 5 банковских дней</p>
          <p>Сгенерировано в приложении ${new Date().toLocaleDateString("ru-RU")}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
