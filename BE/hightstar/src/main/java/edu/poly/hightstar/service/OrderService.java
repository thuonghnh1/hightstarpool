package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.OrderDTO;

public interface OrderService {
    List<OrderDTO> getAllOrders();

    OrderDTO getOrderById(Long id);

    OrderDTO updateOrder(Long id, OrderDTO orderDTO);
}
