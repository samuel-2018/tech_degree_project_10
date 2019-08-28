
function getFormData(form) {
    // Formats data as "multipart/form-data"
    const data = new FormData(form);
    // Converts to JSON
  const dataJSON = JSON.stringify(Object.fromEntries(data));
  return dataJSON;
}
export { getFormData };