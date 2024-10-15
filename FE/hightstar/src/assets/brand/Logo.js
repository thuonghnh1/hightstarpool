import React from "react";

const Logo = () => {
  return (
    <img
      src="data:image/png;base64,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"
      alt="Logo"
      width="180" // Thu nhỏ ảnh lại
      height="100%" // Giữ tỷ lệ của ảnh
      className=""
    />
  );
};

export default Logo;