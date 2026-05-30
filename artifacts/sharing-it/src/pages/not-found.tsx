import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import LayoutContainer from "../components/layout/LayoutContainer";

export default function NotFound() {
  return (
    <LayoutContainer title="404 Node Lost - Sharing It">
      <div className="min-h-[80vh] w-full flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500 opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full text-center relative z-10">
          <div className="w-24 h-24 rounded-[2rem] bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mx-auto mb-8 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-rose-500/10" />
            <AlertTriangle className="w-10 h-10 text-rose-500 relative z-10" />
          </div>

          <h1 className="text-6xl font-extrabold font-display text-[var(--text-primary)] tracking-tight mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Node Not Found</h2>
          <p className="text-base text-[var(--text-secondary)] font-medium leading-relaxed mb-10">
            The requested sector does not exist or the node has self-destructed. Ensure your coordinates are correct.
          </p>

          <Link to="/" className="btn-primary !rounded-full !px-8">
            <span>Return to Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </LayoutContainer>
  );
}
