// pages/playground.js
// Playground page – simple centered image demo.
// Uses PhambiliLayout to stay consistent with system pipeline.

import React from "react";
import PhambiliLayout from "@/components/Layout/PhambiliLayout";

export default function Playground() {
  return (
    <PhambiliLayout>
      <div className="flex items-center justify-center min-h-screen">
        <img
          src="/images/playground-photo.jpg" // <- put your image in /public/images
          alt="Playground Demo"
          className="max-w-md w-full rounded-2xl shadow-lg"
        />
      </div>
    </PhambiliLayout>
  );
}
