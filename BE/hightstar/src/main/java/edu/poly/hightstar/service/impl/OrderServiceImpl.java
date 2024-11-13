package edu.poly.hightstar.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import edu.poly.hightstar.domain.Order;
import edu.poly.hightstar.domain.User;
import edu.poly.hightstar.model.OrderDTO;
import edu.poly.hightstar.repository.OrderRepository;
import edu.poly.hightstar.repository.UserRepository;
import edu.poly.hightstar.service.OrderService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(order -> {
            OrderDTO dto = new OrderDTO();

            // Kiểm tra null trước khi gọi getUserId() và getDiscountId()
            if (order.getUser() != null) {
                dto.setUserId(order.getUser().getUserId());
            }

            if (order.getDiscount() != null) {
                dto.setDiscountId(order.getDiscount().getDiscountId());
            }

            BeanUtils.copyProperties(order, dto); // Chuyển từ entity sang DTO
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderById(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            OrderDTO orderDTO = new OrderDTO();
            BeanUtils.copyProperties(order.get(), orderDTO);
            return orderDTO;
        }
        return null;
    }

    @Override
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            BeanUtils.copyProperties(orderDTO, order);
            Optional<User> userOptional = userRepository.findById(orderDTO.getUserId());
            if (userOptional.isPresent()) {
                order.setUser(userOptional.get());
                Order updatedOrder = orderRepository.save(order);
                OrderDTO updatedOrderDTO = new OrderDTO();
                BeanUtils.copyProperties(updatedOrder, updatedOrderDTO);
                updatedOrderDTO.setUserId(userOptional.get().getUserId());
                return updatedOrderDTO;
            }
        }

        return null;
    }
}
