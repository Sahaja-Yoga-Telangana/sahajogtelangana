import { format } from 'date-fns';
import { sendEmail } from '@/config/mail';

interface RegistrationRecord {
  _id?: string;
  name: string;
  eventTitle: string;
  age: number;
  amountPaid: number;
  state: string;
  city: string;
  transactionNumber: string;
  createdAt?: string;
  registeredAt?: string;
}

interface RegistrationEmailData extends RegistrationRecord {
  email: string;
  receiptNumber?: string;
  registrations?: RegistrationRecord[];
}

export async function sendRegistrationEmail(data: RegistrationEmailData) {
  const records = data.registrations && data.registrations.length > 0 ? data.registrations : [data];
  const primaryRecord = records[0];
  const receiptNumber = data.receiptNumber || primaryRecord._id?.substring(0, 8) || 'N/A';
  const receiptDateValue = primaryRecord.createdAt || primaryRecord.registeredAt;
  const formattedDate = receiptDateValue
    ? format(new Date(receiptDateValue), 'dd MMM yyyy')
    : format(new Date(), 'dd MMM yyyy');
  const isBulk = records.length > 1;
  const totalAmount = records.reduce((sum, record) => sum + (record.amountPaid || 0), 0);

  const participantSection = isBulk
    ? `
      <div class="section">
        <h3>Participants Information</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Location</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${records
              .map(
                (record) => `
                  <tr>
                    <td>${record.name}</td>
                    <td>${record.age} years</td>
                    <td>${record.city}, ${record.state}</td>
                    <td>₹${record.amountPaid.toLocaleString()}</td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `
    : `
      <div class="section">
        <h3>Participant Information</h3>
        <p><strong>Name:</strong> ${primaryRecord.name}</p>
        <p><strong>Age:</strong> ${primaryRecord.age} years</p>
        <p><strong>Location:</strong> ${primaryRecord.city}, ${primaryRecord.state}</p>
      </div>
    `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .receipt { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        .section { margin-bottom: 20px; }
        .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
        .amount { color: #2F855A; font-weight: bold; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
        .table th { background: #f7f3ef; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Sahaja Yoga Telangana</h2>
          <p>Event Registration Receipt</p>
        </div>
        
        <div class="receipt">
          <div class="section">
            <p><strong>Receipt #:</strong> ${receiptNumber}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
          </div>
          
          <div class="section">
            <h3>Event Details</h3>
            <p><strong>${primaryRecord.eventTitle}</strong></p>
          </div>
          
          ${participantSection}
          
          <div class="section">
            <h3>Payment Information</h3>
            <p><strong>Amount Paid:</strong> <span class="amount">₹${totalAmount.toLocaleString()}</span></p>
            <p><strong>Transaction ID:</strong> ${primaryRecord.transactionNumber || '-'}</p>
            <p><strong>Payment Status:</strong> <span style="color: #2F855A;">Confirmed</span></p>
            ${isBulk ? `<p><strong>Participants:</strong> ${records.length}</p>` : ''}
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for registering for the event!</p>
          <p>For any inquiries, please contact us at info@sahajayogatelangana.org</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const messageId = await sendEmail(
    data.email,
    `Registration Confirmation - ${primaryRecord.eventTitle}`,
    htmlContent
  );

  return { messageId };
}
