package edu.poly.hightstar.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InfoEnrollAndBuyCourseRequest {
    UserDTO userData;
    StudentDTO studentData;
    Long classId;
    OrderRequest orderRequest;
}
