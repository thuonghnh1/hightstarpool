import { useRef, forwardRef, useImperativeHandle } from "react";
import ReactDOMServer from "react-dom/server";
import qz from "qz-tray";
import { toast } from "react-toastify";

const PrintComponent = forwardRef((props, ref) => {
  const printRef = useRef();

  // Kết nối QZ Tray
  const connectToQZ = async () => {
    try {
      await qz.websocket.connect();
      console.log("Đã kết nối QZ Tray!");
    } catch (error) {
      console.error("Lỗi kết nối QZ Tray:", error);
      toast.error("Lỗi khi kết nối với QZ Tray!");
    }
  };

  // Ngắt kết nối QZ Tray
  const disconnectFromQZ = async () => {
    try {
      await qz.websocket.disconnect();
      console.log("Đã ngắt kết nối QZ Tray!");
    } catch (error) {
      console.error("Lỗi ngắt kết nối QZ Tray:", error);
    }
  };

  // Hàm in nội dung HTML
  const handlePrint = async (htmlContent) => {
    try {
      // Kết nối tới QZ Tray
      await connectToQZ();

      // Lấy máy in mặc định
      const defaultPrinter = await qz.printers.getDefault();
      const config = qz.configs.create(defaultPrinter);

      // Tạo dữ liệu in
      const data = [{ type: "html", format: "plain", data: htmlContent }];

      // Gửi lệnh in
      await qz.print(config, data);
      console.log("In thành công!");
    } catch (error) {
      console.error("Lỗi khi in:", error);
      toast.error("Có lỗi xảy ra khi in!");
    } finally {
      // Ngắt kết nối QZ Tray
      await disconnectFromQZ();
    }
  };

  // Hàm in vé
  const printTicket = async (ticketComponent) => {
    const htmlContent = ReactDOMServer.renderToString(ticketComponent);
    await handlePrint(htmlContent);
  };

  // Hàm in hóa đơn
  const printInvoice = async (invoiceComponent) => {
    const htmlContent = ReactDOMServer.renderToString(invoiceComponent);
    await handlePrint(htmlContent);
  };

  useImperativeHandle(ref, () => ({
    printTicket,
    printInvoice,
  }));

  return <div ref={printRef} style={{ display: "none" }} />;
});

export default PrintComponent;
