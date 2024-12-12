package edu.poly.hightstar.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {
    @JsonProperty("id") // Trường JSON sẽ là "id"
    private Long categoryId; // Thuộc tính Java là "categoryId"

    private String categoryName;
}