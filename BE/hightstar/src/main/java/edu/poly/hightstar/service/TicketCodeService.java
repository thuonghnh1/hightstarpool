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

    private final String jwtSecretKey;

    public TicketCodeService() {
        this.jwtSecretKey = loadSecretKey();
    }

    private String loadSecretKey() {
        Dotenv dotenv = Dotenv.load();
        String secret = dotenv.get("JWT_SECRET_KEY");
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException("JWT_SECRET_KEY không được tìm thấy hoặc rỗng");
        }
        return secret;
    }

    private Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecretKey);
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());
    }

    // Tạo ticketCode bằng JWT
    public String generateTicketCode(TicketDTO ticketDTO) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiryDate = ticketDTO.getExpiryDate(); // Ngày hết hạn của vé

        Date issueDate = Date.from(now.atZone(ZoneId.systemDefault()).toInstant()); // Chuyển đổi LocalDateTime (thời gian hiện tại) thành Date
        Date expiryDateConverted = Date.from(expiryDate.atZone(ZoneId.systemDefault()).toInstant()); // Chuyển đổi LocalDate (ngày hết hạn) thành Date

        return Jwts.builder()
                .setSubject(String.valueOf(ticketDTO.getTicketId()))
                .claim("ticketId", ticketDTO.getTicketId())
                .claim("ticketType", ticketDTO.getTicketType().name())
                .claim("classStudentEnrollmentId",
                        ticketDTO.getClassStudentEnrollmentId() != null ? ticketDTO.getClassStudentEnrollmentId() : "")
                .claim("issueDate", issueDate.getTime())
                .setIssuer("hightstar.com")
                .setIssuedAt(issueDate)
                .setExpiration(expiryDateConverted)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public TicketDTO getTicketInfoFromCode(String ticketCode) {
        Claims claims = parseClaims(ticketCode);

        TicketDTO ticketDTO = new TicketDTO();
        ticketDTO.setTicketId(claims.get("ticketId", Long.class));
        ticketDTO.setTicketCode(ticketCode);
        ticketDTO.setTicketType(TicketType.valueOf(claims.get("ticketType", String.class)));

        Object cseIdObj = claims.get("classStudentEnrollmentId");
        try {
            if (cseIdObj != null && !cseIdObj.toString().isEmpty()) {
                ticketDTO.setClassStudentEnrollmentId(Long.valueOf(cseIdObj.toString()));
            } else {
                ticketDTO.setClassStudentEnrollmentId(null);
            }
        } catch (NumberFormatException e) {
            ticketDTO.setClassStudentEnrollmentId(null);
        }

        Instant expiryInstant = claims.getExpiration().toInstant();
        LocalDateTime expiryDate = LocalDateTime.ofInstant(expiryInstant, ZoneId.systemDefault());
        ticketDTO.setExpiryDate(expiryDate);

        Long issueTimestamp = claims.get("issueDate", Long.class);
        Instant issueInstant = Instant.ofEpochMilli(issueTimestamp);
        LocalDateTime issueDate = LocalDateTime.ofInstant(issueInstant, ZoneId.systemDefault());
        ticketDTO.setIssueDate(issueDate);

        return ticketDTO;
    }

    private Claims parseClaims(String ticketCode) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .setAllowedClockSkewSeconds(0)
                .build()
                .parseClaimsJws(ticketCode)
                .getBody();
    }

    public void validateTicketCode(String ticketCode) {
        try {
            parseClaims(ticketCode);
        } catch (ExpiredJwtException e) {
            throw new AppException("Vé này đã hết hạn!", ErrorCode.TICKET_EXPIRED);
        } catch (Exception e) {
            throw new AppException("Mã QR không hợp lệ!", ErrorCode.INVALID_QR_CODE);
        }
    }

}
