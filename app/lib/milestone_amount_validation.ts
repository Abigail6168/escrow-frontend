/**
 * Validates a milestone amount string (whole stroops, strictly greater than 0).
 * Returns an error message, or null when the value is valid. An empty value
 * returns null so untouched inputs do not show an error; callers that need a
 * value should check for emptiness separately.
 */
export function validateMilestoneAmount(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  if (!/^[0-9]+$/.test(trimmed)) {
    return "Enter a whole number of stroops (digits only)";
  }
  if (/^0+$/.test(trimmed)) {
    return "Amount must be greater than 0";
  }
  return null;
}
