export const removeTimeFields = (entry: any): any => {
  if (Array.isArray(entry)) {
    return entry.map((item) => removeTimeFields(item));
  }

  if (typeof entry !== "object" || entry === null) {
    return entry;
  }

  const { createdAt, updatedAt, ...rest } = entry;
  for (const key in rest) {
    rest[key] = removeTimeFields(rest[key]);
  }

  return rest;
};
