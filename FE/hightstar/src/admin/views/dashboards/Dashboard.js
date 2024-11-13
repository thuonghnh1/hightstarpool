import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Page500 from "../../../common/pages/Page500";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-bootstrap";
import { Container, Row, Col, Card } from "react-bootstrap";
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

function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  const currentYear = new Date().getFullYear();
  // Example data for charts
  const data = [
    {
      month: "T1",
      students: 50,
      revenue: 2400,
      ticketSales: 200,
      ticketRevenue: 1000,
    },
    {
      month: "T2",
      students: 100,
      revenue: 1398,
      ticketSales: 150,
      ticketRevenue: 800,
    },
    {
      month: "T3",
      students: 200,
      revenue: 9800,
      ticketSales: 300,
      ticketRevenue: 2000,
    },
    {
      month: "T4",
      students: 350,
      revenue: 2400,
      ticketSales: 200,
      ticketRevenue: 1000,
    },
    {
      month: "T5",
      students: 540,
      revenue: 1398,
      ticketSales: 150,
      ticketRevenue: 700,
    },
    {
      month: "T6",
      students: 1000,
      revenue: 9800,
      ticketSales: 300,
      ticketRevenue: 2500,
    },
    {
      month: "T7",
      students: 860,
      revenue: 2400,
      ticketSales: 200,
      ticketRevenue: 1200,
    },
    {
      month: "T8",
      students: 500,
      revenue: 1398,
      ticketSales: 150,
      ticketRevenue: 600,
    },
    {
      month: "T9",
      students: 450,
      revenue: 5000,
      ticketSales: 300,
      ticketRevenue: 1500,
    },
    {
      month: "T10",
      students: 320,
      revenue: 9800,
      ticketSales: 300,
      ticketRevenue: 2000,
    },
    {
      month: "T11",
      students: 100,
      revenue: 2500,
      ticketSales: 300,
      ticketRevenue: 1200,
    },
    {
      month: "T12",
      students: 40,
      revenue: 9800,
      ticketSales: 300,
      ticketRevenue: 1000,
    },
  ];

  // tính tổng doanh thu từng tháng cho biểu đồ
  const updatedData = data.map((item) => ({
    ...item,
    totalRevenue: item.revenue + item.ticketRevenue,
  }));

  const revenueByYear = [
    { year: "2020", revenue: 500000 },
    { year: "2021", revenue: 600000 },
    { year: "2022", revenue: 750000 },
    { year: "2023", revenue: 850000 },
  ];

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

  // tính tổng doanh thu và chuyển đổi doanh thu từng năm thành phần trăm
  const totalRevenue = revenueByYear.reduce(
    (acc, data) => acc + data.revenue,
    0
  );
  const revenueData = revenueByYear.map((data) => ({
    year: data.year,
    revenue: ((data.revenue / totalRevenue) * 100).toFixed(2),
  }));

  return (
    <>
      <Helmet>
        <title>Dashboard - Hight Star</title>
      </Helmet>
      {/* Display loader when loading page */}
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0">
          <Container fluid>
            {/* Overview Information */}
            <Row className="mb-2 mb-md-3 mt-4 mt-md-2 py-2 py-md-0">
              <h5 className="fw-bold text-uppercase">Bảng điều khiển</h5>
            </Row>
            <Row>
              <Col md={6} className="mb-4">
                <Card className="text-center shadow-sm ">
                  <Card.Body className="d-flex p-3">
                    <div className="bg-primary px-3 py-2 rounded-2">
                      <i className="bi bi-people display-6 text-white"></i>
                    </div>
                    <div className="ms-3 d-flex flex-column justify-content-center align-items-start text-truncate">
                      <span className="text-secondary fw-medium text-nowrap">
                        Tổng số học viên
                      </span>
                      <h5 className="fw-bold mt-1">3.000 (ng)</h5>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card className="text-center shadow-sm">
                  <Card.Body className="d-flex p-3">
                    <div className="bg-success px-3 py-2 rounded-2">
                      <i className="bi bi-card-checklist display-6 text-white"></i>
                    </div>
                    <div className="ms-3 d-flex flex-column justify-content-center align-items-start text-truncate">
                      <span className="text-secondary fw-medium text-nowrap">
                        Tổng vé đã bán
                      </span>
                      <h5 className="fw-bold mt-1">2.640 (vé)</h5>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card className="text-center shadow-sm">
                  <Card.Body className="d-flex p-3">
                    <div className="bg-warning px-3 py-2 rounded-2">
                      <i className="bi bi-coin display-6 text-white"></i>
                    </div>
                    <div className="ms-3 d-flex flex-column justify-content-center align-items-start text-truncate">
                      <span className="text-secondary fw-medium text-nowrap">
                        Tổng doanh thu năm {currentYear}
                      </span>
                      <h5 className="fw-bold mt-1">3.5 (Tỷ)</h5>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card className="text-center shadow-sm">
                  <Card.Body className="d-flex p-3">
                    <div className="bg-primary px-3 py-2 rounded-2">
                      <i className="bi bi-cart-check display-6 text-white"></i>
                    </div>
                    <div className="ms-3 d-flex flex-column justify-content-center align-items-start text-truncate">
                      <span className="text-secondary fw-medium text-nowrap">
                        Tổng số đơn hàng
                      </span>
                      <h5 className="fw-bold mt-1">500 (đơn)</h5>
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
                      <LineChart data={data}>
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
                      <PieChart width={400} height={400}>
                        <Pie
                          data={revenueByYear}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                          nameKey="year"
                          label
                        >
                          {revenueByYear.map((entry, index) => (
                            <Cell
                              key={`cell-${entry.year}`}
                              fill={
                                COLORS[
                                  revenueByYear.indexOf(entry) % COLORS.length
                                ]
                              } // Đảm bảo sử dụng chỉ số an toàn
                            />
                          ))}
                        </Pie>
                        <Tooltip />
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
                      <BarChart width={600} height={400} data={updatedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} VND`} />
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

            {/* Recent Activities Section */}
            <Row className="mb-4">
              <Col md={12} lg={8}>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-primary text-white">
                    Hoạt động gần đây
                  </Card.Header>
                  <Card.Body>
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span>
                          <i className="bi bi-person-check text-success me-2"></i>{" "}
                          Học viên A đăng ký khóa học B
                        </span>
                        <small className="text-muted">2 giờ trước</small>
                      </li>
                      <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span>
                          <i className="bi bi-ticket-perforated text-warning me-2"></i>{" "}
                          Khách hàng C mua vé tháng
                        </span>
                        <small className="text-muted">1 ngày trước</small>
                      </li>
                      <li className="d-flex justify-content-between align-items-center py-2">
                        <span>
                          <i className="bi bi-credit-card text-info me-2"></i>{" "}
                          Thanh toán thành công cho đơn hàng D
                        </span>
                        <small className="text-muted">3 ngày trước</small>
                      </li>
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
                      <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span>
                          <i className="bi bi-person-circle text-success me-2"></i>{" "}
                          HLV Nguyễn Văn A
                        </span>
                        <span className="text-muted">
                          <i className="bi bi-star-fill text-warning"></i> 4.8
                        </span>
                      </li>
                      <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span>
                          <i className="bi bi-person-circle text-primary me-2"></i>{" "}
                          HLV Lê Thị B
                        </span>
                        <span className="text-muted">
                          <i className="bi bi-star-fill text-warning"></i> 4.6
                        </span>
                      </li>
                      <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <span>
                          <i className="bi bi-person-circle text-primary me-2"></i>{" "}
                          HLV Nguyễn Chí Linh
                        </span>
                        <span className="text-muted">
                          <i className="bi bi-star-fill text-warning"></i> 4.9
                        </span>
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </>
  );
}

export default Dashboard;
