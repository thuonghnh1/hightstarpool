package edu.poly.hightstar.service;

import org.springframework.stereotype.Service;
import edu.poly.hightstar.domain.UserProfile;

@Service
public interface UserProfileService {
    UserProfile getUserProfileByUserId(Long userId);

    UserProfile updateUserProfile(Long userId, UserProfile updatedProfile);
}
