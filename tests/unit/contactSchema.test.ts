import { describe, it, expect } from 'vitest';
import vine from '@vinejs/vine';
import { contactSchema } from '@/validator/authValidationSchema';
import ErrorReporter from '@/validator/ErrorReporter';

describe('Contact Schema Validation Unit Tests', () => {
  it('should validate successfully with a valid contact payload', async () => {
    const validPayload = {
      name: 'Shri Mataji',
      email: 'contact@sahajayoga.org',
      phoneNumber: '9876543210',
      message: 'Interested in learning meditation at the center.',
    };

    const validator = vine.compile(contactSchema);
    const result = await validator.validate(validPayload);

    expect(result.name).toBe(validPayload.name);
    expect(result.email).toBe(validPayload.email);
    expect(result.phoneNumber).toBe(validPayload.phoneNumber);
    expect(result.message).toBe(validPayload.message);
  });

  it('should fail validation and throw validation error when email format is invalid', async () => {
    const invalidPayload = {
      name: 'John Doe',
      email: 'invalid-email-format',
      phoneNumber: '1234567890',
      message: 'Hello there!',
    };

    vine.errorReporter = () => new ErrorReporter();
    const validator = vine.compile(contactSchema);

    await expect(validator.validate(invalidPayload)).rejects.toThrow();
  });

  it('should fail validation when name is too short', async () => {
    const invalidPayload = {
      name: 'A', // minLength is 2
      email: 'john@example.com',
      phoneNumber: '1234567890',
      message: 'Hello there!',
    };

    vine.errorReporter = () => new ErrorReporter();
    const validator = vine.compile(contactSchema);

    await expect(validator.validate(invalidPayload)).rejects.toThrow();
  });

  it('should fail validation when phone number does not match regex', async () => {
    const invalidPayload = {
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '12345', // regex: ^\+?[\d\s]{10,15}$ (too short)
      message: 'Hello there!',
    };

    vine.errorReporter = () => new ErrorReporter();
    const validator = vine.compile(contactSchema);

    await expect(validator.validate(invalidPayload)).rejects.toThrow();
  });
});
