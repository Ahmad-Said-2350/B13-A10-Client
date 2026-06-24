import Link from "next/link";
import { GiCookingPot } from "react-icons/gi";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 badge-brand">
        <GiCookingPot size={36} />
      </div>
      <h1 className="text-3xl font-display font-bold text-primary mb-3">
        This recipe doesn&apos;t exist
      </h1>
      <p className="text-secondary text-sm mb-8 max-w-sm leading-relaxed">
        Looks like this page went missing from our cookbook. Let&apos;s get you back to
        delicious recipes.
      </p>
      <Link href="/" className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2">
        <FiArrowLeft size={14} />
        Back to Home
      </Link>
    </div>
  );
}
