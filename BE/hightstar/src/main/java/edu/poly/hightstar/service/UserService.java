package edu.poly.hightstar.service;

import java.util.List;

import edu.poly.hightstar.model.UserDTO;

public interface UserService {
    List<UserDTO> getAllUsers();

    UserDTO getUserById(Long idd);

    UserDTO createUser(UserDTO userDto);

    UserDTO updateUser(Long idd, UserDTO userDto);

    void deleteUser(Long id);

    boolean isPhoneNumberExists(String phoneNumber);

    boolean isEmailExists(String email);

    boolean isEmailExistsForUpdate(String email, Long userId);

    UserDTO getUserByUsername(String username);

}
