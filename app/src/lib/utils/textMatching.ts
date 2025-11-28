/**
 * Normalizes a string for comparison by:
 * - Converting to lowercase
 * - Trimming whitespace
 * - Replacing umlauts with their equivalents
 * - Replacing ß with ss
 * - Removing special characters
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace umlauts with single letters (not letter pairs)
    // This allows both "München" and "Muenchen" and "Munchen" to match
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ä/g, 'a')
    .replace(/ß/g, 'ss')
    // Also replace the letter pairs to handle typed variants
    .replace(/ue/g, 'u')
    .replace(/oe/g, 'o')
    .replace(/ae/g, 'a')
    .replace(/-/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
}

/**
 * Compares two strings for equality after normalization
 */
export function compareText(text1: string, text2: string): boolean {
  return normalizeText(text1) === normalizeText(text2)
}

/**
 * Checks if click coordinates are within threshold distance of target coordinates
 */
export function isClickNearPoint(
  click: { x: number; y: number },
  target: { x: number; y: number },
  threshold: number = 30
): boolean {
  const dx = click.x - target.x
  const dy = click.y - target.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < threshold
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.sqrt(dx * dx + dy * dy)
}
