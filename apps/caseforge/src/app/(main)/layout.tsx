import { StudioSidebar } from "../../components/StudioSidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg-primary">
      <StudioSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-content">{children}</div>
      </div>
    </div>
  );
}
