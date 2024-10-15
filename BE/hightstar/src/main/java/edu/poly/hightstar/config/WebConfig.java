package edu.poly.hightstar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/api/**") // Cho phép tất cả các endpoint có đường dẫn bắt đầu bằng /api
                        .allowedOrigins("http://localhost:3000") // Chỉ cho phép từ localhost:3000
                        .allowedMethods("GET", "POST", "PUT", "DELETE"); // Cho phép các phương thức
            }
        };
    }
}
