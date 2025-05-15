import logo_icon from "../../Assets/logo_icon.png";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const IconLoading = () => {
  const logoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Logo rotation animation
    gsap.to(logoRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 2,
      ease: "linear",
    });

    // Background gradient animation
    gsap.to(containerRef.current, {
      background: "linear-gradient(90deg, gray, lightblue)",
      backgroundSize: "200% 200%",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex justify-center items-center"
      style={{ overflow: "hidden" }}
    >
      <img
        ref={logoRef}
        src={logo_icon}
        alt="Loading"
        style={{ width: "150px", height: "150px" }}
      />
    </div>
  );
};

export default IconLoading;
