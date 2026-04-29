// import { Button } from "@mui/material";
// import { trackEvent } from "@/utils/analytics"

// Temporary debug component
console.log('🔧 Environment Variables:');
console.log('  VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('  VITE_DEBUG_ANALYTICS:', import.meta.env.VITE_DEBUG_ANALYTICS);
console.log('  Mode:', import.meta.env.MODE);

type HeadingItem = {
  type: "heading";
  text: string;
};

type SubHeadingItem = {
  type: "sub-heading";
  text: string;
};


type ParagraphItem = {
  type: "paragraph";
  text: string;
};


export type ConfigItem = HeadingItem |SubHeadingItem | ParagraphItem ;

type HeroRendererProps = {
  config: ConfigItem[];
};

function HeroRenderer({ config }: HeroRendererProps) {
  return (
    <div className="flex flex-col items-start text-left space-y-3">
      {config.map((item, index) => {
        if (item.type === "heading") {
          return (
            <h1
              key={index}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1]
                text-white drop-shadow-lg"
            >
              {item.text}
            </h1>
          );
        }

        if (item.type === "sub-heading") {
          return (
            <h2
              key={index}
              className="text-xl sm:text-2xl md:text-3xl font-bold
                text-emerald-200 drop-shadow-md max-w-2xl"
            >
              {item.text}
            </h2>
          );
        }

        if (item.type === "paragraph") {
          return (
            <p
              key={index}
              className="text-sm sm:text-base md:text-lg
                text-white/80 max-w-2xl leading-relaxed
                backdrop-blur-sm"
            >
              {item.text}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

export default HeroRenderer;