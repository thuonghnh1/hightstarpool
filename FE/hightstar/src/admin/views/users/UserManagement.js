// function UserManagement() {
//   return (
//     <div className="user-management mh-100 fw-bold fs-3 m-auto">
//       QUẢN LÝ NGƯỜI DÙNG
//     </div>
//   );
// }

// export default UserManagement;

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/UserManagement.css";
import axios from "axios";

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    Username: "",
    Password: "",
    Email: "",
    Role: "User",
    RegisteredDate: new Date().toISOString().split("T")[0], // Ngày hiện tại
  });

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3001/api/users");
  //       setUsers(response.data);
  //     } catch (error) {
  //       console.error("Có lỗi khi lấy dữ liệu người dùng:", error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users");
        setUsers(
          response.data.length > 0 ? response.data : generateSampleUsers()
        );
      } catch (error) {
        console.error("Có lỗi khi lấy dữ liệu người dùng:", error);
        setUsers(generateSampleUsers()); // Nếu có lỗi, sử dụng dữ liệu mẫu
      }
    };

    const generateSampleUsers = () => {
      return [
        {
          UserId: 1,
          Username: "Nguyễn Thị A Ly",
          Password: "pass1",
          Email: "lynta@gmail.com",
          Role: "Admin",
          Status: true,
        },
        {
          UserId: 2,
          Username: "Trần Quang Hiệp",
          Password: "pass2",
          Email: "hieptq@gmail.com",
          Role: "User",
          Status: true,
        },
        {
          UserId: 3,
          Username: "Lê Minh Beo",
          Password: "pass3",
          Email: "beolm@gmail.com",
          Role: "Admin",
          Status: true,
        },
        {
          UserId: 4,
          Username: "Hải Âu",
          Password: "pass4",
          Email: "auh@gmail.com",
          Role: "User",
          Status: false,
        },
        {
          UserId: 5,
          Username: "Nguyễn Việt Kiều",
          Password: "pass5",
          Email: "kieunv@gmail.com",
          Role: "User",
          Status: true,
        },
        {
          UserId: 6,
          Username: "Đình Quang Trọng",
          Password: "pass6",
          Email: "trongdq@gmail.com",
          Role: "User",
          Status: false,
        },
        {
          UserId: 7,
          Username: "Pham Quang Linh",
          Password: "pass7",
          Email: "linhpq@gmail.com",
          Role: "Admin",
          Status: true,
        },
        {
          UserId: 8,
          Username: "Hoàng Thái Tam",
          Password: "pass8",
          Email: "tamht@gmail.com",
          Role: "User",
          Status: true,
        },
      ];
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    setUsers(users.filter((user) => user.UserId !== userId));
  };

  const handleAddUser = () => {
    setShowAddUserForm(true);
  };

  const handleSaveUser = () => {
    // Tạo ID mới
    const newUserId = users.length + 1;

    const userToAdd = {
      UserId: newUserId,
      ...newUser,
      Status: true, // Mặc định trạng thái là Kích hoạt
    };

    setUsers([...users, userToAdd]); // Thêm người dùng vào danh sách
    setShowAddUserForm(false); // Ẩn modal sau khi lưu
    setNewUser({
      // Đặt lại giá trị mặc định cho user mới
      Username: "",
      Password: "",
      Email: "",
      Role: "User",
      RegisteredDate: new Date().toISOString().split("T")[0],
    });
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center text-dark mb-4">Quản lý người dùng</h1>

      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Tìm kiếm theo tên đăng nhập..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary me-2" onClick={() => {}}>
          Lọc
        </button>
        <button className="btn btn-success" onClick={handleAddUser}>
          Thêm
        </button>
      </div>

      {/* Overlay khi modal hiển thị */}
      {showAddUserForm && (
        <div className="overlay" onClick={() => setShowAddUserForm(false)}>
          <div
            className={`modal ${showAddUserForm ? "show" : ""}`}
            style={{ display: showAddUserForm ? "block" : "none" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thêm người dùng mới</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddUserForm(false)}
                  ></button>
                </div>
                <div
                  className="modal-body"
                  onClick={(e) => e.stopPropagation()}
                >
                  <form>
                    <div className="mb-3">
                      <label>Tên đăng nhập:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUser.Username}
                        onChange={(e) =>
                          setNewUser({ ...newUser, Username: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Mật khẩu:</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newUser.Password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, Password: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Email:</label>
                      <input
                        type="email"
                        className="form-control"
                        value={newUser.Email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, Email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Vai trò:</label>
                      <select
                        className="form-select"
                        value={newUser.Role}
                        onChange={(e) =>
                          setNewUser({ ...newUser, Role: e.target.value })
                        }
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleSaveUser}
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary ms-2"
                      onClick={() => setShowAddUserForm(false)}
                    >
                      Hủy
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th className="text-center">ID</th>
            <th className="text-center">Tên đăng nhập</th>
            <th className="text-center">Email</th>
            <th className="text-center">Quyền</th>
            <th className="text-center">Trạng thái</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.UserId}>
              <td>{user.UserId}</td>
              <td>{user.Username}</td>
              <td>{user.Email}</td>
              <td>{user.Role}</td>
              <td>{user.Status ? "Kích hoạt" : "Không kích hoạt"}</td>
              <td>
                <button className="btn btn-info me-2" onClick={() => {}}>
                  Xem
                </button>
                <button className="btn btn-warning me-2" onClick={() => {}}>
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.UserId)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={handlePrevPage}>
              Trước
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
              key={index}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button className="page-link" onClick={handleNextPage}>
              Tiếp theo
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserManagement;
