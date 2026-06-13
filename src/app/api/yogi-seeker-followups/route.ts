import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/database/mongo.config';
import { getRequiredSession } from '@/lib/auth';
import { Seeker } from '@/models/Seeker';
import { VolunteerProfile } from '@/models/VolunteerProfile';

export const dynamic = 'force-dynamic';

type FollowUpVolunteer = {
  name: string;
  roles?: string[];
  staffingFocus?: string;
  isActive?: boolean;
};

function hasFollowUpAccess(volunteer: any) {
  const roles = Array.isArray(volunteer?.roles) ? volunteer.roles : [];
  const values = [...roles, volunteer?.staffingFocus || ''].map((value) => String(value).toLowerCase());
  return volunteer?.isActive !== false && values.some((value) => value.includes('follow'));
}

async function getVolunteer(): Promise<{ session: any; volunteer: FollowUpVolunteer | null }> {
  const session = await getRequiredSession();
  if (!session?.user?.email) {
    return { session, volunteer: null };
  }

  await connect();
  const volunteer = await VolunteerProfile.findOne({
    email: String(session.user.email).trim().toLowerCase(),
    isActive: { $ne: false },
  }).lean<FollowUpVolunteer | null>();

  return { session, volunteer };
}

function seekerProjection() {
  return {
    name: 1,
    city: 1,
    phone: 1,
    email: 1,
    addedBy: 1,
    addedAt: 1,
    followUpStatus: 1,
    assignedVolunteer: 1,
    volunteerFollowUpCompletedAt: 1,
    volunteerFollowUpCompletedBy: 1,
    lastContactDate: 1,
    source: 1,
    eventInterest: 1,
    centerInterest: 1,
    preferredLanguage: 1,
    notes: 1,
  };
}

export async function GET() {
  try {
    const { volunteer } = await getVolunteer();

    if (!volunteer || !hasFollowUpAccess(volunteer)) {
      return NextResponse.json(
        { error: 'You need an approved Follow-up volunteer profile to access seeker batches.' },
        { status: 403 }
      );
    }

    const seekers = await Seeker.find({
      assignedVolunteer: volunteer.name,
      $or: [{ volunteerFollowUpCompletedAt: { $exists: false } }, { volunteerFollowUpCompletedAt: null }],
    }, seekerProjection()).sort({ addedAt: 1 }).limit(12).lean();

    return NextResponse.json({ data: seekers }, { status: 200 });
  } catch (error) {
    console.error('Failed to load seeker follow-ups:', error);
    return NextResponse.json({ error: 'Failed to load seeker follow-ups.' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { volunteer } = await getVolunteer();

    if (!volunteer || !hasFollowUpAccess(volunteer)) {
      return NextResponse.json(
        { error: 'You need an approved Follow-up volunteer profile to claim seeker batches.' },
        { status: 403 }
      );
    }

    const activeCount = await Seeker.countDocuments({
      assignedVolunteer: volunteer.name,
      $or: [{ volunteerFollowUpCompletedAt: { $exists: false } }, { volunteerFollowUpCompletedAt: null }],
    });

    if (activeCount > 0) {
      const seekers = await Seeker.find({
        assignedVolunteer: volunteer.name,
        $or: [{ volunteerFollowUpCompletedAt: { $exists: false } }, { volunteerFollowUpCompletedAt: null }],
      }, seekerProjection()).sort({ addedAt: 1 }).limit(12).lean();

      return NextResponse.json(
        { data: seekers, claimed: 0, message: 'Please complete your current seeker batch before fetching another one.' },
        { status: 200 }
      );
    }

    const claimedIds = [];

    for (let index = 0; index < 4; index += 1) {
      const seeker = await Seeker.findOneAndUpdate(
        {
          $or: [{ assignedVolunteer: '' }, { assignedVolunteer: { $exists: false } }],
          followUpStatus: { $in: ['New', '', null] },
        },
        {
          $set: {
            assignedVolunteer: volunteer.name,
            followUpStatus: 'New',
          },
          $unset: {
            volunteerFollowUpCompletedAt: '',
            volunteerFollowUpCompletedBy: '',
          },
        },
        { sort: { addedAt: 1 }, new: true, projection: { _id: 1 } }
      );

      if (!seeker) break;
      claimedIds.push(seeker._id);
    }

    const seekers = await Seeker.find({
      assignedVolunteer: volunteer.name,
      $or: [{ volunteerFollowUpCompletedAt: { $exists: false } }, { volunteerFollowUpCompletedAt: null }],
    }, seekerProjection()).sort({ addedAt: 1 }).limit(12).lean();

    return NextResponse.json({ data: seekers, claimed: claimedIds.length }, { status: 200 });
  } catch (error) {
    console.error('Failed to claim seeker batch:', error);
    return NextResponse.json({ error: 'Failed to claim seeker batch.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { volunteer } = await getVolunteer();

    if (!volunteer || !hasFollowUpAccess(volunteer)) {
      return NextResponse.json(
        { error: 'You need an approved Follow-up volunteer profile to update seekers.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const seekerId = String(body.seekerId || '').trim();

    if (!seekerId) {
      return NextResponse.json({ error: 'Seeker ID is required.' }, { status: 400 });
    }

    const update = {
      followUpStatus: String(body.followUpStatus || 'New').trim(),
      lastContactDate: body.lastContactDate ? new Date(body.lastContactDate) : undefined,
      preferredLanguage: String(body.preferredLanguage || 'English').trim(),
      eventInterest: String(body.eventInterest || '').trim(),
      centerInterest: String(body.centerInterest || '').trim(),
      notes: String(body.notes || '').trim(),
      volunteerFollowUpCompletedAt: new Date(),
      volunteerFollowUpCompletedBy: volunteer.name,
    };

    const seeker = await Seeker.findOneAndUpdate(
      {
        _id: seekerId,
        assignedVolunteer: volunteer.name,
        $or: [{ volunteerFollowUpCompletedAt: { $exists: false } }, { volunteerFollowUpCompletedAt: null }],
      },
      { $set: update },
      { new: true, projection: seekerProjection() }
    );

    if (!seeker) {
      return NextResponse.json({ error: 'Seeker not found in your assigned batch.' }, { status: 404 });
    }

    return NextResponse.json({ data: seeker }, { status: 200 });
  } catch (error) {
    console.error('Failed to update seeker follow-up:', error);
    return NextResponse.json({ error: 'Failed to update seeker follow-up.' }, { status: 500 });
  }
}
