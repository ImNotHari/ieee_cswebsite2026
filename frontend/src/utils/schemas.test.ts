import { describe, it, expect } from 'vitest';
import { eventSchema } from './schemas';

describe('eventSchema validation', () => {
  it('should pass with a valid payload', () => {
    const validData = {
      title: 'Valid Event',
      date: '2026-10-10',
      time: '14:30',
      location: 'Test Loc',
      description: 'Test Desc'
    };
    const result = eventSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if missing required fields', () => {
    const invalidData = { location: 'Test Loc' };
    const result = eventSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail if date is incorrectly formatted', () => {
    const invalidData = {
      title: 'Valid Event',
      date: '10-10-2026', // wrong format
      time: '14:30',
    };
    const result = eventSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail if time is incorrectly formatted', () => {
    const invalidData = {
      title: 'Valid Event',
      date: '2026-10-10',
      time: '2 PM', // wrong format
    };
    const result = eventSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject unknown fields (e.g. poster_path) due to .strict()', () => {
    const invalidData = {
      title: 'Valid Event',
      date: '2026-10-10',
      time: '14:30',
      poster_path: 'https://example.com/image.png' // Should be rejected
    };
    const result = eventSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
