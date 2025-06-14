/**
 * Utility functions for date handling and formatting
 */

/**
 * Parse a date string that might be in various formats
 * Handles both ISO format and MM/DD/YYYY format
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;

  try {
    // First try parsing as ISO date
    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }

    // Try parsing MM/DD/YYYY at HH:MM AM/PM format (with leading zeros)
    const mmddyyyyPattern =
      /^(\d{2})\/(\d{2})\/(\d{4}) at (\d{1,2}):(\d{2}) (AM|PM)$/;
    let match = dateString.match(mmddyyyyPattern);

    if (match) {
      const [, month, day, year, hour, minute, ampm] = match;
      let hour24 = parseInt(hour);

      if (ampm === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (ampm === "AM" && hour24 === 12) {
        hour24 = 0;
      }

      return new Date(year, month - 1, day, hour24, minute);
    }

    // Try parsing M/D/YYYY at H:MM AM/PM format (without leading zeros)
    const mdyyyyPattern =
      /^(\d{1,2})\/(\d{1,2})\/(\d{4}) at (\d{1,2}):(\d{2}) (AM|PM)$/;
    match = dateString.match(mdyyyyPattern);

    if (match) {
      const [, month, day, year, hour, minute, ampm] = match;
      let hour24 = parseInt(hour);

      if (ampm === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (ampm === "AM" && hour24 === 12) {
        hour24 = 0;
      }

      return new Date(year, month - 1, day, hour24, minute);
    }

    // Try parsing timestamp format from status history
    const timestampPattern =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/;
    match = dateString.match(timestampPattern);

    if (match) {
      return new Date(dateString);
    }

    // Last resort: try direct parsing
    return new Date(dateString);
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return null;
  }
};

/**
 * Format a date for display
 */
export const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? parseDate(date) : date;
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  return parsedDate.toLocaleDateString();
};

/**
 * Format a date with time for display
 */
export const formatDateTime = (date) => {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? parseDate(date) : date;
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  return {
    date: parsedDate.toLocaleDateString(),
    time: parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

/**
 * Check if a date string is valid
 */
export const isValidDate = (dateString) => {
  const parsed = parseDate(dateString);
  return parsed && !isNaN(parsed.getTime());
};
