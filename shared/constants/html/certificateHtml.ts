import { formatCurrency, formatDate } from "@/shared/lib/utils/formaters";
import { ContractorDetails, Invoice } from "@/types/main";

export const certificateHtml = (
  onlyCertificate: boolean,
  invoice: Invoice,
  contractorDetails: ContractorDetails
) => {
  return onlyCertificate
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
            <p><span class="label">Организация:</span> ${contractorDetails.name || ""}</p>
            <p><span class="label">Инн:</span> ${contractorDetails.inn || ""}</p>
            <p><span class="label">Адрес:</span> ${contractorDetails.address || ""}</p>
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
        `
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
        <p style="font-size: 11px; color: #666;">
          ${invoice.invoiceDetails.client.type === "fz" ? "Физическое лицо" : "Юридическое лицо"}
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
};
