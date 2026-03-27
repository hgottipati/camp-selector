/** Short line for cards / tables; full string in title/tooltip. */
export function waterTemperaturePreview(text: string, maxLen = 52): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}
