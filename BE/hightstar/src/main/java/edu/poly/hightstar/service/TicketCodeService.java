package edu.poly.hightstar.service;

import edu.poly.hightstar.enums.TicketType;
import edu.poly.hightstar.enums.TicketStatus;
import edu.poly.hightstar.model.TicketDTO;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class TicketCodeService {

    // private static final long JWT_EXPIRATION = 3600000L; // 1 giờ cho access token

    private final String jwtSecretKey;

    // Constructor lấy giá trị JWT_SECRET_KEY từ biến môi trường
    public TicketCodeService() {
        this.jwtSecretKey = loadSecretKey();
    }

    // Phương thức đọc giá trị khóa bí mật từ biến môi trường
    private String loadSecretKey() {
        Dotenv dotenv = Dotenv.load();
        String secret = dotenv.get("JWT_SECRET_KEY");
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException("JWT_SECRET_KEY không được tìm thấy hoặc rỗng");
        }
        return secret;
    }

    // Tạo khóa ký từ chuỗi JWT_SECRET_KEY đã mã hóa Base64
    private Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecretKey);
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());
    }

    // Tạo ticketCode bằng JWT
    public String generateTicketCode(TicketDTO ticketDTO) {
        Date now = new Date();
        Date expiryDate = ticketDTO.getExpiryDate(); // Ngày hết hạn của vé

        // Tạo JWT cho mã vé
        return Jwts.builder()
                .setSubject(String.valueOf(ticketDTO.getTicketId())) // ticketId làm subject
                .claim("ticketId", ticketDTO.getTicketId())
                .claim("ticketType", ticketDTO.getTicketType().name()) // Vé loại gì (tháng, tuần, ngày)
                .claim("ticketStatus", ticketDTO.getStatus().name()) // Trạng thái vé
                // Chỉ thêm studentId nếu không null
                .claim("studentId", ticketDTO.getStudentId() != null ? ticketDTO.getStudentId() : "")
                .claim("issueDate", now.getTime()) // Thêm issueDate dưới dạng timestamp
                .setIssuer("hightstar.com") // Nguồn phát hành
                .setIssuedAt(now)
                .setExpiration(expiryDate) // Thời gian hết hạn
                .signWith(getSigningKey(), SignatureAlgorithm.HS512) // Mã hóa bằng HS512 và khóa bí mật
                .compact();
    }

    // Lấy thông tin từ ticketCode (JWT)
    public TicketDTO getTicketInfoFromCode(String ticketCode) {
        Claims claims = parseClaims(ticketCode);

        TicketDTO ticketDTO = new TicketDTO();
        ticketDTO.setTicketId(claims.get("ticketId", Long.class));
        ticketDTO.setTicketCode(ticketCode); // Giữ nguyên ticketCode
        ticketDTO.setTicketType(TicketType.valueOf(claims.get("ticketType", String.class)));
        ticketDTO.setStatus(TicketStatus.valueOf(claims.get("ticketStatus", String.class)));
        // Xử lý studentId có thể là null
        Object studentIdObj = claims.get("studentId");
        if (studentIdObj instanceof Long) {
            ticketDTO.setStudentId((Long) studentIdObj);
        } else if (studentIdObj instanceof String && !((String) studentIdObj).isEmpty()) {
            ticketDTO.setStudentId(Long.valueOf((String) studentIdObj));
        } else {
            ticketDTO.setStudentId(null);
        }
        ticketDTO.setExpiryDate(claims.getExpiration()); // Thời gian hết hạn

        // Lấy issueDate từ JWT
        Long issueTimestamp = claims.get("issueDate", Long.class);
        ticketDTO.setIssueDate(new Date(issueTimestamp));

        return ticketDTO;
    }

    // Phương thức phân tích và lấy Claims từ ticketCode (JWT)
    private Claims parseClaims(String ticketCode) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .setAllowedClockSkewSeconds(0) // Cho phép sai lệch thời gian
                .build()
                .parseClaimsJws(ticketCode)
                .getBody();
    }

    // Xác minh tính hợp lệ của ticketCode (JWT)
    public boolean validateTicketCode(String ticketCode) {
        try {
            parseClaims(ticketCode); // Nếu parse được thì là hợp lệ
            return true;
        } catch (Exception e) {
            System.out.println("Invalid ticket code: " + e.getClass().getName() + ": " + e.getMessage());
            return false;
        }
    }
}
