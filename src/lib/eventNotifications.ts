import { EventSubscription } from "@/models/EventSubscription";
import { sendEmail } from "@/config/mail";
import { getEventDateLabel } from "@/lib/events";

type EventNotificationPayload = {
  title: string;
  description: string;
  date: string | Date;
  endDate?: string | Date | null;
  time: string;
  location: string;
  googleMapLink?: string;
  contactDetails?: string;
};

export async function notifyEventSubscribers(event: EventNotificationPayload) {
  const subscribers = await EventSubscription.find({ isActive: true }).lean();

  if (!subscribers.length) {
    return { delivered: 0, total: 0 };
  }

  const eventDate = getEventDateLabel(event.date, event.endDate);
  const mapCta = event.googleMapLink
    ? `<p style="margin:16px 0 0;"><a href="${event.googleMapLink}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#a24a2f;color:#ffffff;text-decoration:none;font-weight:600;">Open location</a></p>`
    : "";

  const contactBlock = event.contactDetails
    ? `<p style="margin:18px 0 0;color:#6a5d57;font-size:14px;">Contact: ${event.contactDetails}</p>`
    : "";

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f8f3ee;padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eadfd5;border-radius:28px;padding:32px;">
        <p style="margin:0 0 10px;color:#8a6f61;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;">New Sahaja Yoga Event</p>
        <h1 style="margin:0;color:#2b2522;font-size:30px;line-height:1.15;">${event.title}</h1>
        <p style="margin:16px 0 0;color:#5f5550;font-size:16px;line-height:1.7;">${event.description}</p>
        <div style="margin-top:24px;padding:20px;border-radius:22px;background:#f9f5f1;border:1px solid #efe1d6;">
          <p style="margin:0 0 10px;color:#2b2522;font-size:15px;"><strong>Date:</strong> ${eventDate}</p>
          <p style="margin:0 0 10px;color:#2b2522;font-size:15px;"><strong>Time:</strong> ${event.time}</p>
          <p style="margin:0;color:#2b2522;font-size:15px;"><strong>Location:</strong> ${event.location}</p>
          ${contactBlock}
        </div>
        ${mapCta}
        <p style="margin:24px 0 0;color:#6a5d57;font-size:14px;line-height:1.6;">You are receiving this because you subscribed to future event updates on Sahaja Yoga Telangana.</p>
      </div>
    </div>
  `;

  const results = await Promise.allSettled(
    subscribers.map((subscriber) =>
      sendEmail(subscriber.email, `New Event: ${event.title}`, html)
    )
  );

  const delivered = results.filter((result) => result.status === "fulfilled").length;
  return { delivered, total: subscribers.length };
}
