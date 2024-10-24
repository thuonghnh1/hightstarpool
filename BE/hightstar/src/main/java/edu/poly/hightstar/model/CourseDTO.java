package edu.poly.hightstar.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CourseDTO {
     @JsonProperty("id") // cấu hình thuộc tính giống với trong file json.
    private Long courseId;        // ID khóa học
    private String courseName;    // Tên khóa học
    private String courseImage;   // Hình ảnh khóa học
    private int maxStudents;      // Số lượng học viên tối đa
    private String description;   // Mô tả khóa học
    private double price;         // Giá khóa học
    private int numberOfSessions; // Số buổi học
}
