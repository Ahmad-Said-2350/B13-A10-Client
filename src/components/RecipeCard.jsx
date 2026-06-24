import Link from "next/link";
import { FiClock, FiHeart, FiArrowRight, FiGlobe } from "react-icons/fi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import SafeImage from "@/components/SafeImage";
import { getRecipeHref } from "@/lib/recipes";

export default function RecipeCard({ recipe, showLikes = false, showAuthor = false, linkable = true }) {
  const href = getRecipeHref(recipe);

  const content = (
    <>
      <div className="relative w-full h-40 bg-elevated">
        {recipe.recipeImage ? (
          <SafeImage
            src={recipe.recipeImage}
            alt={recipe.recipeName}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <HiOutlineSquares2X2 size={28} />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <h3 className="font-medium text-primary text-sm line-clamp-1 group-hover:text-brand transition-colors">
          {recipe.recipeName}
        </h3>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-0.5 rounded-md badge-brand font-medium">
            {recipe.category}
          </span>
          {recipe.cuisineType && (
            <span className="text-xs text-muted inline-flex items-center gap-1">
              <FiGlobe size={11} />
              {recipe.cuisineType}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col gap-0.5">
            {showLikes ? (
              <span className="flex items-center gap-1 text-xs text-muted">
                <FiHeart size={12} />
                {recipe.likesCount || 0}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted">
                <FiClock size={12} />
                {recipe.preparationTime}
              </span>
            )}
            {showAuthor && recipe.authorName && (
              <span className="text-xs text-muted">by {recipe.authorName}</span>
            )}
          </div>
          <span className="text-xs font-medium text-brand inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            View
            <FiArrowRight size={12} />
          </span>
        </div>
      </div>
    </>
  );

  if (!linkable) {
    return (
      <div className="flex flex-col rounded-lg overflow-hidden border border-default bg-card">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex flex-col rounded-lg overflow-hidden border border-default bg-card card-hover group"
    >
      {content}
    </Link>
  );
}




