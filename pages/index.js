// pages/index.js
import React from "react";
import Head from "next/head";
import ReactorPlaceholder from "@/components/Scene/ReactorPlaceholder";
import PhambiliPortal from "@/components/Cards/PhambiliPortal";

// Angles for the 5 orbiting portals (degrees around the circle)
const PORTALS = [
  { key: "msw",     angle: 90  },
  { key: "clean",   angle: 18  },
  { key: "agri",    angle: 162 },
  { key: "plastic", angle: 234 },
  { key: "biosol",  angle: 306 },
];

// Helper: place a child at polar angle using rotate→translate→counter-rotate
function PortalAtAngle({ angleDeg, children }) {
  const rotate = `rotate(${angleDeg}deg)`;
  const back   = `rotate(${-angleDeg}deg)`;
  const radius = "var(--orbit-radius)";
  return (
    <div
      className="portal-node"
      style={{ transform: `${rotate} translate(${radius}) ${back}` }}
    >
      <div className="portal-inner">{children}</div>
    </div>
  );
}

function Home() {
  return (
    <>
      <Head>
        <title>Phambili — Waste to Value</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Directly on the site background; PageShell provides the nav */}
      <main className="min-h-screen w-full">
        <section className="mx-auto max-w-[1200px] px-6 py-10">
          <div className="orbit-stage">
            {/* Center reactor */}
            <ReactorPlaceholder />

            {/* Orbiting portals (no grey plates, no labels) */}
            {PORTALS.map((p, i) => (
              <PortalAtAngle key={p.key} angleDeg={p.angle}>
                <PhambiliPortal
                  showPlate={false}
                  label=""
                  direction={i % 2 === 0 ? "cw" : "ccw"}
                />
              </PortalAtAngle>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

// IMPORTANT: let _app.js wrap with PageShell (don’t disable it here)
export default Home;
