import { toast } from "react-toastify";
import ErrorMessages from "./ErrorMessages";

function handleErrorResponse(error) {
  const { response } = error;

  if (!response) {
    toast.error(
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
    );
    return;
  }

  const { status, data } = response;
  const { message, errorCode } = data;

  if (errorCode && ErrorMessages[errorCode]) {
    toast.error(ErrorMessages[errorCode]);
  } else if (message) {
    toast.error(message);
  } else if (status >= 500) {
    toast.error("Lỗi hệ thống. Vui lòng thử lại sau!");
  } else if (status >= 400) {
    toast.error("Yêu cầu không hợp lệ!");
  }
  console.error(error);
}

export default handleErrorResponse;
