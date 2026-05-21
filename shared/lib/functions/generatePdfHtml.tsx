import { Invoice } from "@/types/main";

export const generatePdfHtml = (
  invoice: Invoice,
  contractorDetails: any,
  settings: any,
  onlyCertificate: boolean = false,
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

  const formatCurrencyWithoutSymbol = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Функция для числового прописью (упрощенная)
  const numberToWords = (num: number): string => {
    const units = [
      "",
      "один",
      "два",
      "три",
      "четыре",
      "пять",
      "шесть",
      "семь",
      "восемь",
      "девять",
    ];
    const teens = [
      "десять",
      "одИннадцать",
      "двенадцать",
      "тринадцать",
      "четырнадцать",
      "пятнадцать",
      "шестнадцать",
      "семнадцать",
      "восемнадцать",
      "девятнадцать",
    ];
    const tens = [
      "",
      "десять",
      "двадцать",
      "тридцать",
      "сорок",
      "пятьдесят",
      "шестьдесят",
      "семьдесят",
      "восемьдесят",
      "девяносто",
    ];
    const hundreds = [
      "",
      "сто",
      "двести",
      "триста",
      "четыреста",
      "пятьсот",
      "шестьсот",
      "семьсот",
      "восемьсот",
      "девятьсот",
    ];

    let result = "";
    let n = Math.floor(num);
    let k = Math.round((num - n) * 100);

    // Тысячи
    if (n >= 1000) {
      const thousands = Math.floor(n / 1000);
      n %= 1000;

      if (thousands === 1) result += "одна тысяча ";
      else if (thousands === 2) result += "две тысячи ";
      else if (thousands >= 3 && thousands <= 4)
        result += units[thousands] + " тысячи ";
      else if (thousands >= 5 && thousands <= 9)
        result += units[thousands] + " тысяч ";
      else {
        // Для чисел 10-19 тысяч
        if (thousands >= 10 && thousands <= 19) {
          result += teens[thousands - 10] + " тысяч ";
        } else if (thousands >= 20) {
          const tensPart = Math.floor(thousands / 10);
          const unitsPart = thousands % 10;
          result +=
            tens[tensPart] +
            " " +
            (unitsPart > 0 ? units[unitsPart] + " " : "") +
            "тысяч ";
        }
      }
    }

    // Сотни
    if (n >= 100) {
      const hundredsPart = Math.floor(n / 100);
      result += hundreds[hundredsPart] + " ";
      n %= 100;
    }

    // Десятки и единицы
    if (n >= 20) {
      const tensPart = Math.floor(n / 10);
      result += tens[tensPart] + " ";
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + " ";
      n = 0;
    }

    // Единицы
    if (n > 0) result += units[n] + " ";

    if (result.trim() === "") result = "ноль ";

    // Форма рубля
    const lastDigit = Math.floor(num) % 10;
    const lastTwoDigits = Math.floor(num) % 100;
    let rubleForm = "рублей";
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) rubleForm = "рублей";
    else if (lastDigit === 1) rubleForm = "рубль";
    else if (lastDigit >= 2 && lastDigit <= 4) rubleForm = "рубля";

    result += rubleForm + " " + k.toString().padStart(2, "0") + " копеек";
    return result;
  };

  // Функция для отображения подписи
  const renderSignature = () => {
    // Используем signUri из contractorDetails или из invoice.contractorDetails
    const signatureUri =
      contractorDetails?.signUri || invoice.contractorDetails?.signUri;

    if (signatureUri) {
      return `
        <div style="margin: 20px 0 10px 0;">
          <img 
            src="${signatureUri}" 
            alt="Подпись" 
            style="max-width: 150px; max-height: 60px; object-fit: contain;"
          />
        </div>
        <p style="margin-top: 8px; font-size: 11px; color: #333;">
          ${contractorDetails?.directorName || contractorDetails?.name || "ФИО"}
        </p>
        <p style="font-size: 11px; color: #666;">
          ${contractorDetails?.position || ""}
        </p>
      `;
    } else {
      return `
        <div class="signature-line"></div>
        <p style="margin-top: 8px; font-size: 11px; color: #333;">
          ${contractorDetails?.directorName || contractorDetails?.name || "ФИО"}
        </p>
        <p style="font-size: 11px; color: #666;">
          ${contractorDetails?.position || ""}
        </p>
      `;
    }
  };

  // HTML для счета (только если не запрошен только Акт)
  const invoiceHtml = onlyCertificate
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
            <p><span class="label">Организация:</span> ${contractorDetails.companyName || contractorDetails.name || ""}</p>
            <p><span class="label">Инн:</span> ${contractorDetails.inn || ""}</p>
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
        `,
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

  // HTML для Акта
  const certificateHtml = onlyCertificate
    ? `
  ${!onlyCertificate ? '<div class="page-break"></div>' : ""}
  <div class="page">
    <div class="header">
      <h1 class="invoice-title">АКТ ВЫПОЛНЕННЫХ РАБОТ</h1>
      <div class="invoice-number">№ ${invoice.invoiceNumber}</div>
      <div class="date">от ${formatDate(invoice.date)}</div>
    </div>
    
    ${
      invoice.invoiceDetails.certificateBasis
        ? `
    <div style="margin: 15px 0; padding: 12px; background: #f9f9f9; border: 1px solid #ddd;">
      <p><strong>Основание:</strong> ${invoice.invoiceDetails.certificateBasis}</p>
    </div>
    `
        : ""
    }
    
    <div class="sections">
      <div class="section">
        <div class="section-title">ИСПОЛНИТЕЛЬ</div>
        <div class="company-info">
          ${
            contractorDetails
              ? `
            <p><span class="label">Организация:</span> ${contractorDetails.companyName || contractorDetails.name || ""}</p>
            <p><span class="label">Инн:</span> ${contractorDetails.inn || ""}</p>
            <p><span class="label">Телефон:</span> ${contractorDetails.phone || ""}</p>
            <p><span class="label">Расчетный счет:</span> ${contractorDetails.accountNumber || ""}</p>
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
        </div>
      </div>
    </div>
    
    <div style="margin: 10px 0 15px 0;">
      <div class="section-title">ВЫПОЛНЕННЫЕ РАБОТЫ / ОКАЗАННЫЕ Услуги</div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 5%;">№</th>
          <th style="width: 55%;">Наименование работ (услуг)</th>
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
            <td class="text-center">${index + 1}</td>
            <td>${service.ServiceItem}</td>
            <td class="text-right">${service.quantity}</td>
            <td class="text-right">${formatCurrencyWithoutSymbol(service.price)}</td>
            <td class="text-right">${formatCurrencyWithoutSymbol(service.quantity * service.price)}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
    
    <div style="margin: 20px 0; padding: 20px; background: #f9f9f9; border: 1px solid #ddd;">
      <p style="font-weight: 600; color: #2c3e50; margin-bottom: 10px;">
        Всего выполнено работ (оказано услуг) на сумму:
      </p>
      <p style="margin: 10px 0; font-size: 12px; color: #333; line-height: 1.4;">
        ${numberToWords(invoice.invoiceDetails.totalSumm)}
      </p>
      <p style="text-align: right; margin-top: 15px; font-size: 14px;">
        <strong style="color: #2c3e50;">Итого:</strong> 
        <span style="color: #2c3e50; font-weight: 700; font-size: 16px; margin-left: 10px;">
          ${formatCurrency(invoice.invoiceDetails.totalSumm)}
        </span>
      </p>
    </div>
    
    <div class="note">
      <p><strong>Условия выполнения работ (оказания услуг):</strong></p>
      <p style="margin-top: 5px;">1. Работы выполнены в полном объеме и в установленные сроки.</p>
      <p>2. Заказчик претензий к объему, качеству и срокам выполнения работ (оказания услуг) не имеет.</p>
      <p>3. Настоящий Акт составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из Сторон.</p>
    </div>
    
    <div class="signatures" style="margin-top: 30px;">
      <div class="signature-block">
        <p style="font-weight: 600; color: #2c3e50; margin-bottom: 15px;">ИСПОЛНИТЕЛЬ:</p>
        ${renderSignature()}
        <p style="margin-top: 10px; font-size: 10px; color: #999;">М.П.</p>
      </div>
      
      <div class="signature-block">
        <p style="font-weight: 600; color: #2c3e50; margin-bottom: 15px;">ЗАКАЗЧИК:</p>
        <div class="signature-line"></div>
        <p style="margin-top: 8px; font-size: 11px; color: #333;">
          ${invoice.invoiceDetails.client.clientName}
        </p>

        <p style="margin-top: 10px; font-size: 10px; color: #999;">М.П.</p>
      </div>
    </div>
    
    <div class="footer">
      <p>Акт составлен и подписан сторонами в двух экземплярах</p>
      <p>Сгенерировано в приложении ${new Date().toLocaleDateString("ru-RU")}</p>
    </div>
  </div>
`
    : "";

  return `
<!DOCTYPE html>

<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${onlyCertificate ? "Акт выполненных работ" : "Счет на оплату"}</title>
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
  ${invoiceHtml}
  ${certificateHtml}
</body>

</html>
`;
};
