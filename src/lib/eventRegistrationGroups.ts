type RegistrationRecord = {
  _id: { toString(): string } | string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  state: string;
  city: string;
  age: number;
  amountPaid: number;
  transactionNumber?: string;
  bulkGroupId?: string;
  receiptNumber?: string;
  registeredAt?: Date | string;
};

export type ReceiptGroup = {
  receiptNumber: string;
  anchorRegistrationId: string;
  bulkGroupId: string;
  eventId: string;
  eventTitle: string;
  email: string;
  transactionNumber: string;
  totalAmount: number;
  participantCount: number;
  registeredAt: string;
  city: string;
  state: string;
  paymentState: "free" | "paid" | "pending";
  members: Array<{
    _id: string;
    name: string;
    age: number;
    city: string;
    state: string;
    amountPaid: number;
    email: string;
    registeredAt: string;
  }>;
};

function normalizeDate(value?: string | Date) {
  if (!value) {
    return new Date(0);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

export function getRegistrationReceiptNumber(record: RegistrationRecord) {
  if (record.receiptNumber) {
    return record.receiptNumber;
  }

  return String(record._id).substring(0, 8);
}

export function groupRegistrationsByReceipt(records: RegistrationRecord[]) {
  const buckets = new Map<string, RegistrationRecord[]>();

  for (const record of records) {
    const key = record.bulkGroupId || getRegistrationReceiptNumber(record);
    const current = buckets.get(key) || [];
    current.push(record);
    buckets.set(key, current);
  }

  const groups: ReceiptGroup[] = Array.from(buckets.values()).map((members) => {
    const sortedMembers = members.sort((a, b) => normalizeDate(a.registeredAt).getTime() - normalizeDate(b.registeredAt).getTime());
    const anchor = sortedMembers[0];
    const receiptNumber = getRegistrationReceiptNumber(anchor);
    const totalAmount = sortedMembers.reduce((sum, entry) => sum + (entry.amountPaid || 0), 0);
    const transactionNumber = anchor.transactionNumber || "";

    return {
      receiptNumber,
      anchorRegistrationId: String(anchor._id),
      bulkGroupId: anchor.bulkGroupId || "",
      eventId: anchor.eventId,
      eventTitle: anchor.eventTitle,
      email: anchor.email,
      transactionNumber,
      totalAmount,
      participantCount: sortedMembers.length,
      registeredAt: normalizeDate(anchor.registeredAt).toISOString(),
      city: anchor.city,
      state: anchor.state,
      paymentState: totalAmount === 0 ? "free" : transactionNumber ? "paid" : "pending",
      members: sortedMembers.map((entry) => ({
        _id: String(entry._id),
        name: entry.name,
        age: entry.age,
        city: entry.city,
        state: entry.state,
        amountPaid: entry.amountPaid,
        email: entry.email,
        registeredAt: normalizeDate(entry.registeredAt).toISOString(),
      })),
    };
  });

  return groups.sort((a, b) => normalizeDate(b.registeredAt).getTime() - normalizeDate(a.registeredAt).getTime());
}

export function resolveRegistrationGroupingKey(record: RegistrationRecord) {
  if (record.bulkGroupId) {
    return { field: "bulkGroupId", value: record.bulkGroupId };
  }

  if (record.receiptNumber) {
    return { field: "receiptNumber", value: record.receiptNumber };
  }

  if (record.transactionNumber) {
    return { field: "transactionNumber", value: record.transactionNumber };
  }

  return { field: "_id", value: String(record._id) };
}
