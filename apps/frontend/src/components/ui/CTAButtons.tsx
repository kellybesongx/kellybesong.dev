// import {Button} from "@mui/material";
// import { trackEvent } from "@/utils/analytics"

// type ConfigItem = ButtonItem;

// type HeroRendererProps = {
//   config: ConfigItem[];
// };

// type ButtonItem = {
//   type: "button";
//   label: string;
// };

// export function CTAButtons({config}) {
//   return (
//     <div className="flex gap-15 justify-center">
//         {config.map((item, index) => {
//         if (item.type === "button") {
//           return (
//             <Button
//               key={index}
//               variant="contained"
//               onClick={() =>
//                 trackEvent("button_click", {
//                   label: item.label,
//                 })
//               }
//             >
//               {item.label}
//             </Button>
//           );
//         }

//         return null;
//       })}
//     </div>
//   )
// }


import { useState } from "react";
import { Button } from "@mui/material";
import { trackEvent } from "@/utils/analytics";
import WorkWithMeModal from "../WorkModal";
import ConnectWithMeModal from "../ConnectModal";

type ModalType = "work-with-me" | "connect-with-me" | null;

type ButtonItem = {
  type: "button";
  label: string;
  modal?: ModalType;
};

type ConfigItem = ButtonItem;

type CTAButtonsProps = {
  config: ConfigItem[];
};

export function CTAButtons({ config }: CTAButtonsProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleClick = (item: ButtonItem) => {
    console.log("clicked:", item.label, "modal:", item.modal);
    trackEvent("button_click", { label: item.label });
    if (item.modal) setActiveModal(item.modal);
  };

  return (
    <>
      <div className="flex gap-15 justify-center">
        {config.map((item, index) => {
          if (item.type === "button") {
            return (
              <Button
                key={index}
                variant="contained"
                onClick={() => handleClick(item)}
              >
                {item.label}
              </Button>
            );
          }
          return null;
        })}
      </div>

      <WorkWithMeModal
        isOpen={activeModal === "work-with-me"}
        onClose={() => setActiveModal(null)}
      />

      <ConnectWithMeModal
        isOpen={activeModal === "connect-with-me"}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}