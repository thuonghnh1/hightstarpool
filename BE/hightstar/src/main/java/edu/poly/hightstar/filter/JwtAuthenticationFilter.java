package edu.poly.hightstar.filter;

import edu.poly.hightstar.utils.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Lấy JWT từ header của yêu cầu
            String token = getJwtFromRequest(request);

            // Kiểm tra tính hợp lệ của JWT
            if (token != null && jwtTokenProvider.validateToken(token)) {
                // Lấy thông tin người dùng từ token
                String username = jwtTokenProvider.getUsernameFromJWT(token);
                List<String> roles = jwtTokenProvider.getAuthoritiesFromJWT(token);

                // Chuyển đổi vai trò thành GrantedAuthority
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                // Tạo đối tượng xác thực và đặt vào SecurityContext
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        username, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Đặt thông tin xác thực vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // Ghi log cảnh báo hoặc xử lý lỗi tùy chỉnh
            logger.warn("Không thể xác thực người dùng: " + e.getMessage());
        }

        // Tiếp tục chuỗi bộ lọc
        filterChain.doFilter(request, response);
    }

    // Lấy JWT từ header Authorization
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
