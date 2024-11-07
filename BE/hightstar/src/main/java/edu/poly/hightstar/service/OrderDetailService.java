package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.OrderDetailDTO;

public interface OrderDetailService {
    List<OrderDetailDTO> getOrderDetailsByOrderId(Long orderId);
}
