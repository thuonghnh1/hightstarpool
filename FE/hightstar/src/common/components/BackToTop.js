import React, { useState, useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 800, // Thời gian cuộn (ms)
      smooth: "easeInOutQuart", // Hiệu ứng mượt mà
    });
  };

  return (
    <div className="">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="back-to-top rounded-circle btn me-sm-3 mb-sm-3"
        >
          <i className="bi bi-caret-up-fill"></i>
        </button>
      )}
    </div>
  );
};

export default BackToTop;
