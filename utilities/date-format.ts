import { format, formatDistanceToNow } from "date-fns";

export const timeStamps = (input: any) => {
  const formattedDate = format(input.createdAt, "dd MMM yyyy, HH:mm");
  return formattedDate;
};

export const distance = (input: any) => {
  const distanceToNow = formatDistanceToNow(input.updatedAt, {
    addSuffix: true,
  });
  if (distanceToNow.startsWith("about")) {
    return distanceToNow.substring("about".length);
  } else {
    return distanceToNow;
  }
};
