package edu.poly.hightstar.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import edu.poly.hightstar.model.QRCodeValidationRequest;
import edu.poly.hightstar.model.QRCodeValidationResponse;
import edu.poly.hightstar.service.QRCodeValidationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employee/qr")
@RequiredArgsConstructor
public class QRCodeController {
    private final QRCodeValidationService qrCodeValidationService;

    // Chỉ để kiểm tra tính hợp lệ của QR và phản hồi lên server thông tin vé thôi.
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping("/validate")
    public ResponseEntity<QRCodeValidationResponse> validateQRCode(@RequestBody QRCodeValidationRequest request) {
        QRCodeValidationResponse response = qrCodeValidationService.validateQRCode(request.getTicketCode());
        return ResponseEntity.ok(response);
    }
}
