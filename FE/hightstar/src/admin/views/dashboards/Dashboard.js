import { useCallback, useEffect, useState } from "react";
// import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import DashboardService from "../../services/DashboardService";
import { formatNumber, formatRevenue } from "../../utils/Formatter";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [monthlyStatistics, setMonthlyStatistics] = useState([]);
  const [revenueByYear, setRevenueByYear] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topTrainers, setTopTrainers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook để điều hướng

  const fetchStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await DashboardService.getDashboardStatistics();
      setStatistics(data);
      const monthlyData = await DashboardService.getMonthlyStatistics(
        currentYear
      );
      setMonthlyStatistics(monthlyData);
      const revenueData = await DashboardService.getRevenueByYear();
      setRevenueByYear(revenueData);
      console.log(revenueData);
      const activities = await DashboardService.getRecentActivities(10);
      setRecentActivities(activities);
      const trainers = await DashboardService.getTopTrainers(5);
      setTopTrainers(trainers);
      setError(null);
    } catch (error) {
      setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [currentYear]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Tính tổng doanh thu từng tháng cho biểu đồ từ dữ liệu API
  const updatedData = monthlyStatistics.map((item) => ({
    month: item.month,
    students: item.studentsRegistered,
    ticketSales: item.ticketsSold,
    productsSold: item.productsSold,
    totalRevenue: item.ticketsSold * 1000 + item.productsSold * 2000, // Ví dụ tính tổng doanh thu
  }));

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

  return (
    <>
      <Helmet>
        <title>Dashboard - Hight Star</title>
      </Helmet>
      {/* Display loader when loading page */}

      <section className="row m-0 p-0">
        <Container fluid>
          {/* Overview Information */}
          <Row className="mb-2 mb-md-3 mt-4 mt-md-2 py-2 py-md-0">
            <h5 className="fw-bold text-uppercase">Bảng điều khiển</h5>
          </Row>
          {error && (
            <Row>
              <Col>
                <Alert variant="danger">{error}</Alert>
              </Col>
            </Row>
          )}
          <Row>
            {/* Tổng số học viên */}
            <Col md={6} className="mb-4">
              <Card
                className="text-center shadow-sm"
                onClick={() => navigate("/admin/student-management")}
                style={{ cursor: "pointer" }}
              >
                <Card.Body className="d-flex p-3">
                  <div className="bg-primary px-3 py-2 rounded-2">
                    <i className="bi bi-people display-6 text-white"></i>
                  </div>
                  <div className="ms-3 d-flex flex-column justify-content-center align-items-start text-truncate">
                    <span className="text-secondary fw-medium text-nowrap">
                      Tổng số học viên
                    </span>
                    {isLoading ? (
                      <Skeleton height={24} width={80} />
                    ) : (
                      <h5 className="fw-bold mt-1">
                        {formatNumber(statistics.totalStudents)} (học viên)
                      </h5>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Tổng vé đã bán */}
            <Col md={6} className="mb-4">
              <Card
                className="text-center shadow-sm"
                onClick={() => navigate("/admin/ticket/ticket-management")}
                style={{ cursor: "pointer" }}
              >
                <Card.Body className="d-flex p-3">
                  <div className="bg-success px-3 py-2 rounded-2">
                    <i className="bi bi-card-checklist display-6 text-white"></i>
                  </div>
                  <div className="ms-3 d-flex flex-column justify-content-center align-items-start text-truncate">
                    <span className="text-secondary fw-medium text-nowrap">
                      Tổng vé đã bán
                    </span>
                    {isLoading ? (
                      <Skeleton height={24} width={80} />
                    ) : (
                      <h5 className="fw-bold mt-1">
                        {formatNumber(statistics.totalTicketsSold)} (vé)
                      </h5>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Tổng doanh thu năm hiện tại */}
            <Col md={6} className="mb-4">
              <Card className="text-center shadow-sm">
                <Card.Body
                  className="d-flex p-3"
                  onClick={() => navigate("/admin/order-management")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="bg-warning px-3 py-2 rounded-2">
                    <i className="bi bi-coin display-6 text-white"></i>
                  </div>
                  <div className="ms-3 d-flex flex-column justify-content-center align-items-start text-truncate">
                    <span className="text-secondary fw-medium text-nowrap">
                      Tổng doanh thu năm {currentYear}
                    </span>
                    {isLoading ? (
                      <Skeleton height={24} width={120} />
                    ) : (
                      <h5 className="fw-bold mt-1">
                        {formatRevenue(statistics.totalRevenue)}
                      </h5>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Tổng số đơn hàng */}
            <Col md={6} className="mb-4">
              <Card
                className="text-center shadow-sm"
                onClick={() => navigate("/admin/order-management")}
                style={{ cursor: "pointer" }}
              >
                <Card.Body className="d-flex p-3">
                  <div className="bg-primary px-3 py-2 rounded-2">
                    <i className="bi bi-cart-check display-6 text-white"></i>
                  </div>
                  <div className="ms-3 d-flex flex-column justify-content-center align-items-start text-truncate">
                    <span className="text-secondary fw-medium text-nowrap">
                      Tổng số đơn hàng
                    </span>
                    {isLoading ? (
                      <Skeleton height={24} width={80} />
                    ) : (
                      <h5 className="fw-bold mt-1">
                        {formatNumber(statistics.totalOrders)} (đơn)
                      </h5>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Charts Section */}
          <Row>
            <Col lg={12}>
              <Card className="mb-4 shadow-sm">
                <Card.Body className="pe-4 py-4">
                  <Card.Title className="mb-4 px-3 py-2 fw-bold text-secondary">
                    Số lượng học viên đăng ký và số vé bơi đã bán trong năm (
                    {currentYear})
                  </Card.Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={updatedData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="students"
                        stroke="#8884d8"
                        name="Học viên"
                      />
                      <Line
                        type="monotone"
                        dataKey="ticketSales"
                        stroke="#82ca9d"
                        name="Vé bơi"
                      />
                      <Line
                        type="monotone"
                        dataKey="productsSold"
                        stroke="#FF6384"
                        name="Sản phẩm"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="mb-4 shadow-sm">
                <Card.Body className="pe-4">
                  <Card.Title className="mb-4 px-3 py-2 fw-bold text-secondary">
                    Tỉ lệ doanh thu trong từng năm
                  </Card.Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueByYear}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                        nameKey="year"
                        label={({ value }) => {
                          const formattedValue = formatRevenue(value);
                          return formattedValue;
                        }}
                      >
                        {revenueByYear.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.year}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${formatRevenue(value)}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="mb-4 shadow-sm">
                <Card.Body className="pe-4">
                  <Card.Title className="mb-4 px-3 py-2 fw-bold text-secondary">
                    Doanh thu trong từng tháng
                  </Card.Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={updatedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => `${formatRevenue(value)}`}
                      />
                      <Legend />
                      <Bar
                        dataKey="totalRevenue"
                        fill="#36A2EB"
                        name="Doanh thu"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Phần Hoạt động gần đây và Huấn luyện viên hàng đầu */}
          <Row className="mb-4">
            <Col md={12} lg={8}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-primary text-white">
                  Hoạt động gần đây
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled mb-0">
                    {isLoading ? (
                      <>
                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <Skeleton width={200} height={20} />
                          <Skeleton width={100} height={20} />
                        </li>
                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <Skeleton width={200} height={20} />
                          <Skeleton width={100} height={20} />
                        </li>
                        <li className="d-flex justify-content-between align-items-center py-2">
                          <Skeleton width={200} height={20} />
                          <Skeleton width={100} height={20} />
                        </li>
                      </>
                    ) : (
                      recentActivities.map((activity, index) => (
                        <li
                          key={index}
                          className="d-flex justify-content-between align-items-center py-2 border-bottom"
                        >
                          <span className="d-flex align-items-center">
                            <i
                              className={`${activity.icon} text-primary me-2`}
                            ></i>
                            {activity.description}
                          </span>
                          <small className="text-muted text-nowrap ms-2">
                            {activity.timestamp}
                          </small>
                        </li>
                      ))
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={4}>
              <Card className="shadow-sm">
                <Card.Header className="bg-success text-white">
                  Huấn luyện viên hàng đầu
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled mb-0">
                    {isLoading ? (
                      // Hiển thị skeleton khi dữ liệu đang tải
                      <>
                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <Skeleton width={150} height={20} />
                          <Skeleton width={50} height={20} />
                        </li>
                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <Skeleton width={150} height={20} />
                          <Skeleton width={50} height={20} />
                        </li>
                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <Skeleton width={150} height={20} />
                          <Skeleton width={50} height={20} />
                        </li>
                      </>
                    ) : (
                      topTrainers.map((trainer, index) => (
                        <li
                          key={index}
                          className="d-flex justify-content-between align-items-center py-2 border-bottom"
                        >
                          <span>
                            <i className="bi bi-person-circle text-success me-2 fs-5"></i>{" "}
                            {trainer.trainerName}
                          </span>
                          <span className="text-muted">
                            <i className="bi bi-star-fill text-warning"></i>{" "}
                            {trainer.rating}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Dashboard;
