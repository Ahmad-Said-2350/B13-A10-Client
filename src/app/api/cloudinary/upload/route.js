import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

function ensureCloudinary() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();

  if (cloudinaryUrl) {
    cloudinary.config({ secure: true });
    return true;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return true;
}

export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return Response.json({ message: "Please log in to upload images" }, { status: 401 });
    }

    if (!ensureCloudinary()) {
      return Response.json(
        {
          message:
            "Cloudinary is not configured. Add CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET to client/.env, then restart npm run dev.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");
    const folder = String(formData.get("folder") || "uploads").trim();

    if (!file || typeof file === "string") {
      return Response.json({ message: "Please select an image file" }, { status: 400 });
    }

    const isImage =
      file.type?.startsWith("image/") ||
      /\.(jpe?g|png|gif|webp|bmp)$/i.test(file.name || "");

    if (!isImage) {
      return Response.json({ message: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ message: "Image must be under 10 MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: `recipehub/${folder}`,
      resource_type: "image",
    });

    if (!result.secure_url) {
      return Response.json({ message: "Cloudinary did not return an image URL" }, { status: 500 });
    }

    return Response.json({ url: result.secure_url });
  } catch (err) {
    return Response.json({ message: err.message || "Upload failed" }, { status: 500 });
  }
}
