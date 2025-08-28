import { z } from 'zod';

/**
 * Authentication validation schemas
 */

// Password requirements with comprehensive validation
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  .refine((password) => {
    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    return !weakPasswords.includes(password.toLowerCase());
  }, 'Password is too common. Please choose a stronger password')
  .refine((password) => {
    // Check for repeated characters
    const repeatedChars = /(.)\1{2,}/;
    return !repeatedChars.test(password);
  }, 'Password contains too many repeated characters');

// Email validation with UK-specific domains and comprehensive checks
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim()
  .min(5, 'Email address is too short')
  .max(254, 'Email address is too long')
  .refine((email) => {
    // Check for disposable email domains
    const disposableDomains = [
      'tempmail.org', 'guerrillamail.com', '10minutemail.com',
      'mailinator.com', 'yopmail.com', 'throwaway.email'
    ];
    const domain = email.split('@')[1];
    return domain ? !disposableDomains.includes(domain) : true;
  }, 'Please use a valid email address')
  .refine((email) => {
    // Check for valid email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, 'Please enter a valid email address');

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration schema
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
  marketingEmails: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Profile update schema
 */
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: emailSchema,
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  phone: z
    .string()
    .regex(/^(\+44|0)[1-9]\d{9,10}$/, 'Please enter a valid UK phone number')
    .optional()
    .or(z.literal('')),
  dateOfBirth: z.coerce.date().optional(),
  avatar: z.string().url().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
