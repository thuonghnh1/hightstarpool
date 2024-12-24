package edu.poly.hightstar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    RestTemplate restTemplate() {
        // Tạo RestTemplate với cấu hình MessageConverters
        RestTemplate restTemplate = new RestTemplate();

        // Thêm Jackson Converter để xử lý JSON
        restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());

        return restTemplate;
    }
}
