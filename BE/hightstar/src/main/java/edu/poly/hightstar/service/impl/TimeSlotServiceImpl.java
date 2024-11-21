package edu.poly.hightstar.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import edu.poly.hightstar.domain.TimeSlot;
import edu.poly.hightstar.model.TimeSlotDTO;
import edu.poly.hightstar.repository.TimeSlotRepository;
import edu.poly.hightstar.service.TimeSlotService;
import edu.poly.hightstar.utils.exception.AppException;
import edu.poly.hightstar.utils.exception.ErrorCode;

@Service
public class TimeSlotServiceImpl implements TimeSlotService {
    private final TimeSlotRepository timeSlotRepository;

    public TimeSlotServiceImpl(TimeSlotRepository timeSlotRepository) {
        this.timeSlotRepository = timeSlotRepository;
    }

    @Override
    public List<TimeSlotDTO> getAllTimeSlots() {
        return timeSlotRepository.findAll().stream().map(timeSlot -> {
            TimeSlotDTO dto = new TimeSlotDTO();
            BeanUtils.copyProperties(timeSlot, dto); // Chuyển từ entity sang DTO
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public TimeSlotDTO getTimeSlotById(Long id) {
        Optional<TimeSlot> timeSlot = timeSlotRepository.findById(id);
        if (timeSlot.isPresent()) {
            TimeSlotDTO timeSlotDTO = new TimeSlotDTO();
            BeanUtils.copyProperties(timeSlot.get(), timeSlotDTO);
            return timeSlotDTO;
        }
        throw new AppException("Không tìm thấy suất học này trong hệ thống!", ErrorCode.TIMESLOT_NOT_FOUND);
    }

    @Override
    public TimeSlotDTO createTimeSlot(TimeSlotDTO timeSlotDTO) {
        try {
            TimeSlot timeSlot = new TimeSlot();
            BeanUtils.copyProperties(timeSlotDTO, timeSlot); // Chuyển từ DTO sang entity
            timeSlot.setDayOfWeek(timeSlotDTO.getDayOfWeek());
            TimeSlot createdTimeSlot = timeSlotRepository.save(timeSlot);
            TimeSlotDTO createdTimeSlotDTO = new TimeSlotDTO();
            BeanUtils.copyProperties(createdTimeSlot, createdTimeSlotDTO); // Trả về DTO sau khi tạo
            return createdTimeSlotDTO;
        } catch (DataIntegrityViolationException e) {
            // Xử lý ngoại lệ khi trùng lặp
            throw new AppException("Suất học đã tồn tại. Vui lòng chọn lại thời gian khác!",
                    ErrorCode.DUPLICATE_TIMESLOT);
        }
    }

    @Override
    public TimeSlotDTO updateTimeSlot(Long id, TimeSlotDTO timeSlotDTO) {
        try {
            Optional<TimeSlot> timeSlotOptional = timeSlotRepository.findById(id);
            if (timeSlotOptional.isPresent()) {
                TimeSlot timeSlotDetails = timeSlotOptional.get();
                BeanUtils.copyProperties(timeSlotDTO, timeSlotDetails);
                TimeSlot updatedTimeSlot = timeSlotRepository.save(timeSlotDetails);

                TimeSlotDTO updatedTimeSlotDto = new TimeSlotDTO();
                BeanUtils.copyProperties(updatedTimeSlot, updatedTimeSlotDto);
                return updatedTimeSlotDto;
            }
            throw new AppException("Không tìm thấy suất học này trong hệ thống!", ErrorCode.TIMESLOT_NOT_FOUND);
        } catch (DataIntegrityViolationException e) {
            // Xử lý ngoại lệ khi trùng lặp
            throw new AppException("Suất học đã tồn tại. Vui lòng chọn lại thời gian khác!",
                    ErrorCode.DUPLICATE_TIMESLOT);
        }
    }

    @Override
    public void deleteTimeSlot(Long id) {
        timeSlotRepository.deleteById(id);
    }
}
