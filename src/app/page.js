import HomeBanner from "@/components/home/HomeBanner";
import FeaturedRecipes from "@/components/home/FeaturedRecipes";
import PopularRecipes from "@/components/home/PopularRecipes";
import HowItWorks from "@/components/home/HowItWorks";
import JoinCommunity from "@/components/home/JoinCommunity";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <FeaturedRecipes />
      <PopularRecipes />
      <HowItWorks />
      <JoinCommunity />
    </>
  );
}
