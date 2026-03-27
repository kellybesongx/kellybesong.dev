import heroConfig from "../config/hero.json" assert { type: "json" };
import HeroRenderer from "@/components/HeroRenderer";
import { useEffect } from "react";
import { trackEvent } from "../utils//analytics";
import ProfileCard from "@/components/ProfileCard";
// import {CTAButtons} from "@/components/ui/CTAButtons";
import Header from "@/components/layouts/Header"
// import type { ConfigItem } from "@/components/ui/CTAButtons";


function HomePage() {

  useEffect(() => {
  trackEvent("page_view", {
    page: "home",
  });
}, []);

  return (
    <div className="flex flex-col gap-12 px-6 py-12 sm:px-10 sm:py-16 lg:px-30 lg:py-35 bg-gradient-to-tr from-fuchsia-500 via-emerald-600 to-slate-950 min-h-screen">
      <Header/>
  <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center max-sm:pt-10">

    <div className="flex flex-col gap-8">
      <HeroRenderer config={heroConfig as ConfigItem[]} />
    </div>

    <div className="flex justify-center lg:justify-end">
      <ProfileCard />
    </div>

  </div>

</div>
  );
}

export default HomePage;
