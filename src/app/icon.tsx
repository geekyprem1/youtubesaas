import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Dark inner bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 7,
            background: "#0d1117",
            opacity: 0.25,
            display: "flex",
          }}
        />
        <span
          style={{
            color: "white",
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: "-0.5px",
            lineHeight: 1,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          IQ
        </span>
      </div>
    ),
    { ...size }
  );
}
