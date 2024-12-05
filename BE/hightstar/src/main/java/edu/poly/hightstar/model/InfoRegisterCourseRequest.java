package edu.poly.hightstar.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InfoRegisterCourseRequest {

    private String fullName;
    private String email;
    private String phoneNumber;
    private Long courseId;
    private String notes;
}
