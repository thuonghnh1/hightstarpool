package edu.poly.hightstar.controller.sites;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.poly.hightstar.model.CourseDTO;
import edu.poly.hightstar.model.InfoRegisterCourseRequest;
import edu.poly.hightstar.model.TrainerDTO;
import edu.poly.hightstar.service.CourseService;
import edu.poly.hightstar.service.EmailService;
import edu.poly.hightstar.service.TrainerService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class HomeController {

    private final CourseService courseService;
    private final TrainerService trainerService;
    private final EmailService emailService;

    @GetMapping("/courses")
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        return courses.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(courses);
    }

    @GetMapping("/courses/{id}")
    public CourseDTO getCourseById(@PathVariable Long id) {
        System.out.println(id);
        return courseService.getCourseById(id);
    }

    @GetMapping("/trainers")
    public ResponseEntity<List<TrainerDTO>> getAllTrainers() {
        List<TrainerDTO> trainers = trainerService.getAllTrainers();
        if (trainers.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 không có bản ghi nào
        }
        return ResponseEntity.ok(trainers); // 200 OK
    }

    @GetMapping("/trainers/{id}")
    public TrainerDTO getTrainerById(@PathVariable Long id) {
        return trainerService.getTrainerById(id);
    }

    @PostMapping("/sendInfoRegister")
    public ResponseEntity<InfoRegisterCourseRequest> sendInfoRegister(@RequestBody InfoRegisterCourseRequest request) {
        CourseDTO courseDTO = courseService.getCourseById(request.getCourseId());
        sendConsultationRequestEmail(request, courseDTO.getCourseName());
        return ResponseEntity.ok(request);
    }

    private void sendConsultationRequestEmail(InfoRegisterCourseRequest request, String courseName) {
        // Tiêu đề email
        String emailSubject = "Yêu cầu tư vấn khóa học từ khách hàng: " + request.getFullName();

        // Nội dung email (HTML)
        String emailBody = "<html>"
                + "<head>"
                + "<style>"
                + "    body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 0; }"
                + "    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }"
                + "    h1 { text-align: center; font-size: 24px; padding: 15px 0; border-radius: 8px 8px 0 0; }"
                + "    .info { background-color: #f9f9f9; padding: 15px; border: 1px solid #e1e1e1; border-radius: 5px; margin-bottom: 20px; font-size: 14px; }"
                + "    .info strong { color: #333; }"
                + "    .footer { margin-top: 20px; font-size: 0.9em; color: #666; text-align: center; padding-top: 15px; border-top: 1px solid #ddd; }"
                + "    .footer strong { color: #333; }"
                + "    .footer p { margin: 5px 0; }"
                + "    .footer a { color: #4CAF50; text-decoration: none; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "    <div class='container'>"
                + "        <h1>Thông báo yêu cầu tư vấn khóa học</h1>"
                + "        <p>Xin chào,</p>"
                + "        <p>Chúng tôi vừa nhận được yêu cầu tư vấn khóa học từ khách hàng. Dưới đây là thông tin chi tiết:</p>"
                + "        <div class='info'>"
                + "            <strong>Họ và tên:</strong> " + request.getFullName() + "<br>"
                + "            <strong>Email:</strong> " + request.getEmail() + "<br>"
                + "            <strong>Số điện thoại:</strong> " + request.getPhoneNumber() + "<br>"
                + "            <strong>Khóa học yêu cầu tư vấn:</strong> " + "#" + request.getCourseId() + " - "
                + courseName + "<br>"
                + "            <strong>Ghi chú:</strong> "
                + (request.getNotes() != null ? request.getNotes() : "Không có ghi chú") + "<br>"
                + "        </div>"
                + "        <p>Vui lòng liên hệ với khách hàng để hỗ trợ họ trong việc đăng ký khóa học mong muốn.</p>"
                + "        <div class='footer'>"
                + "            <p><strong>Hight Star</strong><br>"
                + "            Email: <a href='mailto:hightstarpoolcompany@gmail.com'>hightstarpoolcompany@gmail.com</a> | Hotline: 0888-372-325</p>"
                + "            <p>Đây là email tự động từ phần mềm Hight Star. Vui lòng không trả lời email này.</p>"
                + "        </div>"
                + "    </div>"
                + "</body>"
                + "</html>";

        // Gửi email đến hệ thống (email của người quản trị hoặc hệ thống nhận yêu cầu)
        emailService.sendHtmlEmail(
                "hightstarpoolcompany@gmail.com", emailSubject, emailBody);
    }

}
