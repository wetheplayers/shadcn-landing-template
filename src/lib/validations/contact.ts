import { z } from 'zod';

/**
 * Contact form validation schemas
 */

/**
 * Contact form schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  category: z.enum(['general', 'support', 'sales', 'feedback', 'bug']).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Newsletter subscription schema
 */
export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .optional(),
  preferences: z.object({
    newsletter: z.boolean().default(true),
    updates: z.boolean().default(false),
    promotions: z.boolean().default(false),
  }).optional(),
  gdprConsent: z
    .boolean()
    .refine((val) => val === true, 'You must consent to data processing'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

/**
 * Feedback form schema
 */
export const feedbackSchema = z.object({
  rating: z
    .number()
    .min(1, 'Please provide a rating')
    .max(5, 'Rating must be between 1 and 5'),
  category: z.enum(['ui', 'performance', 'features', 'documentation', 'other']),
  feedback: z
    .string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(500, 'Feedback must be less than 500 characters'),
  email: z.string().email('Please enter a valid email address').optional(),
  allowContact: z.boolean().default(false),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

/**
 * Support ticket schema
 */
export const supportTicketSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  category: z.enum([
    'account',
    'billing',
    'technical',
    'feature-request',
    'other',
  ]),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
        type: z.string(),
      })
    )
    .max(5, 'Maximum 5 attachments allowed')
    .optional(),
  email: z.string().email('Please enter a valid email address'),
  orderId: z.string().optional(),
});

export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
