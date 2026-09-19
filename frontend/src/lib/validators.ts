/**
 * Số điện thoại di động Việt Nam: bắt đầu 03/05/07/08/09, đúng 10 chữ số.
 * Khớp với employee-service và customer-service.
 */
export const MOBILE_PHONE_REGEX = /^(03|05|07|08|09)[0-9]{8}$/;

/**
 * Số điện thoại nhà cung cấp: di động 10 số hoặc cố định 11 số (bắt đầu 0).
 * Khớp với supplier-service.
 */
export const SUPPLIER_PHONE_REGEX = /^((03|05|07|08|09)[0-9]{8}|0[0-9]{10})$/;

export const isValidMobilePhone = (phone: string): boolean =>
  MOBILE_PHONE_REGEX.test(phone.trim());

export const isValidSupplierPhone = (phone: string): boolean =>
  SUPPLIER_PHONE_REGEX.test(phone.trim());