import SafeImage from "./SafeImage";
import { normalizeImageUrl } from "@/lib/images";

const sizeClasses = {
  sm: { box: "w-8 h-8", text: "text-xs" },
  md: { box: "w-10 h-10", text: "text-sm" },
  lg: { box: "w-16 h-16", text: "text-xl" },
};

export default function UserAvatar({ user, size = "md" }) {
  const name = user?.name || "User";
  const image = normalizeImageUrl(user?.image);
  const classes = sizeClasses[size] || sizeClasses.md;

  if (image) {
    return (
      <div className={`${classes.box} rounded-full overflow-hidden shrink-0 border border-default relative bg-elevated`}>
        <SafeImage src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${classes.box} ${classes.text} rounded-full flex items-center justify-center font-bold avatar-brand shrink-0`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}



