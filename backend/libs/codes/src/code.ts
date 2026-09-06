import { z } from 'zod';
import { InvalidCodeException } from './invalid-code.exception';

export const MIN_CODE_DIGITS = 5;

export const codeSchema = (prefix: string) =>
  z.string().regex(new RegExp(`^${prefix}\\d{${MIN_CODE_DIGITS},}$`));

export const isCodeFormatValid = (prefix: string, value: string): boolean =>
  codeSchema(prefix).safeParse(value).success;

export const generateCode = (prefix: string, sequence: number): string => {
  if (sequence < 1) {
    throw new InvalidCodeException(prefix, sequence.toString());
  }

  return `${prefix}${sequence.toString().padStart(MIN_CODE_DIGITS, '0')}`;
};

export const sequenceFromCode = (
  prefix: string,
  value: string,
): number | null => {
  const match = new RegExp(`^${prefix}(\\d+)$`).exec(value);

  return match ? Number(match[1]) : null;
};

export const maxSequenceFromCodes = (
  prefix: string,
  codes: string[],
): number | null => {
  let max: number | null = null;

  for (const code of codes) {
    const sequence = sequenceFromCode(prefix, code);

    if (sequence !== null && (max === null || sequence > max)) {
      max = sequence;
    }
  }

  return max;
};
