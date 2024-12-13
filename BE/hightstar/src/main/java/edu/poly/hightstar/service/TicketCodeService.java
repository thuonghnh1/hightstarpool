package edu.poly.hightstar.service;

import edu.poly.hightstar.enums.TicketType;
import edu.poly.hightstar.model.TicketDTO;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.Date;

@Component
public class TicketCodeService {

    // private static final long JWT_EXPIRATION = 3600000L; // 1 giờ cho access
    // token

    private final String jwtSecretKey;

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
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiryDate = ticketDTO.getExpiryDate(); // Ngày hết hạn của vé

        // Chuyển LocalDateTime thành Date
        Date issueDate = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
        Date expiryDateConverted = Date.from(expiryDate.atZone(ZoneId.systemDefault()).toInstant());

        // Tạo JWT cho mã vé
        return Jwts.builder()
                .setSubject(String.valueOf(ticketDTO.getTicketId())) // ticketId làm subject
                .claim("ticketId", ticketDTO.getTicketId())
                .claim("ticketType", ticketDTO.getTicketType().name()) // Vé loại gì (tháng, tuần, ngày)
                // Chỉ thêm studentId nếu không null
                .claim("studentId", ticketDTO.getStudentId() != null ? ticketDTO.getStudentId() : "")
                .claim("issueDate", issueDate.getTime()) // Thêm issueDate dưới dạng timestamp
                .setIssuer("hightstar.com") // Nguồn phát hành
                .setIssuedAt(issueDate)
                .setExpiration(expiryDateConverted) // Thời gian hết hạn
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

        // Xử lý studentId có thể là null
        Object studentIdObj = claims.get("studentId");
        try {
            if (studentIdObj != null) {
                if (studentIdObj instanceof String && !((String) studentIdObj).isEmpty()) {
                    ticketDTO.setStudentId(Long.valueOf((String) studentIdObj));
                } else {
                    ticketDTO.setStudentId(Long.parseLong(studentIdObj.toString()));
                }
            } else {
                ticketDTO.setStudentId(null);
            }
        } catch (NumberFormatException e) {
            System.out.println("Không thể chuyển đổi studentIdObj sang Long: " + studentIdObj);
            ticketDTO.setStudentId(null);
        }

        // Chuyển đổi expiryDate từ Date (JWT) sang LocalDateTime
        Instant expiryInstant = claims.getExpiration().toInstant();
        LocalDateTime expiryDate = LocalDateTime.ofInstant(expiryInstant, ZoneId.systemDefault());
        ticketDTO.setExpiryDate(expiryDate);

        // Chuyển đổi issueDate từ long timestamp (JWT) sang LocalDateTime
        Long issueTimestamp = claims.get("issueDate", Long.class);
        Instant issueInstant = Instant.ofEpochMilli(issueTimestamp);
        LocalDateTime issueDate = LocalDateTime.ofInstant(issueInstant, ZoneId.systemDefault());
        ticketDTO.setIssueDate(issueDate);
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
    public void validateTicketCode(String ticketCode) {
        try {
            // Parse JWT để kiểm tra tính hợp lệ
            parseClaims(ticketCode);
        } catch (ExpiredJwtException e) {
            throw new AppException("Vé này đã hết hạn!", ErrorCode.TICKET_EXPIRED);
        } catch (Exception e) {
            // Nếu có lỗi khác
            // e.printStackTrace();
            throw new AppException("Mã QR không hợp lệ!", ErrorCode.INVALID_QR_CODE);
        }
    }

}
