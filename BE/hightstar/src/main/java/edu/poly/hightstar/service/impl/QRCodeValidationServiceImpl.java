package edu.poly.hightstar.service.impl;

import org.springframework.stereotype.Service;

import edu.poly.hightstar.model.QRCodeValidationResponse;
import edu.poly.hightstar.service.QRCodeValidationService;
import edu.poly.hightstar.service.TicketService;
import edu.poly.hightstar.model.TicketDTO;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.util.Base64;
import java.util.Date;

@Service
public class QRCodeValidationServiceImpl implements QRCodeValidationService {

    private final TicketService ticketService;

    public QRCodeValidationServiceImpl(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @Override
    public QRCodeValidationResponse validateQRCode(String qrCodeBase64) {
        QRCodeValidationResponse response = new QRCodeValidationResponse();

        try {
            // Giải mã Base64 thành byte array
            byte[] decodedBytes = Base64.getDecoder().decode(qrCodeBase64);
            ByteArrayInputStream bis = new ByteArrayInputStream(decodedBytes);
            BufferedImage bufferedImage = ImageIO.read(bis);

            if (bufferedImage == null) {
                throw new AppException("QR Code không hợp lệ!", ErrorCode.INVALID_QR_CODE);
            }

            // Sử dụng ZXing để giải mã QR Code
            LuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

            Result result = new MultiFormatReader().decode(bitmap);
            String ticketCode = result.getText();

            // Xác thực ticketCode
            TicketDTO ticket = ticketService.getTicketByCode(ticketCode);

            if (ticket == null) {
                throw new AppException("Vé không tồn tại hoặc đã bị hủy!", ErrorCode.TICKET_NOT_FOUND);
            }

            // Kiểm tra hạn sử dụng
            Date currentDate = new Date();
            if (currentDate.after(ticket.getExpiryDate())) {
                throw new AppException("Vé đã hết hạn!", ErrorCode.TICKET_EXPIRED);
            }

            // Nếu tất cả đều hợp lệ
            response.setValid(true);
            response.setMessage("Vé hợp lệ.");
            response.setTicket(ticket);

        } catch (NotFoundException e) {
            throw new AppException("Không thể tìm thấy dữ liệu trong QR Code.", ErrorCode.INVALID_QR_CODE);
        } catch (Exception e) {
            throw new AppException("Đã xảy ra lỗi trong quá trình xác thực QR Code.", ErrorCode.INTERNAL_SERVER_ERROR);
        }

        return response;
    }
}
