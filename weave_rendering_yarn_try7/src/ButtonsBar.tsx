// * Imports *
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight, ChevronLeft, Settings } from "lucide-react";
import {
  buttonsStyles,
  GridButton,
  NavigationCubeButton,
  LoopsButton,
  DisplayOptionsDropdown,
  PopoverSlider,
} from "./ButtonsComponents";
import { useSharedState } from "./ButtonsSharedState";

// * app running in main *
function ButtonsBar() {
  // holds states for expanding state button
  const [expanded, setExpanded] = useState(false);
  const [weftSpacingClick, setWeftSpacingClick] = useState(false);
  const [warpSpacingClick, setWarpSpacingClick] = useState(false);
  const [weftThicknessClick, setWeftThicknessClick] = useState(false);
  const [warpThicknessClick, setWarpThicknessClick] = useState(false);

  // button shared states
  const {
    weftSpacing,
    setWeftSpacing,
    weftThickness,
    setWeftThickness,
    warpSpacing,
    setWarpSpacing,
    warpThickness,
    setWarpThickness,
    showGrid,
    setShowGrid,
    showNavigationCube,
    setShowNavigationCube,
    showLoops,
    setShowLoops,
    displayOption,
    setDisplayOption,
  } = useSharedState();

  return (
    // floating Collapsible bar
    <div
      id="floating-bar"
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        backgroundColor: buttonsStyles.buttonBarBackgroundColor,
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
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none",
          backgroundColor: expanded
            ? buttonsStyles.buttonClickedColor
            : buttonsStyles.buttonUnclickedColor,
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "5px",
        }}
      >
        <Settings size={buttonsStyles.size} color={buttonsStyles.iconColor} />
        {expanded ? (
          <ChevronLeft
            size={buttonsStyles.size}
            strokeWidth={buttonsStyles.strokeWidth}
            color={buttonsStyles.iconColor}
          />
        ) : (
          <ChevronRight
            size={buttonsStyles.size}
            strokeWidth={buttonsStyles.strokeWidth}
            color={buttonsStyles.iconColor}
          />
        )}
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
                gap: buttonsStyles.spacing,
                padding: "15px",
                backgroundColor: buttonsStyles.buttonBarBackgroundColor,
                height: "50px",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <GridButton
                showElement={showGrid}
                toggleElement={() => setShowGrid(!showGrid)}
                styles={buttonsStyles}
              />

              <NavigationCubeButton
                showElement={showNavigationCube}
                toggleElement={() => setShowNavigationCube(!showNavigationCube)}
                styles={buttonsStyles}
              />

              <LoopsButton
                showElement={showLoops}
                toggleElement={() => setShowLoops(!showLoops)}
                styles={buttonsStyles}
              />

              <DisplayOptionsDropdown
                onChange={(value) => setDisplayOption(value)}
                value={displayOption}
              />

              {/* weft spacing input popover */}
              <PopoverSlider
                open={weftSpacingClick}
                toggleOpen={() => setWeftSpacingClick(!weftSpacingClick)}
                label="Weft Spacing"
                defaultValue={0.2}
                max={3}
                step={0.01}
                clickedBackgroundColor={buttonsStyles.buttonClickedColor}
                input={weftSpacing}
                inputChange={setWeftSpacing}
              />

              {/* warp spacing input popover */}
              <PopoverSlider
                open={warpSpacingClick}
                toggleOpen={() => setWarpSpacingClick(!warpSpacingClick)}
                label="Warp Spacing"
                defaultValue={0.2}
                max={3}
                step={0.01}
                clickedBackgroundColor={buttonsStyles.buttonClickedColor}
                input={warpSpacing}
                inputChange={setWarpSpacing}
              />

              {/* weft thickness input popover */}
              <PopoverSlider
                open={weftThicknessClick}
                toggleOpen={() => setWeftThicknessClick(!weftThicknessClick)}
                label="Weft Thickness"
                defaultValue={0.1}
                max={0.6}
                step={0.01}
                clickedBackgroundColor={buttonsStyles.buttonClickedColor}
                input={weftThickness}
                inputChange={setWeftThickness}
              />

              {/* warp thickness input popover */}
              <PopoverSlider
                open={warpThicknessClick}
                toggleOpen={() => setWarpThicknessClick(!warpThicknessClick)}
                label="Warp Thickness"
                defaultValue={0.1}
                max={0.6}
                step={0.01}
                clickedBackgroundColor={buttonsStyles.buttonClickedColor}
                input={warpThickness}
                inputChange={setWarpThickness}
              />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

export default ButtonsBar;
