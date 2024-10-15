export function formatDateToISO(inputDate) {
  // Tách chuỗi ngày thành ngày, tháng, năm
  const [day, month, year] = inputDate.split("/");

  // Trả về chuỗi ngày theo định dạng yyyy-MM-dd
  return `${year}-${month}-${day}`;
}

export function formatDateToDMY(inputDate) {
  // Tách chuỗi ngày thành năm, tháng, ngày
  const [year, month, day] = inputDate.split("-");

  // Trả về chuỗi ngày theo định dạng dd/MM/yyyy
  return `${day}/${month}/${year}`;
}
