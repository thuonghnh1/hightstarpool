package edu.poly.hightstar.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private OrderDTO order;
    private List<OrderDetailDTO> orderDetails;
}
