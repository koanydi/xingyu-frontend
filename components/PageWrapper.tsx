import Navbar from "./Navbar";
import StarField from "./StarField";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-bg">
      <div className="grid-overlay" />
      <StarField />
      <Navbar />
      <main style={{ paddingTop: 64, position: "relative", zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
