import Image from "next/image";
import { normalizeImageUrl } from "@/lib/images";

function isGoogleImage(src) {
  try {
    const { hostname } = new URL(src);
    return hostname.endsWith(".googleusercontent.com");
  } catch {
    return false;
  }
}

function canUseNextImage(src) {
  if (isGoogleImage(src)) return false;

  try {
    const { hostname } = new URL(src);
    return (
      hostname === "res.cloudinary.com" ||
      hostname === "i.ibb.co" ||
      hostname.endsWith(".ibb.co")
    );
  } catch {
    return false;
  }
}

export default function SafeImage({
  src,
  alt = "",
  fill = false,
  className = "",
  sizes,
  width,
  height,
}) {
  const normalizedSrc = normalizeImageUrl(src);
  if (!normalizedSrc) return null;

  if (canUseNextImage(normalizedSrc)) {
    if (fill) {
      return (
        <Image
          src={normalizedSrc}
          alt={alt}
          fill
          className={className}
          sizes={sizes}
          unoptimized
        />
      );
    }

    return (
      <Image
        src={normalizedSrc}
        alt={alt}
        width={width || 400}
        height={height || 300}
        className={className}
        unoptimized
      />
    );
  }

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={normalizedSrc}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={normalizedSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      referrerPolicy="no-referrer"
    />
  );
}




