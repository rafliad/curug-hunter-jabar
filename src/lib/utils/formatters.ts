// Normalizing every location of 'curug' added
export const normalizeLocation = (location: string): string => {
  if (!location) return "";
  return location
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
