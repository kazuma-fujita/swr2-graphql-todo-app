export const displayError = (data: any) => {
  if (Array.isArray(data) || typeof data === "object") {
    return JSON.stringify(data);
  }
  return data;
};
