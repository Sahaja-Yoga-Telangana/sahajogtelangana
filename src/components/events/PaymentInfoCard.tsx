import Image from 'next/image';

export default function PaymentInfoCard({
  isBulkRegistration,
  qrImage,
}: {
  isBulkRegistration: boolean;
  qrImage?: string;
}) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
      <h3 className="mb-4 text-center text-xl font-semibold text-[color:var(--ink)]">Payment Information</h3>
      <p className="mb-4 text-center text-[color:var(--muted)]">Please scan the QR code to make the payment</p>

      <div className="mb-4 flex justify-center">
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
          <Image
            src={qrImage || '/assets/images/TrustPaymentQR.png'}
            alt="Payment QR Code"
            width={384}
            height={384}
            className="h-96 w-96 object-contain"
            unoptimized={!!qrImage && /^https?:\/\//.test(qrImage)}
          />
        </div>
      </div>

      <div className="space-y-2 text-base text-[color:var(--muted)]">
        <p className="text-center font-medium text-[color:var(--ink)]">Please complete the payment before submitting the form</p>
        <p>1. Scan the QR code using any UPI app (GooglePay, PhonePe, Paytm, etc.)</p>
        <p>2. Pay the registration fee amount {isBulkRegistration ? 'for all participants' : 'based on your category'}</p>
        <p>3. Submit the registration form after payment</p>
      </div>

      <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/85 p-4">
        <h4 className="mb-2 text-center font-medium text-[color:var(--primary)]">Bank Transfer Details</h4>
        <div className="space-y-1 text-base text-[color:var(--muted)]">
          <p className="font-medium">A/C Name: H H Shri Mataji Nirmala Devi Sahaja Yoga Trust, Hyderabad</p>
          <p>Account Number: 104010100131605</p>
          <p>Bank Name: Axis Bank</p>
          <p>Branch: Road No 12, Banjara Hills, Hyderabad</p>
          <p>IFSC Code: UTIB0001798</p>
          <p>MICR Code: 500211047</p>
          <p>Swift Code: AXISINBB</p>
        </div>
      </div>
    </div>
  );
}
