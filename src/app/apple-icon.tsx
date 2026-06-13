import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 40,
            background: "#0d1117",
            opacity: 0.2,
            display: "flex",
          }}
        />
        <span
          style={{
            color: "white",
            fontWeight: 900,
            fontSize: 80,
            letterSpacing: "-3px",
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
