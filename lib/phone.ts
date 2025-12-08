// utils/phone.ts

/**
 * Normalise un numéro vers le format +221XXXXXXXXX
 * Exemples acceptés :
 *  - 77 000 00 00
 *  - 770000000
 *  - +221 77 000 00 00
 *  - 221770000000
 */
export function normalizeSenegalPhone(input: string): string {
  if (!input) return "";

  // On enlève tout sauf les chiffres
  let digits = input.replace(/[^\d]/g, "");

  // Si commence par 221 → on le retire
  if (digits.startsWith("221")) {
    digits = digits.slice(3);
  }

  // On limite strictement à 9 chiffres
  if (digits.length > 9) {
    digits = digits.slice(0, 9);
  }

  // Si aucun chiffre → ""
  if (!digits) return "";

  return `+221${digits}`;
}
