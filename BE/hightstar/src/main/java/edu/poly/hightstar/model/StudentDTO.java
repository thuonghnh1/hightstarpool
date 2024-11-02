package edu.poly.hightstar.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDTO {
  @JsonProperty("id")
  private Long studentId;
  private String fullName;
  private String nickname;
  private Integer age;
  private String avatar;
  private Boolean gender;
  private String note;
  private Long userId;
}
