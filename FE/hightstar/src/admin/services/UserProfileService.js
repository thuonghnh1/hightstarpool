// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const UserProfileService = ({ userId = 1 }) => {
//   const [profile, setProfile] = useState({
//     fullName: "",
//     avatar: "",
//     phoneNumber: "",
//     dateOfBirth: "",
//     gender: true,
//     bio: "",
//   });

//   useEffect(() => {
//     axios
//       .get(`/api/user-profile/${userId}`)
//       .then((response) => setProfile(response.data))
//       .catch((error) => console.error("Lỗi khi lấy dữ liệu hồ sơ", error));
//   }, [userId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfile({ ...profile, [name]: value });
//   };

//   const handleSubmit = () => {
//     axios
//       .post(`/api/user-profile`, profile)
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

// export default UserProfileService;
