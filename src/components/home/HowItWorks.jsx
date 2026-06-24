import Link from "next/link";
import { FiSearch, FiEdit3, FiUsers } from "react-icons/fi";

const steps = [
  {
    icon: FiSearch,
    title: "Discover",
    desc: "Browse thousands of recipes from food lovers around the world.",
  },
  {
    icon: FiEdit3,
    title: "Create",
    desc: "Share your own culinary creations with the community.",
  },
  {
    icon: FiUsers,
    title: "Connect",
    desc: "Like, save favorites, and interact with fellow food enthusiasts.",
  },
];


export default function HowItWorks() {
  return (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      <p className="section-label text-center mb-2">How It Works</p>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-primary text-center mb-10">
        Three Simple Steps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card card-hover flex flex-col items-center text-center p-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 badge-brand">
              <Icon size={24} />
            </div>
            <h3 className="font-display font-semibold text-primary mb-2">{title}</h3>
            <p className="text-sm text-secondary leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
