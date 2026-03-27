import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/database/mongo.config';
import { EventRegistration } from '@/models/EventRegistration';
import { sendRegistrationEmail } from '@/utils/mailer';

export async function POST(request: NextRequest) {
  try {
    const { email, registrationId } = await request.json();

    // Validate inputs
    if (!email || !registrationId) {
      return NextResponse.json(
        { message: 'Email and registration ID are required', status: 400 },
        { status: 400 }
      );
    }

    // Connect to database
    connect();

    // Fetch registration details
    const registration = await EventRegistration.findById(registrationId);
    
    if (!registration) {
      return NextResponse.json(
        { message: 'Registration not found', status: 404 },
        { status: 404 }
      );
    }

    if (String(email).trim().toLowerCase() !== String(registration.email).trim().toLowerCase()) {
      return NextResponse.json(
        {
          message: 'Receipt can only be sent to the email used during registration.',
          status: 403,
        },
        { status: 403 }
      );
    }

    // Send email with registration details
    try {
      const registrationObject = registration.toObject();

      if (registration.bulkGroupId) {
        const groupedRegistrations = await EventRegistration.find({
          bulkGroupId: registration.bulkGroupId,
        }).sort({ registeredAt: 1 });

        if (groupedRegistrations.length > 1) {
          const groupAnchor = groupedRegistrations[0];
          const receiptNumber = groupAnchor._id.toString().substring(0, 8);

          await sendRegistrationEmail({
            ...registrationObject,
            email,
            receiptNumber,
            registrations: groupedRegistrations.map((item) => ({
              ...item.toObject(),
              _id: item._id.toString(),
            })),
          });
        } else {
          const receiptNumber = registration._id.toString().substring(0, 8);
          await sendRegistrationEmail({
            ...registrationObject,
            email,
            receiptNumber,
            _id: registration._id.toString(),
          });
        }
      } else {
        const receiptNumber = registration._id.toString().substring(0, 8);
        await sendRegistrationEmail({
          ...registrationObject,
          email,
          receiptNumber,
          _id: registration._id.toString(),
        });
      }

      return NextResponse.json(
        { 
          message: 'Receipt email sent successfully', 
          status: 200,
          data: {
            email,
            registration
          }
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { message: 'Failed to send email receipt', status: 500 },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing email receipt request:', error);
    return NextResponse.json(
      { message: 'Error processing email receipt request', status: 500 },
      { status: 500 }
    );
  }
} 
