// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const UserProfile = ({ userId = 1 }) => {
//   const [profile, setProfile] = useState({
//     fullName: "",
//     avatar: "",
//     phoneNumber: "",
//     dateOfBirth: "",
//     gender: true,
//     bio: "",
//   });

//   // Lấy thông tin hồ sơ người dùng khi component được load
//   useEffect(() => {
//     axios
//       .get(`/api/user-profile/${userId}`)
//       .then((response) => setProfile(response.data))
//       .catch((error) => console.error("Lỗi khi lấy dữ liệu hồ sơ", error));
//   }, [userId]);

//   // Xử lý thay đổi giá trị các trường trong hồ sơ
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfile({ ...profile, [name]: value });
//   };

//   // Xử lý khi người dùng cập nhật hồ sơ
//   const handleSubmit = () => {
//     axios
//       .put(`/api/user-profile/${userId}`, profile)
//       .then((response) => alert("Cập nhật hồ sơ thành công"))
//       .catch((error) => console.error("Lỗi khi cập nhật hồ sơ", error));
//   };

//   return (
//     <div className="profile-page">
//       <h2>Thông tin tài khoản</h2>
//       <div className="profile-info">
//         <img src={profile.avatar || "/default-avatar.png"} alt="Avatar" />
//         <input
//           type="text"
//           name="fullName"
//           value={profile.fullName}
//           onChange={handleInputChange}
//           placeholder="Họ tên"
//         />
//         <input type="email" name="email" value={profile.email || ""} readOnly />
//         <input
//           type="text"
//           name="phoneNumber"
//           value={profile.phoneNumber}
//           onChange={handleInputChange}
//           placeholder="Số điện thoại"
//         />
//         <div>
//           <label>
//             <input
//               type="radio"
//               name="gender"
//               value={true}
//               checked={profile.gender === true}
//               onChange={() => setProfile({ ...profile, gender: true })}
//             />
//             Nam
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="gender"
//               value={false}
//               checked={profile.gender === false}
//               onChange={() => setProfile({ ...profile, gender: false })}
//             />
//             Nữ
//           </label>
//         </div>
//         <input
//           type="date"
//           name="dateOfBirth"
//           value={profile.dateOfBirth || ""}
//           onChange={handleInputChange}
//         />
//         <button onClick={handleSubmit}>Lưu</button>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = ({ userId = 1 }) => {
  const [profile, setProfile] = useState({
    fullName: "",
    avatar: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: true,
    bio: "",
  });

  // Lấy thông tin hồ sơ người dùng khi component được load
  useEffect(() => {
    axios
      .get(`/api/user-profile/${userId}`)
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu hồ sơ", error));
  }, [userId]);

  // Xử lý thay đổi giá trị các trường trong hồ sơ
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Xử lý khi người dùng cập nhật hồ sơ
  const handleSubmit = () => {
    axios
      .put(`/api/user-profile/${userId}`, profile)
      .then((response) => alert("Cập nhật hồ sơ thành công"))
      .catch((error) => console.error("Lỗi khi cập nhật hồ sơ", error));
  };
  console.log("t đang đây");
  return (
    <div className="profile-page">
      <h2>Thông tin tài khoản</h2>
      <div className="profile-info">
        {/* Avatar */}
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt="Avatar"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />

        {/* Họ tên */}
        <input
          type="text"
          name="fullName"
          value={profile.fullName}
          onChange={handleInputChange}
          placeholder="Họ tên"
        />

        {/* Email */}
        <input type="email" name="email" value={profile.email || ""} readOnly />

        {/* Số điện thoại */}
        <input
          type="text"
          name="phoneNumber"
          value={profile.phoneNumber}
          onChange={handleInputChange}
          placeholder="Số điện thoại"
        />

        {/* Giới tính */}
        <div>
          <label>
            <input
              type="radio"
              name="gender"
              value={true}
              checked={profile.gender === true}
              onChange={() => setProfile({ ...profile, gender: true })}
            />
            Nam
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value={false}
              checked={profile.gender === false}
              onChange={() => setProfile({ ...profile, gender: false })}
            />
            Nữ
          </label>
        </div>

        {/* Ngày sinh */}
        <input
          type="date"
          name="dateOfBirth"
          value={profile.dateOfBirth || ""}
          onChange={handleInputChange}
        />

        {/* Cập nhật */}
        <button onClick={handleSubmit}>Lưu</button>
      </div>
    </div>
  );
};

export default UserProfile;
