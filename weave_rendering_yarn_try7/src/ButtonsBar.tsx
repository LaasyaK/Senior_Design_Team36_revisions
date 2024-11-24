// * Imports *
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import React, { useState, createContext, useContext } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Settings,
  Frame,
  Box,
  Redo2,
} from "lucide-react";
import { useSharedState } from "./SharedState";

// * app running in main *
function ButtonsBar() {
  // color scheming to app theme
  let buttonBackgroundColor: string;
  buttonBackgroundColor = "#FFFFFF"; // hard coded for light theme
  // holds state of toggling button
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // button size changes to tile size by ratio
  let buttonSize: string;
  let buttonSpacing: string;
  let unClickedButtonColor: string;
  let clickedButtonColor: string;
  let clickedBackgroundButtonColor: string;
  buttonSize = "30px";
  buttonSpacing = "10px";
  unClickedButtonColor = "#5A5A5A";
  clickedButtonColor = "#FFFFFF";
  clickedBackgroundButtonColor = "#D8D8D8";

  // button states
  const {
    setWeftSpacing,
    setWeftThickness,
    setWarpSpacing,
    setWarpThickness,
    showGrid,
    setShowGrid,
    showNavigationCube,
    setShowNavigationCube,
  } = useSharedState();

  return (
    <div
      id="floating-bar"
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        backgroundColor: buttonBackgroundColor,
        padding: "15px",
        margin: "0px",
        border: "0px",
        height: "50px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        gap: "0px",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <button
        onClick={toggleExpand}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "0px",
        }}
      >
        {" "}
        {expanded ? (
          <>
            <Settings size={buttonSize} color={unClickedButtonColor} />
            <ChevronLeft size={buttonSize} color={unClickedButtonColor} />
          </>
        ) : (
          <>
            <Settings size={buttonSize} color={unClickedButtonColor} />
            <ChevronRight size={buttonSize} color={unClickedButtonColor} />
          </>
        )}{" "}
      </button>

      <Collapsible open={expanded}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "0px",
            border: "0px",
            height: "50px",
          }}
        >
          <CollapsibleTrigger />
          <CollapsibleContent>
            <div
              style={{
                display: "flex",
                gap: buttonSpacing,
                padding: "15px",
                backgroundColor: buttonBackgroundColor,
                height: "50px",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {/* show grid button */}
              <Button
                size="icon"
                onClick={() => setShowGrid(!showGrid)}
                color={clickedBackgroundButtonColor}
              >
                <Frame size={buttonSize} color={unClickedButtonColor} />
              </Button>
              {/* show nav box button */}
              <Button
                size="icon"
                onClick={() => setShowNavigationCube(!showNavigationCube)}
              >
                {" "}
                <Box size={buttonSize} color={unClickedButtonColor} />{" "}
              </Button>
              {/* show loops button */}
              <Button size="icon">
                {" "}
                <Redo2 size={buttonSize} color={unClickedButtonColor} />{" "}
              </Button>
              {/* display options button */}
              <Button>Display</Button>
              {/* weft spacing slider button */}
              <Button variant="outline">Weft Spacing</Button>
              <Button variant="outline">Weft Thickness</Button>
              <Button variant="outline">Warp Spacing</Button>
              <Button variant="outline">Warp Thickness</Button>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

export default ButtonsBar;
