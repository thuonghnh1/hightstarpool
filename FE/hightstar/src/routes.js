import React from "react";

// lazy là hàm (lười) hàm này cho phép ứng dụng chỉ tải các thành phần khi cần thiết (khi người dùng chuyển hướng đến), giúp giảm thời gian tải ban đầu.
const Dashboard = React.lazy(() => import("./admin/views/dashboard/Dashboard"));
const UserManagement = React.lazy(() =>
  import("./admin/views/users/UserManagement")
);
const UserProfile = React.lazy(() =>
  import("./admin/views/users/UserProfile")
);

const routes = [
  { path: "/", exact: true, name: "Bảng điều khiển", element: Dashboard },
  { path: "/user-management", name: "Người dùng", element: UserManagement },
  { path: "/user-profile/:userId", name: "Profile", element: UserProfile },

  //   { path: "/courses", name: "Khóa học", element: Courses },
  //   { path: "/promotions", name: "Ưu đãi", element: Promotions },
  //   { path: "/inventory", name: "Kho hàng", element: Inventory },
  //   { path: "/branches", name: "Chi nhánh", element: Branches },
  //   { path: "/tickets", name: "Soát vé", element: Tickets },
  //   { path: "/sales", name: "Bán hàng", element: Sales },
  //   { path: "/customers", name: "Khách hàng", element: Customers },
  //   { path: "/students", name: "Học viên", element: Students },
  //   { path: "/classes", name: "Lớp học", element: Classes },
  //   { path: "/services", name: "Dịch vụ", element: Services },
  //   { path: "/utilities", name: "Tiện ích", element: Utilities },
  //   { path: "/settings", name: "Cài đặt", element: Settings },
];

// Mảng (routes) được định nghĩa để lưu trữ các đối tượng route. Mỗi đối tượng trong mảng này chứa các thuộc tính:
// path: Đường dẫn URL cho route.
// exact: Tham số này cho biết rằng route này chỉ khớp nếu đường dẫn chính xác, thường được sử dụng để tránh việc khớp với các đường dẫn con.
// name: Tên của route (có thể được sử dụng để điều hướng hoặc hiển thị).
// element: Thành phần sẽ được hiển thị khi người dùng điều hướng đến đường dẫn này.

export default routes;
