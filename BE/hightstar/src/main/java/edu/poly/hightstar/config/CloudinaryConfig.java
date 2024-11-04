package edu.poly.hightstar.config;

import com.cloudinary.Cloudinary;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    private final Dotenv dotenv = Dotenv.load();

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(dotenv.get("CLOUDINARY_URL"));
    }
}
