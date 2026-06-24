import Link from "next/link";
import { HiOutlineSquares2X2 } from "react-icons/hi2";

export default function Logo({ href = "/", className = "", showIcon = true, onClick }) {
  const content = (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      {showIcon && (
        <span className="w-7 h-7 rounded-md flex items-center justify-center avatar-brand shrink-0">
          <HiOutlineSquares2X2 size={14} />
        </span>
      )}
      <span className="text-primary">
        Recipe<span className="text-brand">Hub</span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
