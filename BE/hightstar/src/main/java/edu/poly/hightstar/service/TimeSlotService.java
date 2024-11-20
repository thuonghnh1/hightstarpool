package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.TimeSlotDTO;

public interface TimeSlotService {
    List<TimeSlotDTO> getAllTimeSlots();

    TimeSlotDTO getTimeSlotById(Long id);

    TimeSlotDTO createTimeSlot(TimeSlotDTO timeSlotDTO);

    TimeSlotDTO updateTimeSlot(Long id, TimeSlotDTO timeSlotDTO);

    void deleteTimeSlot(Long id);
}
