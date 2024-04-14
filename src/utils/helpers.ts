import moment from "moment-timezone";

export const getUTCOffsetForTimezone = (timezone: string) => {
  return moment.tz(timezone).utcOffset();
};

export const formatUTCOffset = (offsetInMinutes: number) => {
  // Convert offset to hours and determine sign
  const offsetHours = Math.abs(Math.floor(offsetInMinutes / 60));
  const offsetSign = offsetInMinutes >= 0 ? "+" : "-";

  // Format the offset string as "GMT ±HH"
  const formattedOffset = `GMT ${offsetSign}${offsetHours.toString().padStart(2, "0")}`;

  return formattedOffset;
};
