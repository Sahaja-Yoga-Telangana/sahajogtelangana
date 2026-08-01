'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getEventDateLabel } from '@/lib/events';
import PaymentInfoCard from '@/components/events/PaymentInfoCard';
import { FiArrowLeft, FiCalendar, FiClock, FiExternalLink, FiMapPin, FiPhone } from 'react-icons/fi';
import LoadingSpinner from '@/components/LoadingSpinner';

type EventDetails = {
  _id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string | null;
  time: string;
  location: string;
  googleMapLink?: string;
  contactDetails?: string;
  priceBelow12?: number;
  price12To24?: number;
  price25AndAbove?: number;
  image?: string;
  qrImage?: string;
};

type Participant = {
  name: string;
  age: string;
  amountPaid: number;
};

type RegistrationResponse = {
  _id: string;
  name: string;
  eventTitle: string;
  age: number;
  amountPaid: number;
  state: string;
  city: string;
  email?: string;
  receiptNumber?: string;
  transactionNumber: string;
  createdAt: string;
}

export default function EventRegistration({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    city: '',
    age: '',
    email: '',
  });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isBulkRegistration, setIsBulkRegistration] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [participantErrors, setParticipantErrors] = useState<Record<number, Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptData, setReceiptData] = useState<RegistrationResponse | null>(null);
  const [bulkReceiptData, setBulkReceiptData] = useState<RegistrationResponse[] | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch event details
    const fetchEvent = async () => {
      try {
        setLoading(true);
        
        // Attempt to fetch from API
        try {
          const response = await axios.get(`/api/events/${params.id}`);
          if (response.data.status === 200) {
            setEvent(response.data.data);
          }
        } catch (error) {
          // If API fails, check if this is the sample event
          if (params.id === 'krishna-puja-2025') {
            setEvent({
              _id: 'krishna-puja-2025',
              title: 'Shri Krishna Puja 2025',
              description: 'Join us for the auspicious celebration of Shri Krishna Puja 2025. This three-day event will feature meditation, music, collective gatherings, and special pujas dedicated to Lord Krishna. All Sahaja Yogis and seekers are welcome to attend.',
              date: '2025-08-15T00:00:00.000Z',
              endDate: '2025-08-17T00:00:00.000Z',
              time: 'August 15-17, 9:00 AM - 7:00 PM',
              location: 'Hyderabad, Telangana',
              googleMapLink: 'https://maps.google.com/',
              contactDetails: 'Event coordination desk: +91 90000 00000',
              priceBelow12: 1000,
              price12To24: 1800,
              price25AndAbove: 2600,
              image: '/ShriMatajiKrishnaPuja.jpg',
              qrImage: '/assets/images/TrustPaymentQR.png',
            });
          } else {
            throw new Error('Event not found');
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id, router]);

  useEffect(() => {
    // Calculate total amount for all participants
    if (isBulkRegistration) {
      const total = participants.reduce((sum, participant) => {
        const amount = getAmountByAge(parseInt(participant.age));
        return sum + amount;
      }, 0);
      setTotalAmount(total);
    } else {
      const age = parseInt(formData.age);
      if (!isNaN(age)) {
        setTotalAmount(getAmountByAge(age));
      } else {
        setTotalAmount(0);
      }
    }
  }, [isBulkRegistration, participants, formData.age]);

  const getPricing = () => ({
    below12: event?.priceBelow12 ?? 1000,
    age12To24: event?.price12To24 ?? 1800,
    age25AndAbove: event?.price25AndAbove ?? 2600,
  });
  const isFreeEvent = (() => {
    const pricing = getPricing();
    return pricing.below12 === 0 && pricing.age12To24 === 0 && pricing.age25AndAbove === 0;
  })();

  const getAmountByAge = (age: number): number => {
    const pricing = getPricing();
    if (isNaN(age)) return 0;
    if (age < 12) return pricing.below12;
    if (age >= 12 && age < 25) return pricing.age12To24;
    return pricing.age25AndAbove;
  };

  const handleToggleRegistrationType = () => {
    setIsBulkRegistration(!isBulkRegistration);
    // Reset errors when switching registration types
    setErrors({});
    setParticipantErrors({});
  };

  const handleAddParticipant = () => {
    // Validate current form data before adding participant
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!participants.length && !formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!participants.length && !formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(parseInt(formData.age)) || parseInt(formData.age) <= 0) {
      newErrors.age = 'Please enter a valid age';
    }
    
    if (!participants.length && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!participants.length && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Calculate amount for this participant
    const age = parseInt(formData.age);
    const amount = getAmountByAge(age);
    
    // Add participant to the list
    const newParticipant: Participant = {
      name: formData.name,
      age: formData.age,
      amountPaid: amount
    };
    
    setParticipants([...participants, newParticipant]);
    
    // Keep shared details and clear only per-participant fields for the next entry.
    setFormData((prev) => ({
      ...prev,
      name: '',
      age: '',
    }));
    
    // Clear errors
    setErrors({});
  };

  const handleRemoveParticipant = (index: number) => {
    const updatedParticipants = [...participants];
    updatedParticipants.splice(index, 1);
    setParticipants(updatedParticipants);
    
    // Update participant errors
    const newParticipantErrors = { ...participantErrors };
    delete newParticipantErrors[index];
    
    // Reindex errors
    const reindexedErrors: Record<number, Record<string, string>> = {};
    Object.keys(newParticipantErrors).forEach((key) => {
      const keyNum = parseInt(key);
      if (keyNum > index) {
        reindexedErrors[keyNum - 1] = newParticipantErrors[keyNum];
      } else {
        reindexedErrors[keyNum] = newParticipantErrors[keyNum];
      }
    });
    
    setParticipantErrors(reindexedErrors);
  };

  const handleEditParticipant = (index: number) => {
    // Set form data to participant data for editing
    setFormData((prev) => ({
      ...prev,
      name: participants[index].name,
      age: participants[index].age,
    }));
    
    // Remove participant from list
    handleRemoveParticipant(index);
  };

  const handlePrintReceipt = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      
      // Reload the page to restore React state
      window.location.reload();
    }
  };

  const handleDownloadPDF = () => {
    if (isBulkRegistration && bulkReceiptData && bulkReceiptData.length > 0) {
      const firstRegistration = bulkReceiptData[0];
      const query = firstRegistration.transactionNumber
        ? `transactionNumber=${encodeURIComponent(firstRegistration.transactionNumber)}`
        : `registrationId=${encodeURIComponent(firstRegistration._id)}`;
      window.open(`/api/generate-pdf-receipt?${query}`, '_blank');
    } else if (receiptData) {
      window.open(`/api/generate-pdf-receipt?registrationId=${encodeURIComponent(receiptData._id)}`, '_blank');
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendEmail = async () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    setSendingEmail(true);
    setEmailError('');
    
    try {
      const anchorRegistrationId =
        isBulkRegistration && bulkReceiptData && bulkReceiptData.length > 0
          ? bulkReceiptData[0]._id
          : receiptData?._id;

      const response = await axios.post('/api/email-receipt', {
        email,
        registrationId: anchorRegistrationId,
        receiptNumber: isBulkRegistration
          ? bulkReceiptData?.[0]?.receiptNumber
          : receiptData?.receiptNumber,
        transactionNumber: isBulkRegistration
          ? bulkReceiptData?.[0]?.transactionNumber
          : receiptData?.transactionNumber,
      });
      
      if (response.data.status === 200) {
        setEmailSent(true);
      } else {
        setEmailError('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError('Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    if (isBulkRegistration) {
      // For bulk registration, validate transaction number and participants
      const newErrors: Record<string, string> = {};
      
      if (!isFreeEvent && !transactionNumber.trim()) {
        newErrors.transactionNumber = 'Transaction number is required';
      }
      
      if (participants.length === 0) {
        newErrors.participants = 'At least one participant is required';
      }

      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
      }

      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } else {
      // For individual registration
      const newErrors: Record<string, string> = {};
      
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.state.trim()) {
        newErrors.state = 'State is required';
      }
      
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      
      if (!formData.age.trim()) {
        newErrors.age = 'Age is required';
      } else if (isNaN(parseInt(formData.age)) || parseInt(formData.age) <= 0) {
        newErrors.age = 'Please enter a valid age';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      
      if (!isFreeEvent && !transactionNumber.trim()) {
        newErrors.transactionNumber = 'Transaction number is required';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      if (isBulkRegistration) {
        // Bulk registration
        const response = await axios.post('/api/event-registrations', {
          eventId: params.id,
          eventTitle: event?.title,
          transactionNumber,
          totalAmountPaid: totalAmount,
          sharedDetails: {
            state: formData.state,
            city: formData.city,
            email: formData.email,
          },
          participants: participants.map(p => ({
            name: p.name,
            age: parseInt(p.age)
          }))
        });
        
        if (response.data.status === 201) {
          setSuccessMessage('Bulk registration successful! Thank you for registering for the event.');
          // Store registration data for receipt
          setBulkReceiptData(response.data.data);
          setShowReceipt(true);
          
          // Send one grouped receipt email for the full bulk registration
          try {
            await axios.post('/api/email-receipt', {
              email: formData.email,
              registrationId: response.data.data[0]._id,
              receiptNumber: response.data.data[0].receiptNumber,
              transactionNumber: response.data.data[0].transactionNumber,
            });
          } catch (error) {
            console.error('Error sending email receipt:', error);
          }
          
          // Clear form
          setFormData({
            name: '',
            state: '',
            city: '',
            age: '',
            email: '',
          });
          setParticipants([]);
          setTransactionNumber('');
        } else {
          setErrorMessage('Failed to register. Please try again.');
        }
      } else {
        // Individual registration
        const response = await axios.post('/api/event-registrations', {
          eventId: params.id,
          eventTitle: event?.title,
          name: formData.name,
          state: formData.state,
          city: formData.city,
          age: parseInt(formData.age),
          email: formData.email,
          transactionNumber: isFreeEvent ? '' : transactionNumber,
          amountPaid: totalAmount
        });
        
        if (response.data.status === 201) {
          setSuccessMessage('Registration successful! Thank you for registering for the event.');
          // Store registration data for receipt
          setReceiptData(response.data.data);
          setShowReceipt(true);
          
          // Automatically send receipt to email
          try {
            await axios.post('/api/email-receipt', {
              email: formData.email,
              registrationId: response.data.data._id,
              receiptNumber: response.data.data.receiptNumber,
              transactionNumber: response.data.data.transactionNumber,
            });
            setEmailSent(true);
            setEmail(formData.email);
          } catch (error) {
            console.error('Error sending email receipt:', error);
          }
          
          // Clear form
          setFormData({
            name: '',
            state: '',
            city: '',
            age: '',
            email: '',
          });
          setTransactionNumber('');
        } else {
          setErrorMessage('Failed to register. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Error submitting registration:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred while submitting your registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[color:var(--success)]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-[color:var(--danger)]">Event not found</h1>
        <p className="mt-4">The event you are looking for does not exist or has been removed.</p>
        <Link href="/" className="mt-6 inline-block btn btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_65%,transparent),_transparent_32%),linear-gradient(180deg,_color-mix(in_srgb,var(--bg)_92%,white_8%),_var(--bg))]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--primary)] transition-colors hover:text-[color:var(--primary-600)]"
          >
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>
        </div>

        <section className="overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-soft">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[320px] overflow-hidden bg-[linear-gradient(160deg,_rgba(241,226,206,0.95),_rgba(246,241,234,0.85),_rgba(255,255,255,0.92))]">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.title}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/85 px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--primary)]">
                    Sahaja Yoga Event
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent lg:hidden" />
            </div>

            <div className="p-6 md:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">Event registration</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">{event.title}</h1>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">{event.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoPill icon={<FiCalendar className="h-4 w-4" />} label={getEventDateLabel(event.date, event.endDate)} numeric />
                <InfoPill icon={<FiClock className="h-4 w-4" />} label={event.time} numeric />
                <InfoPill icon={<FiMapPin className="h-4 w-4" />} label={event.location} className="sm:col-span-2" />
                {event.contactDetails ? (
                  <InfoPill icon={<FiPhone className="h-4 w-4" />} label={event.contactDetails} className="sm:col-span-2" numeric />
                ) : null}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {event.googleMapLink ? (
                  <a
                    href={event.googleMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[color:var(--primary-600)]"
                  >
                    Open in Google Maps
                    <FiExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                <a
                  href="#registration-form"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors duration-300 hover:bg-[color:var(--surface-2)]"
                >
                  Register Now
                </a>
              </div>

              {(event.googleMapLink || event.contactDetails) ? (
                <div className="mt-8 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-5">
                  <h2 className="text-lg font-semibold text-[color:var(--ink)]">Helpful details</h2>
                  <div className="mt-3 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
                    {event.googleMapLink ? <p>Use the map link for exact venue navigation before you travel.</p> : null}
                    {event.contactDetails ? <p>{event.contactDetails}</p> : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div id="registration-form" className="mt-8 overflow-hidden rounded-[28px] bg-[color:var(--surface)] shadow-soft">
        <div className="p-6">
          <h2 className="mb-6 text-center text-2xl font-bold text-[color:var(--ink)]">Register for the Event</h2>
          
          {successMessage && !showReceipt && (
            <div className="mb-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/85 px-4 py-3 text-[color:var(--primary)]">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-4 rounded-2xl border !border-[color:var(--danger)]/40 bg-red-500/10 px-4 py-3 text-[color:var(--danger)] ">
              {errorMessage}
            </div>
          )}
          
          {showReceipt && (receiptData || bulkReceiptData) ? (
            <div className="mb-8">
              <div className="mb-4 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/85 p-6 text-[color:var(--primary)]">
                <h3 className="mb-4 text-center text-xl font-bold text-[color:var(--primary)]">Registration Successful!</h3>
                <p className="mb-6 text-center text-[color:var(--muted)]">Your registration has been confirmed. Please keep this receipt for your records.</p>
                
                <div className="mb-4 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-6" ref={receiptRef}>
                  <div className="mb-6 flex flex-col gap-4 border-b border-[color:var(--border)] pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h4 className="text-xl font-bold text-[color:var(--ink)]">Sahaja Yoga Telangana</h4>
                      <p className="text-base text-[color:var(--muted)]">Event Registration Receipt</p>
                    </div>
                    <div className="rounded-[20px] bg-[color:var(--surface-2)]/80 px-4 py-3 text-left sm:text-right">
                      <p className="numeric-font text-base text-[color:var(--muted)]">Receipt #: {
                        bulkReceiptData 
                          ? bulkReceiptData[0]?._id.substring(0, 8) 
                          : receiptData?._id.substring(0, 8)
                      }</p>
                      <p className="numeric-font text-base text-[color:var(--muted)]">Date: {
                        // Safely format the date with a fallback
                        bulkReceiptData 
                          ? (bulkReceiptData[0]?.createdAt 
                            ? format(new Date(bulkReceiptData[0].createdAt), 'dd MMM yyyy') 
                            : new Date().toLocaleDateString())
                          : (receiptData?.createdAt 
                            ? format(new Date(receiptData.createdAt), 'dd MMM yyyy') 
                            : new Date().toLocaleDateString())
                      }</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 border-y border-[color:var(--border)] py-4">
                    <h5 className="mb-3 font-semibold text-[color:var(--ink)]">Event Details</h5>
                    <p className="font-medium text-[color:var(--ink)]">{
                      bulkReceiptData ? bulkReceiptData[0]?.eventTitle : receiptData?.eventTitle
                    }</p>
                    <p className="text-[color:var(--muted)]">{event?.location}</p>
                    <p className="text-[color:var(--muted)]">{getEventDateLabel(event?.date || '', event?.endDate)}</p>
                  </div>
                  
                  {/* Participant Information - Single Registration */}
                  {receiptData && !bulkReceiptData && (
                    <div className="mb-4">
                      <h5 className="mb-3 font-semibold text-[color:var(--ink)]">Participant Information</h5>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-base text-[color:var(--muted)]">Name:</p>
                          <p className="font-medium text-[color:var(--ink)]">{receiptData.name}</p>
                        </div>
                        <div>
                          <p className="text-base text-[color:var(--muted)]">Age:</p>
                          <p className="numeric-font font-medium text-[color:var(--ink)]">{receiptData.age} years</p>
                        </div>
                        <div>
                          <p className="text-base text-[color:var(--muted)]">Location:</p>
                          <p className="font-medium text-[color:var(--ink)]">{receiptData.city}, {receiptData.state}</p>
                        </div>
                        <div>
                          <p className="text-base text-[color:var(--muted)]">Receipt Number:</p>
                          <p className="numeric-font font-medium text-[color:var(--ink)]">{receiptData._id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Participant Information - Bulk Registration */}
                  {bulkReceiptData && (
                    <div className="mb-4">
                      <h5 className="mb-3 font-semibold text-[color:var(--ink)]">Participants Information</h5>
                      <div className="hidden overflow-x-auto sm:block">
                        <table className="min-w-full divide-y divide-[color:var(--border)]">
                          <thead className="bg-[color:var(--surface-2)]/80">
                            <tr>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Name</th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Age</th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Location</th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[color:var(--border)] bg-[color:var(--surface)]">
                            {bulkReceiptData.map((registration, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap text-base font-medium text-[color:var(--ink)]">
                                  {registration.name}
                                </td>
                                <td className="numeric-font px-3 py-2 whitespace-nowrap text-base text-[color:var(--muted)]">
                                  {registration.age} years
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-base text-[color:var(--muted)]">
                                  {registration.city}, {registration.state}
                                </td>
                                <td className="numeric-font px-3 py-2 whitespace-nowrap text-base text-[color:var(--muted)]">
                                  ₹{registration.amountPaid.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="space-y-3 sm:hidden">
                        {bulkReceiptData.map((registration, index) => (
                          <div key={index} className="rounded-[18px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-4">
                            <p className="font-semibold text-[color:var(--ink)]">{registration.name}</p>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                              <p className="text-[color:var(--muted)]">Age</p>
                              <p className="numeric-font text-right font-medium text-[color:var(--ink)]">{registration.age} years</p>
                              <p className="text-[color:var(--muted)]">Location</p>
                              <p className="text-right font-medium text-[color:var(--ink)]">{registration.city}, {registration.state}</p>
                              <p className="text-[color:var(--muted)]">Amount</p>
                              <p className="numeric-font text-right font-medium text-[color:var(--ink)]">₹{registration.amountPaid.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    {isFreeEvent ? (
                      <div className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/80 p-4">
                        <h5 className="mb-2 font-semibold text-[color:var(--ink)]">Free Entry</h5>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-base text-[color:var(--muted)]">Amount Paid:</p>
                            <p className="numeric-font font-medium text-[color:var(--ink)]">₹0</p>
                          </div>
                          <div>
                            <p className="text-base text-[color:var(--muted)]">Registration Type:</p>
                            <p className="font-medium text-[color:var(--primary)]">No payment required</p>
                          </div>
                          {bulkReceiptData && (
                            <div>
                              <p className="text-base text-[color:var(--muted)]">Participants:</p>
                              <p className="numeric-font font-medium text-[color:var(--ink)]">{bulkReceiptData.length}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <h5 className="mb-3 font-semibold text-[color:var(--ink)]">Payment Information</h5>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-base text-[color:var(--muted)]">Amount Paid:</p>
                            <p className="numeric-font font-medium text-[color:var(--ink)]">₹{
                              bulkReceiptData 
                                ? bulkReceiptData.reduce((sum, reg) => sum + reg.amountPaid, 0).toLocaleString() 
                                : receiptData?.amountPaid.toLocaleString()
                            }</p>
                          </div>
                          <div>
                            <p className="text-base text-[color:var(--muted)]">Transaction ID:</p>
                            <p className="numeric-font font-medium text-[color:var(--ink)]">{
                              bulkReceiptData ? bulkReceiptData[0]?.transactionNumber : receiptData?.transactionNumber
                            }</p>
                          </div>
                          <div>
                            <p className="text-base text-[color:var(--muted)]">Payment Status:</p>
                            <p className="font-medium text-[color:var(--primary)]">Confirmed</p>
                          </div>
                          {bulkReceiptData && (
                            <div>
                              <p className="text-base text-[color:var(--muted)]">Participants:</p>
                              <p className="numeric-font font-medium text-[color:var(--ink)]">{bulkReceiptData.length}</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-8 text-center text-base text-[color:var(--muted)]">
                    <p>Thank you for registering for the event!</p>
                    <p>For any inquiries, please contact us at info@sahajayogatelangana.org</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-center">
                  <button 
                    onClick={handlePrintReceipt} 
                    className="flex min-h-[48px] items-center justify-center rounded-full bg-[color:var(--primary)] px-4 py-3 font-bold text-white transition-colors duration-300 hover:bg-[color:var(--primary-600)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Receipt
                  </button>
                  
                  <button 
                    onClick={handleDownloadPDF} 
                    className="flex min-h-[48px] items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 font-bold text-[color:var(--ink)] transition-colors duration-300 hover:bg-[color:var(--surface-2)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </button>
                  
                  <div className="w-full lg:max-w-md">
                    <div className="flex flex-col sm:flex-row">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError('');
                        }}
                        className={`min-h-[48px] flex-1 rounded-t-xl border bg-[color:var(--surface)] p-3 text-[color:var(--ink)] sm:rounded-l-xl sm:rounded-tr-none ${emailError ? '!border-[color:var(--danger)]' : 'border-[color:var(--border)]'}`}
                      />
                      <button
                        onClick={handleSendEmail}
                        disabled={sendingEmail || emailSent}
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-b-xl bg-[color:var(--primary)] px-4 py-3 font-bold text-white transition-colors duration-300 hover:bg-[color:var(--primary-600)] disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-b-none sm:rounded-r-xl"
                      >
                        {sendingEmail && <LoadingSpinner />}
                        {sendingEmail ? 'Sending...' : emailSent ? 'Sent!' : 'Email Receipt'}
                      </button>
                    </div>
                    {emailError && <p className="text-[color:var(--danger)] text-base mt-1">{emailError}</p>}
                    {emailSent && <p className="mt-1 text-base text-[color:var(--primary)]">Receipt has been sent to your email!</p>}
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <Link href="/" className="text-[color:var(--primary)] hover:underline">
                    Return to Home
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8 flex justify-center">
                <div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)]/80 p-1">
                <button
                  type="button"
                  onClick={() => setIsBulkRegistration(false)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${!isBulkRegistration 
                    ? 'bg-[color:var(--primary)] text-white shadow-sm' 
                    : 'text-[color:var(--muted)] hover:text-[color:var(--ink)]'}`}
                >
                  Individual Registration
                </button>
                <button
                  type="button"
                  onClick={() => setIsBulkRegistration(true)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${isBulkRegistration 
                    ? 'bg-[color:var(--primary)] text-white shadow-sm' 
                    : 'text-[color:var(--muted)] hover:text-[color:var(--ink)]'}`}
                >
                  Bulk Registration
                </button>
                </div>
              </div>
              
              <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                <div>
                  <form onSubmit={handleSubmit}>
                    {isBulkRegistration && (
                      <div className="mb-5 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/75 p-5">
                        <h3 className="font-medium text-[color:var(--primary)]">Bulk Registration</h3>
                        <p className="mt-2 text-base text-[color:var(--muted)]">
                          Register multiple participants with a single payment. Shared contact details entered once below will be used for every participant.
                        </p>
                      </div>
                    )}
                    
                    {isBulkRegistration ? (
                      <div className="mb-5 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/65 p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Shared details</h3>
                        <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                          These details apply to all entries in this bulk registration.
                        </p>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label htmlFor="state" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">State *</label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className={`admin-input ${errors.state ? '!border-[color:var(--danger)]' : ''}`}
                              placeholder="Your state"
                            />
                            {errors.state && <p className="text-[color:var(--danger)] text-base mt-1">{errors.state}</p>}
                          </div>
                          
                          <div>
                            <label htmlFor="city" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">City *</label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className={`admin-input ${errors.city ? '!border-[color:var(--danger)]' : ''}`}
                              placeholder="Your city"
                            />
                            {errors.city && <p className="text-[color:var(--danger)] text-base mt-1">{errors.city}</p>}
                          </div>
                        </div>

                        <div className="mt-4">
                          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">Email *</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`admin-input ${errors.email ? '!border-[color:var(--danger)]' : ''}`}
                            placeholder="Enter your email"
                          />
                          {errors.email && <p className="text-[color:var(--danger)] text-base mt-1">{errors.email}</p>}
                        </div>
                      </div>
                    ) : null}

                    <div className="mb-5">
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">
                        {isBulkRegistration ? 'Participant Name *' : 'Name *'}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`admin-input ${errors.name ? '!border-[color:var(--danger)]' : ''}`}
                        placeholder="Enter full name"
                      />
                      {errors.name && <p className="text-[color:var(--danger)] text-base mt-1">{errors.name}</p>}
                    </div>
                    
                    {!isBulkRegistration ? (
                      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="state" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">State *</label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className={`admin-input ${errors.state ? '!border-[color:var(--danger)]' : ''}`}
                            placeholder="Your state"
                          />
                          {errors.state && <p className="text-[color:var(--danger)] text-base mt-1">{errors.state}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="city" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">City *</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`admin-input ${errors.city ? '!border-[color:var(--danger)]' : ''}`}
                            placeholder="Your city"
                          />
                          {errors.city && <p className="text-[color:var(--danger)] text-base mt-1">{errors.city}</p>}
                        </div>
                      </div>
                    ) : null}
                    
                    <div className="mb-5">
                      <label htmlFor="age" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">Age *</label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className={`admin-input ${errors.age ? '!border-[color:var(--danger)]' : ''}`}
                        placeholder="Age"
                        min="1"
                      />
                      {errors.age && <p className="text-[color:var(--danger)] text-base mt-1">{errors.age}</p>}
                    </div>
                    
                    {!isBulkRegistration ? (
                      <div className="mb-5">
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`admin-input ${errors.email ? '!border-[color:var(--danger)]' : ''}`}
                          placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-[color:var(--danger)] text-base mt-1">{errors.email}</p>}
                      </div>
                    ) : null}
                    
                    {isBulkRegistration && (
                      <div className="mb-5">
                        <button
                          type="button"
                          onClick={handleAddParticipant}
                          className="inline-flex items-center rounded-full bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[color:var(--primary-600)]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Participant
                        </button>
                      </div>
                    )}
                    
                    {isBulkRegistration && participants.length > 0 && (
                      <div className="mb-6">
                        <h3 className="mb-3 text-base font-semibold text-[color:var(--ink)]">Added Participants</h3>
                        <div className="overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)]">
                          <table className="min-w-full divide-y divide-[color:var(--border)]">
                            <thead className="bg-[color:var(--surface-2)]/80">
                              <tr>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Name</th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Age</th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Amount</th>
                                <th scope="col" className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[color:var(--border)] bg-[color:var(--surface)]">
                              {participants.map((participant, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 whitespace-nowrap text-base">
                                    <div className="font-medium text-[color:var(--ink)]">{participant.name}</div>
                                    <div className="text-xs text-[color:var(--muted)]">{formData.city}, {formData.state}</div>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-base text-[color:var(--muted)]">{participant.age}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-base text-[color:var(--muted)]">₹{participant.amountPaid.toLocaleString()}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-right text-base font-medium">
                                    <button
                                      type="button"
                                      onClick={() => handleEditParticipant(index)}
                                      className="mr-3 text-[color:var(--primary)] hover:text-[color:var(--primary-600)]"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveParticipant(index)}
                                      className="text-[color:var(--danger)] hover:text-red-800"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {errors.participants && (
                          <p className="text-[color:var(--danger)] text-base mt-1">{errors.participants}</p>
                        )}
                      </div>
                    )}
                    
                    {totalAmount > 0 && (
                      <div className="mb-5 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/80 p-5">
                        <p className="font-medium text-[color:var(--primary)]">
                          {isBulkRegistration 
                            ? `Total Registration Fee: ₹${totalAmount.toLocaleString()}`
                            : `Registration Fee: ₹${totalAmount.toLocaleString()}`
                          }
                        </p>
                        <p className="mt-1 text-base text-[color:var(--muted)]">
                          Amount is based on age:
                          <br />
                          - Below 12 years: ₹{getPricing().below12.toLocaleString()}
                          <br />
                          - 12 to 24 years: ₹{getPricing().age12To24.toLocaleString()}
                          <br />
                          - 25 years and above: ₹{getPricing().age25AndAbove.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {!isFreeEvent ? (
                      <div className="mb-5">
                        <label htmlFor="transactionNumber" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">
                          Transaction ID / UPI Transaction ID *
                        </label>
                        <input
                          type="text"
                          id="transactionNumber"
                          name="transactionNumber"
                          value={transactionNumber}
                          onChange={(e) => {
                            setTransactionNumber(e.target.value);
                            if (errors.transactionNumber) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.transactionNumber;
                                return newErrors;
                              });
                            }
                          }}
                          className={`admin-input ${errors.transactionNumber ? '!border-[color:var(--danger)]' : ''}`}
                          placeholder="Enter payment transaction ID"
                        />
                        {errors.transactionNumber && (
                          <p className="text-[color:var(--danger)] text-base mt-1">{errors.transactionNumber}</p>
                        )}
                      </div>
                    ) : (
                      <div className="mb-5 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/75 p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">Free Event</p>
                        <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">
                          Registration is free for all categories. No payment reference is required.
                        </p>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[color:var(--primary-600)] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={submitting || (isBulkRegistration && participants.length === 0)}
                    >
                      {submitting && <LoadingSpinner />}
                      {submitting ? 'Registering...' : 'Register for Event'}
                    </button>
                  </form>
                </div>
                
                <div className="space-y-6">
                  {!isFreeEvent ? (
                    <div className="rounded-[24px] border border-[color:var(--border)] bg-[linear-gradient(180deg,_color-mix(in_srgb,var(--surface)_94%,transparent),_color-mix(in_srgb,var(--surface-2)_88%,transparent))] p-5 shadow-sm">
                      <h3 className="text-xl font-semibold text-[color:var(--ink)]">Registration price chart</h3>
                      <div className="mt-4 space-y-3">
                        <PricingRow label="Below 12 years" value={getPricing().below12} />
                        <PricingRow label="12 to 24 years" value={getPricing().age12To24} />
                        <PricingRow label="25 years and above" value={getPricing().age25AndAbove} />
                      </div>
                      <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                        The final amount is calculated automatically based on the age entered for each participant.
                      </p>
                    </div>
                  ) : null}

                  {!isFreeEvent ? <PaymentInfoCard isBulkRegistration={isBulkRegistration} qrImage={event?.qrImage} /> : null}
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

function InfoPill({
  icon,
  label,
  className = '',
  numeric = false,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
  numeric?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/65 px-4 py-3 ${className}`}>
      <span className="mt-0.5 text-[color:var(--primary)]">{icon}</span>
      <span className={`text-sm leading-6 text-[color:var(--ink)] ${numeric ? 'numeric-font' : ''}`}>{label}</span>
    </div>
  );
}

function PricingRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/78 px-4 py-3">
      <span className="text-sm font-medium text-[color:var(--ink)]">{label}</span>
      <span className="numeric-font text-sm font-semibold text-[color:var(--primary)]">₹{value.toLocaleString()}</span>
    </div>
  );
}
