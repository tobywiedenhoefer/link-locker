type DateType = "auth" | "locker";

export function getExpiryDate(type: DateType) {
  const date = new Date();
  switch (type) {
    case "auth": {
      date.setDate(date.getDate() + 7);
      break;
    }
    case "locker": {
      date.setHours(date.getHours() + 1);
      break;
    }
  }
  return date;
}

export function isValidDate(date?: Date) {
  if (!date || new Date() >= date) {
    return false;
  }
  return true;
}
