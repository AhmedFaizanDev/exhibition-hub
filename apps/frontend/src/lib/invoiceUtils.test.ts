import { describe, it, expect } from 'vitest';
import { generateInvoiceNumber, numberToWords } from './invoiceUtils';
import { Payment } from '@/types/database';

describe('generateInvoiceNumber', () => {
  it('should return CC/001 when no existing payments', () => {
    expect(generateInvoiceNumber([])).toBe('CC/001');
  });

  it('should return CC/001 when existing payments is null', () => {
    // @ts-ignore
    expect(generateInvoiceNumber(null)).toBe('CC/001');
  });

  it('should return CC/001 when existing payments is undefined', () => {
    // @ts-ignore
    expect(generateInvoiceNumber(undefined)).toBe('CC/001');
  });

  it('should handle sequential invoice numbers in CC/xxx format', () => {
    const payments = [
      { invoice_number: 'CC/001' },
      { invoice_number: 'CC/002' }
    ] as any as Payment[];
    expect(generateInvoiceNumber(payments)).toBe('CC/003');
  });

  it('should handle sequential invoice numbers in CCxxx format', () => {
    const payments = [
      { invoice_number: 'CC001' },
      { invoice_number: 'CC002' }
    ] as any as Payment[];
    expect(generateInvoiceNumber(payments)).toBe('CC/003');
  });

  it('should handle mixed formats and out-of-order numbers', () => {
    const payments = [
      { invoice_number: 'CC/005' },
      { invoice_number: 'CC002' },
      { invoice_number: 'CC/001' }
    ] as any as Payment[];
    expect(generateInvoiceNumber(payments)).toBe('CC/006');
  });

  it('should handle payments without invoice numbers', () => {
    const payments = [
      { invoice_number: 'CC/001' },
      { amount: 1000 } // no invoice_number
    ] as any as Payment[];
    expect(generateInvoiceNumber(payments)).toBe('CC/002');
  });

  it('should ignore invalid invoice number formats', () => {
    const payments = [
      { invoice_number: 'INV-123' },
      { invoice_number: 'ABC/001' }
    ] as any as Payment[];
    expect(generateInvoiceNumber(payments)).toBe('CC/001');
  });

  it('should pad the next number to at least 3 digits', () => {
    const payments = [
      { invoice_number: 'CC/099' }
    ] as any as Payment[];
    expect(generateInvoiceNumber(payments)).toBe('CC/100');
  });

  it('should handle large invoice numbers', () => {
    const payments = [
      { invoice_number: 'CC/999' }
    ] as any as Payment[];
    expect(generateInvoiceNumber(payments)).toBe('CC/1000');
  });
});

describe('numberToWords', () => {
  it('should handle zero', () => {
    expect(numberToWords(0)).toBe('INR Zero Only');
  });

  it('should handle single digits', () => {
    expect(numberToWords(5)).toBe('INR Five Only');
  });

  it('should handle teens', () => {
    expect(numberToWords(13)).toBe('INR Thirteen Only');
    expect(numberToWords(19)).toBe('INR Nineteen Only');
  });

  it('should handle tens', () => {
    expect(numberToWords(20)).toBe('INR Twenty Only');
    expect(numberToWords(42)).toBe('INR Forty Two Only');
  });

  it('should handle hundreds', () => {
    expect(numberToWords(100)).toBe('INR One Hundred Only');
    expect(numberToWords(505)).toBe('INR Five Hundred Five Only');
    expect(numberToWords(999)).toBe('INR Nine Hundred Ninety Nine Only');
  });

  it('should handle thousands', () => {
    expect(numberToWords(1000)).toBe('INR One Thousand Only');
    expect(numberToWords(1500)).toBe('INR One Thousand Five Hundred Only');
    expect(numberToWords(10000)).toBe('INR Ten Thousand Only');
    expect(numberToWords(41300)).toBe('INR Forty One Thousand Three Hundred Only');
  });

  it('should handle lakhs', () => {
    expect(numberToWords(100000)).toBe('INR One Lakh Only');
    expect(numberToWords(250000)).toBe('INR Two Lakh Fifty Thousand Only');
    expect(numberToWords(9999999)).toBe('INR Ninety Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine Only');
  });

  it('should handle crores', () => {
    expect(numberToWords(10000000)).toBe('INR One Crore Only');
    expect(numberToWords(12345678)).toBe('INR One Crore Twenty Three Lakh Forty Five Thousand Six Hundred Seventy Eight Only');
  });

  it('should ignore decimal parts', () => {
    expect(numberToWords(123.45)).toBe('INR One Hundred Twenty Three Only');
    expect(numberToWords(123.99)).toBe('INR One Hundred Twenty Three Only');
  });
});
