package edu.poly.hightstar.service;

import edu.poly.hightstar.model.InfoEnrollAndBuyCourseRequest;

public interface RegistrationService {
    void registerNewCustomerAndEnrollStudent(InfoEnrollAndBuyCourseRequest request);

    void enrollExistingStudentInClass(Long studentId, Long classId);
}
