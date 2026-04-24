import heroConfigJson from "../config/hero.json";
import type { ConfigItem } from "@/components/HeroRenderer";

import HeroRenderer from "@/components/HeroRenderer";
import { useEffect } from "react";
import { trackEvent } from "../utils//analytics";
import ProfileCard from "@/components/ProfileCard";
// import {CTAButtons} from "@/components/ui/CTAButtons";
import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"
import WorkWithMeButton from "@/components/ui/WorkWithMeButton";
import HelpMeFreeFlow from "@/components/HelpMeFreeFlow"

const heroConfig = heroConfigJson as ConfigItem[];

function HomePage() {
    // Track page view when component mounts
    useEffect(() => {
        // TypeScript knows eventName must be string, payload must be object
        trackEvent('page_view', {
            page: 'home',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
    }, []);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-tr from-fuchsia-500 via-emerald-600 to-slate-950">
      <Header />
      
      <div className="grow px-6 py-12 sm:px-10 sm:py-16 lg:px-30 lg:pt-40">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center max-sm:pt-10">
          <div className="flex flex-col gap-8">
            <HeroRenderer config={heroConfig} />
            <div className="flex gap-5 flex-col sm:flex-row">
            <WorkWithMeButton/>
            <HelpMeFreeFlow/>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ProfileCard />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default HomePage;
