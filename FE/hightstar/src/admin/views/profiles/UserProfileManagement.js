import { useEffect, useState, useRef } from "react";
import { Spinner, Row, Col, Image, Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import UserProfileService from "../../services/UserProfileService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDateTimeToDMY } from "../../utils/FormatDate";

const UserProfileManagement = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  // State to hold the selected avatar file
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // Ref for hidden file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const data = await UserProfileService.getProfileByUserId(userId);
      setProfile(data);
      setEditProfile({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender === null ? "" : data.gender ? "1" : "0",
        bio: data.bio || "",
        avatar: data.avatar || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors for the field being edited
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Handle avatar click to trigger file input
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại tệp ảnh
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn một tệp ảnh hợp lệ!");
        return;
      }

      // Kiểm tra kích thước tệp (10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        toast.error("Kích thước ảnh không được vượt quá 10MB!");
        return;
      }

      // Cập nhật file đã chọn để gửi lên server
      setSelectedAvatar(file);

      // Tạo xem trước ảnh bằng FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile((prev) => ({
          ...prev,
          avatar: reader.result, // Cập nhật avatar để hiển thị xem trước
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!editProfile.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống.";
    }

    if (!editProfile.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại không được để trống.";
    } else {
      // Validate phone number format (e.g., only digits and length between 10-15)
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(editProfile.phoneNumber)) {
        newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
      }
    }

    if (editProfile.dateOfBirth) {
      const dob = new Date(editProfile.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        newErrors.dateOfBirth = "Ngày sinh không được lớn hơn ngày hiện tại.";
      }
    }

    // Add other validations if necessary

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setUpdating(true);

      // Prepare data for update
      const updatedData = {
        ...profile,
        fullName: editProfile.fullName,
        phoneNumber: editProfile.phoneNumber,
        dateOfBirth: editProfile.dateOfBirth || null,
        gender:
          editProfile.gender === ""
            ? null
            : editProfile.gender === "1"
            ? true
            : false,
        bio: editProfile.bio,
        // Không cần set avatar ở đây nếu đã xử lý trong handleAvatarChange
      };

      // Call API to update profile with selectedAvatar
      const updatedProfile = await UserProfileService.updateUserProfile(
        profile.id,
        updatedData,
        selectedAvatar
      );

      // Update state with the new profile data

      setProfile({
        ...updatedProfile,
        updatedAt: formatDateTimeToDMY(updatedProfile.updatedAt),
      });
      setEditProfile({
        ...editProfile,
        avatar: updatedProfile.avatar || "",
      });
      toast.success("Cập nhật hồ sơ người dùng thành công!");

      // Reset selected avatar
      setSelectedAvatar(null);
    } catch (error) {
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="p-5 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Quản lý hồ sơ người dùng - Hight Star</title>
      </Helmet>

      {profile && (
        <Form onSubmit={handleFormSubmit}>
          <Row>
            <Col
              lg={4}
              className="d-flex flex-column justify-content-start align-items-center mt-1 mb-5 mb-md-0"
            >
              <div onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
                <Image
                  src={
                    editProfile.avatar || "/assets/img/avatar-default-lg.png"
                  } // Use editProfile to update immediately when a new image is selected
                  alt={profile.fullName || "User Avatar"}
                  roundedCircle
                  fluid
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    border: "3px solid black",
                  }}
                />
                <Form.Control
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
              <small className="text-primary fst-italic my-3">
                Nhấp vào ảnh để thay đổi!
              </small>
            </Col>
            <Col lg={8} className="pe-3 pb-2">
              <Row className="mb-3">
                <Col xs={3}>
                  <strong>Mã hồ sơ:</strong>
                </Col>
                <Col xs={9}>
                  <Form.Control type="text" value={profile.id} readOnly />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={3}>
                  <strong>Họ và tên:</strong>
                </Col>
                <Col xs={9}>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={editProfile.fullName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.fullName}
                    required
                    placeholder="Nhập họ và tên"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={3}>
                  <strong>Số điện thoại:</strong>
                </Col>
                <Col xs={9}>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={editProfile.phoneNumber}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phoneNumber}
                    required
                    placeholder="Nhập số điện thoại"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              {/* Ngày sinh */}
              <Row className="mb-3">
                <Col xs={3}>
                  <strong>Ngày sinh:</strong>
                </Col>
                <Col xs={9}>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={editProfile.dateOfBirth}
                    onChange={handleInputChange}
                    isInvalid={!!errors.dateOfBirth}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dateOfBirth}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              {/* Giới tính */}
              <Row className="mb-3">
                <Col xs={3}>
                  <strong>Giới tính:</strong>
                </Col>
                <Col xs={9}>
                  <Form.Select
                    name="gender"
                    value={editProfile.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Chưa có</option>
                    <option value="1">Nam</option>
                    <option value="0">Nữ</option>
                  </Form.Select>
                </Col>
              </Row>

              {/* Tiểu sử */}
              <Row className="mb-3">
                <Col xs={3}>
                  <strong>Tiểu sử:</strong>
                </Col>
                <Col xs={9}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={editProfile.bio}
                    onChange={handleInputChange}
                    placeholder="Nhập tiểu sử"
                  />
                </Col>
              </Row>

              {/* Ngày cập nhật */}
              <Row className="mb-3">
                <Col xs={3}>
                  <strong>Cập nhật lúc:</strong>
                </Col>
                <Col xs={9}>{profile.updatedAt}</Col>
              </Row>

              {/* Submit Button */}
              <div className="d-flex justify-content-center justify-content-md-end py-3 py-md-0 mb-3 mb-md-0">
                <Button
                  variant="primary"
                  className="px-5"
                  type="submit"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Đang cập nhật...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default UserProfileManagement;
