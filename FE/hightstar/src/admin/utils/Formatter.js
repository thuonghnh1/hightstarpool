export const formatNumber = (number) => {
  return new Intl.NumberFormat("vi-VN").format(number);
};

export const formatRevenue = (number) => {
  if (number < 1_000_000) {
    return `${formatNumber(number)} VNĐ`;
  } else if (number < 1_000_000_000) {
    const million = number / 1_000_000;
    return `${formatNumber(million.toFixed(2))} (Triệu VNĐ)`;
  } else {
    const billion = number / 1_000_000_000;
    return `${formatNumber(billion.toFixed(2))} Tỷ VNĐ`;
  }
};
