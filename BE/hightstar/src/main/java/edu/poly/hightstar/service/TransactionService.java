package edu.poly.hightstar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TransactionService {

    @Autowired
    private RestTemplate restTemplate;

    private final String EXTERNAL_API_URL = "https://api.zenpn.com/api/historymbbank/ec5db112a958c739894ad8993287c8dd";

    public Object getTransactionHistory() {
        try {
            // Gọi API bên ngoài và lấy dữ liệu dưới dạng ResponseEntity
            ResponseEntity<String> response = restTemplate.getForEntity(EXTERNAL_API_URL, String.class);

            // Kiểm tra mã trạng thái HTTP (dùng getStatusCode().value() để lấy int)
            HttpStatusCode statusCode = response.getStatusCode();
            int statusCodeValue = statusCode.value();

            // Nếu mã trạng thái là 200, nghĩa là API gọi thành công
            if (statusCodeValue == 200) {
                // Trả về nội dung JSON
                return response.getBody();
            } else {
                // Nếu có lỗi từ API (không phải 200), trả về thông báo lỗi
                return "Lỗi khi gọi API: " + statusCodeValue;
            }

        } catch (Exception e) {
            // Log lỗi nếu có sự cố
            e.printStackTrace();
            return "Đã xảy ra lỗi khi gọi API.";
        }
    }
}
