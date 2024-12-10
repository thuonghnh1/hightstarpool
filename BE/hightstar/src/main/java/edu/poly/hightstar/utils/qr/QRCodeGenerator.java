package edu.poly.hightstar.utils.qr;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

import javax.imageio.ImageIO;

@Component
public class QRCodeGenerator {

    public String generateQRCodeBase64(String data, int width, int height) throws WriterException, IOException {
        // Tạo đối tượng QRCodeWriter để tạo mã QR
        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        // Tạo BitMatrix từ dữ liệu input
        BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, width, height);

        // Chuyển BitMatrix thành BufferedImage
        BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

        // Tạo ByteArrayOutputStream để lưu trữ hình ảnh dưới dạng byte array
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();

        // Ghi ảnh vào ByteArrayOutputStream
        ImageIO.write(bufferedImage, "PNG", pngOutputStream);

        // Lấy dữ liệu byte từ OutputStream
        byte[] pngData = pngOutputStream.toByteArray();

        // Chuyển đổi dữ liệu byte thành Base64
        return Base64.getEncoder().encodeToString(pngData);
    }
}
