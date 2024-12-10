package edu.poly.hightstar.service;

import edu.poly.hightstar.model.QRCodeValidationResponse;

public interface QRCodeValidationService {
    QRCodeValidationResponse validateQRCode(String qrCodeBase64);
}
