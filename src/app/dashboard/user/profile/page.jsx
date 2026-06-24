"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { uploadProfileImage } from "@/lib/cloudinary";
import UserAvatar from "@/components/UserAvatar";
import SafeImage from "@/components/SafeImage";
import Loader from "@/components/Loader";
import {
  FiUser,
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
  FiImage,
} from "react-icons/fi";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Profile — RecipeHub";
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(session.user.name || "");
    setImage(session.user.image || "");
  }, [session]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const url = await uploadProfileImage(file);
      setImage(url);
      setSuccess("Profile image uploaded.");
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { error: updateError } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim(),
      });

      if (updateError) {
        throw new Error(updateError.message || "Failed to update profile");
      }

      await authClient.getSession();
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) return <Loader />;
  if (!session?.user) return null;

  return (
    <div className="max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">Profile</h1>
        <p className="text-sm text-muted mt-1">Update your name and image</p>
      </div>

      <div className="card p-6 md:p-8">
        <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-default">
          <UserAvatar user={{ name, image }} size="lg" />
          <p className="font-semibold text-primary mt-4">{name || session.user.name}</p>
          <p className="text-sm text-muted">{session.user.email}</p>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-xl text-sm alert-success flex items-center gap-2">
            <FiCheckCircle size={16} />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm alert-error flex items-center gap-2">
            <FiAlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="profile-name" className="text-xs text-muted mb-1.5 block font-medium">
              Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                required
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-3 input-field text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted mb-1.5 block font-medium">Image</label>
            <label
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-sm border border-dashed border-default bg-card transition-colors ${
                uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer text-secondary hover:text-primary hover:border-brand"
              }`}
            >
              {uploading ? (
                <span>Uploading to Cloudinary...</span>
              ) : (
                <>
                  <FiUpload size={16} />
                  <span>Choose image from PC or phone</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading || saving}
              />
            </label>

            {image ? (
              <div className="mt-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-default bg-elevated mx-auto">
                  <SafeImage src={image} alt="Profile preview" fill className="object-cover" />
                </div>
                <p className="text-xs text-muted mt-2 flex items-center gap-1 break-all">
                  <FiImage size={12} className="shrink-0" />
                  {image}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted mt-2">
                Image uploads to Cloudinary. The returned link is saved on your profile.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-primary w-full py-3 text-sm mt-2 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
