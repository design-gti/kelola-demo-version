export default function TeamProfilePage() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", flexDirection: "column", gap: 12,
      fontFamily: "Open Sans, sans-serif",
    }}>
      <div style={{ fontSize: 40, color: "#dee2e6" }}>👥</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#495057" }}>Team Profile</div>
      <div style={{ fontSize: 13, color: "#adb5bd" }}>Halaman dalam pengembangan</div>
    </div>
  );
}
