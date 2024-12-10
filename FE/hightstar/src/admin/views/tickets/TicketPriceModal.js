import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import TicketPriceService from "../../services/TicketPriceService";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";

const TicketPriceModal = ({ show, onClose, ticketTypes }) => {
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTicketTypeChange = async (selectedOption) => {
    setSelectedTicketType(selectedOption);
    if (selectedOption) {
      setLoading(true);
      try {
        const ticketPriceData =
          await TicketPriceService.getTicketPriceByTicketType(
            selectedOption.value
          );
        setTicketPrice(ticketPriceData.price || "");
      } catch (error) {
        setError("Không thể lấy giá vé cho loại vé này.");
      } finally {
        setLoading(false);
      }
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedTicketType || !ticketPrice) {
      setError("Vui lòng chọn loại vé và nhập giá vé.");
      return;
    }

    setLoading(true);
    try {
      await TicketPriceService.updateTicketPrice(selectedTicketType.value, {
        price: ticketPrice,
      });
      toast.success("Cập nhật giá vé thành công!");
      onClose();
    } catch (error) {
      setError("Lỗi khi cập nhật giá vé.");
    } finally {
      setLoading(false);
    }
  };

  // Đóng modal
  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật giá vé</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Chọn loại vé */}
          <Form.Group controlId="formTicketType" className="mb-3">
            <Form.Label>Chọn loại vé</Form.Label>
            <Select
              options={ticketTypes}
              value={selectedTicketType}
              onChange={handleTicketTypeChange}
              placeholder="Chọn loại vé"
              isLoading={loading} // Hiển thị loading khi đang chọn loại vé
            />
          </Form.Group>

          <Form.Group controlId="formTicketPrice" className="mb-3">
            <Form.Label>Giá vé</Form.Label>
            <NumericFormat
              customInput={Form.Control} // Dùng Form.Control cho consistency với các trường khác
              value={ticketPrice}
              onValueChange={(values) => {
                // Lấy giá trị số sau khi định dạng
                setTicketPrice(values.value);
                setError("");
              }}
              thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
              decimalScale={0} // Không cho phép số thập phân
              allowNegative={false} // Không cho phép nhập số âm
              placeholder="Nhập giá vé"
              suffix=" VNĐ"
            />
          </Form.Group>

          {/* Hiển thị lỗi */}
          {error && <div className="text-danger">{error}</div>}

          {/* Hiển thị spinner khi đang xử lý */}
          {loading && (
            <div className="d-flex justify-content-center mt-3">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading} // Vô hiệu hóa nút "Cập nhật" khi đang xử lý
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"} {/* Thay đổi tên nút */}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TicketPriceModal;
