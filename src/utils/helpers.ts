import moment from "moment-timezone";

export const getUTCOffsetForTimezone = (timezone: string) => {
  return moment.tz(timezone).utcOffset();
};

export const formatUTCOffset = (offsetInMinutes: number) => {
  // Convert offset to hours and determine sign
  const offsetHours = Math.abs(Math.floor(offsetInMinutes / 60));
  const offsetSign = offsetInMinutes >= 0 ? "+" : "-";

  // Format the offset string as "GMT ±HH"
  const formattedOffset = `GMT ${offsetSign}${offsetHours.toString()}`;

  return formattedOffset;
};

export const readableTimezone = (timezone: string) => {
  return timezone.replace(/_/g, " ");
};

export const getDeterministicEmoji = (str: string) => {
  // Take the first two characters of the input string
  const inputChars = str.slice(0, 2);

  // Calculate a combined Unicode code point for the input characters
  let combinedCharCode = 0;
  for (let i = 0; i < inputChars.length; i++) {
    combinedCharCode += inputChars.charCodeAt(i);
  }

  // Determine a range of Unicode code points for emojis
  const emojiStart = 0x1f300; // Start of emoji Unicode range
  const emojiEnd = 0x1f3fa; // End of emoji Unicode range

  // Calculate an emoji code point based on the combined character code
  const emojiCodePoint =
    emojiStart + (combinedCharCode % (emojiEnd - emojiStart + 1));

  // Convert the emoji code point to an actual emoji character
  const emoji = String.fromCodePoint(emojiCodePoint);

  return emoji;
};
