import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function JoinCommunity() {
  return (
    <section className="px-4 py-16 max-w-3xl mx-auto">
      <div className="premium-banner rounded-2xl p-10 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-3">
          Ready to Start Cooking?
        </h2>
        <p className="text-secondary text-sm mb-8 max-w-md mx-auto leading-relaxed">
          Join food enthusiasts sharing recipes daily. Create your free account
          and start sharing today.
        </p>
        <Link
          href="/register"
          className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm"
        >
          Create Free Account
          <FiArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}


