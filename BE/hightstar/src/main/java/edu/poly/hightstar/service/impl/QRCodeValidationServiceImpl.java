package edu.poly.hightstar.service.impl;

import org.springframework.stereotype.Service;
import edu.poly.hightstar.model.QRCodeValidationResponse;
import edu.poly.hightstar.service.QRCodeValidationService;
import edu.poly.hightstar.service.TicketCodeService;
import edu.poly.hightstar.model.TicketDTO;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QRCodeValidationServiceImpl implements QRCodeValidationService {

    // private final TicketService ticketService;
    private final TicketCodeService ticketCodeService;

    @Override
    public QRCodeValidationResponse validateQRCode(String ticketCode) { // Đổi tên tham số từ qrCodeBase64 thành
                                                                        // ticketCode
        QRCodeValidationResponse response = new QRCodeValidationResponse();

        try {
            // Xác thực ticketCode (giải mã JWT)
            ticketCodeService.validateTicketCode(ticketCode);

            // Lấy thông tin vé từ ticketCode
            TicketDTO ticketDto = ticketCodeService.getTicketInfoFromCode(ticketCode);

            if (ticketDto == null) {
                throw new AppException("Vé không tồn tại hoặc đã bị hủy!", ErrorCode.TICKET_NOT_FOUND);
            }

            // Nếu tất cả đều hợp lệ
            response.setValid(true);
            response.setMessage("Vé hợp lệ.");
            response.setTicketDto(ticketDto);

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new AppException("Đã xảy ra lỗi trong quá trình xác thực QR Code.", ErrorCode.INTERNAL_SERVER_ERROR);
        }

        return response;
    }
}
