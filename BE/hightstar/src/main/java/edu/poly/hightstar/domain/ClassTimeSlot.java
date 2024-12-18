package edu.poly.hightstar.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "class_timeslots")
public class ClassTimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long classTimeSlotId;

    @ManyToOne
    @JoinColumn(name = "classId", nullable = false)
    private ClassEntity classEntity;

    @ManyToOne
    @JoinColumn(name = "slotId", nullable = false)
    private TimeSlot timeSlot;
}