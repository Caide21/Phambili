import React from "react";
import Test from "@/components/Cards/Test";

export default function TestPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0f14",
        padding: "2rem",
      }}
    >
      <div style={{ width: "min(90vw, 1024px)" }}>
        <Test
          size={1024}
          alternate={true}                 // flip to false for same-direction spin
          svgFile="/brand/Phambili_Portal.svg"
          ariaLabel="Phambili brand portal with alternating rings"
        />
      </div>
    </div>
  );
}
