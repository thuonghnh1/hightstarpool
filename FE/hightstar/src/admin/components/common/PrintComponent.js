import { useRef, forwardRef, useImperativeHandle } from "react";
import qz from "qz-tray";

const PrintComponent = forwardRef(
  ({ children, documentTitle = "Hóa Đơn Bán Hàng" }, ref) => {
    const printRef = useRef();

    // Kết nối QZ Tray
    const connectToQZ = async () => {
      try {
        await qz.websocket.connect();
        console.log("Đã kết nối QZ Tray!");
      } catch (error) {
        console.error("Lỗi kết nối QZ Tray:", error);
      }
    };

    // Hàm ngắt kết nối QZ Tray
    const disconnectFromQZ = async () => {
      try {
        await qz.websocket.disconnect();
        console.log("Đã ngắt kết nối QZ Tray!");
      } catch (error) {
        console.error("Lỗi ngắt kết nối QZ Tray:", error);
      }
    };

    const handlePrint = async () => {
      try {
        // Kết nối tới QZ Tray
        await connectToQZ();

        // Lấy máy in mặc định
        const defaultPrinter = await qz.printers.getDefault();
        console.log("Máy in mặc định:", defaultPrinter);

        // Tạo cấu hình máy in mặc định
        const config = qz.configs.create(defaultPrinter);

        // Nội dung hóa đơn
        const receiptContent = printRef.current.innerHTML;
        const data = [
          {
            type: "html",
            format: "plain",
            data: `
              <html>
                <head>
                  <title>${documentTitle}</title>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      font-size: 12px;
                      width: 58mm;
                      margin: 0;
                      padding: 0;
                    }
                    table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    th, td {
                      text-align: left;
                      padding: 2px 5px;
                    }
                  </style>
                </head>
                <body>
                  ${receiptContent}
                </body>
              </html>
            `,
          },
        ];

        // Gửi lệnh in
        await qz.print(config, data);
        console.log("In hóa đơn thành công!");
      } catch (error) {
        console.error("Lỗi in hóa đơn:", error);
      } finally {
        // Ngắt kết nối QZ Tray
        await disconnectFromQZ();
      }
    };

    // Expose the handlePrint method to the parent via ref
    useImperativeHandle(ref, () => ({
      print: handlePrint,
    }));

    return (
      <div>
        {/* Nội dung cần in */}
        <div ref={printRef} style={{ display: "none" }}>
          {children}
        </div>
      </div>
    );
  }
);

export default PrintComponent;
