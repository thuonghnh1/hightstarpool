export function formatDateToISO(inputDate) {
  if (!inputDate) return "";
  const [day, month, year] = inputDate.split("/");
  return `${year}-${month}-${day}`;
}

export function formatDateToDMY(inputDate) {
  if (!inputDate) return "";
  const [year, month, day] = inputDate.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateTimeToISO(inputDateTime) {
  if (!inputDateTime) return "";
  const [date, time] = inputDateTime.split(" ");
  const [day, month, year] = date.split("/");
  const [hours, minutes] = time.split(":");
  return `${year}-${month}-${day}T${hours}:${minutes}`; // yyyy-MM-ddThh:mm
}

export function formatDateTimeToDMY(inputDateTime) {
  if (!inputDateTime) return "";
  const [date, time] = inputDateTime.split("T");
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");
  return `${day}/${month}/${year} ${hours}:${minutes}`; //dd/MM/yyyy hh:mm
}

export function formatDateTimeLocal() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() trả về từ 0-11 nên phải +1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`; // trả về định dạng yyyy-MM-ddThh:mm
}

export function formatTime(inputTime) {
  if (!inputTime) return null; // Kiểm tra chuỗi đầu vào hợp lệ

  // Tách chuỗi theo ký tự `:` và `.`
  const [timePart] = inputTime.split("."); // Loại bỏ phần mili-giây
  const [hours, minutes, seconds] = timePart.split(":");

  // Đảm bảo mỗi thành phần luôn có 2 chữ số
  const formattedHours = hours.padStart(2, "0");
  const formattedMinutes = minutes.padStart(2, "0");
  const formattedSeconds = seconds.padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
