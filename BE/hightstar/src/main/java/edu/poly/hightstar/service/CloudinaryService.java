package edu.poly.hightstar.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String prefix) throws IOException {
        // Tạo một tên duy nhất cho ảnh với tiền tố "Vd: course_"
        String uniqueFileName = prefix + "_" + UUID.randomUUID().toString();
        
        // Upload ảnh lên Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "public_id", uniqueFileName, // Đặt tên ảnh là uniqueFileName
                        "resource_type", "auto",
                        "use_filename", true,
                        "unique_filename", true));

        return uploadResult.get("secure_url").toString(); // Trả về URL của ảnh trên Cloudinary
    }

    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
