package edu.poly.hightstar.utils.jwt;

import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Component;
import edu.poly.hightstar.enums.Role;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private static final long JWT_EXPIRATION = 3600000L; // 1 giờ cho access token
    private static final long REFRESH_TOKEN_EXPIRATION = 2592000000L; // 30 ngày = (24h x 60p x 60s x 1000ms)*30

    // private static final long JWT_EXPIRATION = 6000L; // 1 phút cho access token
    // private static final long REFRESH_TOKEN_EXPIRATION = 10000L; // 1 phút cho
    // refresh token

    private final String jwtSecretKey;

    // Constructor lấy giá trị JWT_SECRET_KEY từ tệp .env
    public JwtTokenProvider() {
        this.jwtSecretKey = loadSecretKey();
    }

    // Phương thức đọc giá trị khóa bí mật từ biến môi trường .env
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

    // Lấy danh sách quyền từ JWT
    @SuppressWarnings("unchecked")
    public List<String> getAuthoritiesFromJWT(String token) {
        Claims claims = parseClaims(token);
        return claims.get("roles", List.class);
    }

    // Tạo JWT với thông tin người dùng
    public String generateToken(String username, List<Role> roles, Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .claim("roles", roles.stream().map(role -> "ROLE_" + role.name()).collect(Collectors.toList()))
                .setIssuer("hightstar.com")
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Tạo JWT refresh
    public String generateRefreshToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + REFRESH_TOKEN_EXPIRATION);

        return Jwts.builder()
                .setSubject(username)
                .setIssuer("hightstar.com")
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Lấy username từ JWT đã cho
    public String getUsernameFromJWT(String token) {
        Claims claims = parseClaims(token);
        return claims.getSubject();
    }

    // Xác minh tính hợp lệ của JWT
    public boolean validateToken(String authToken) {
        try {
            parseClaims(authToken);
            return true;
        } catch (Exception e) {
            System.out.println("Invalid JWT: " + e.getClass().getName() + ": " + e.getMessage());
            return false;
        }
    }

    // Phương thức phân tích và lấy Claims từ JWT
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .setAllowedClockSkewSeconds(0) // Cho phép sai lệch thời gian 60 giây
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
