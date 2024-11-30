// * Imports *
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useSharedState } from "./SharedState";
import { Value } from "@radix-ui/react-select";

// * app running in main *
function ButtonsBar() {
  // color scheming to app theme
  let buttonBackgroundColor: string;
  buttonBackgroundColor = "#FFFFFF"; // hard coded for light theme

  // holds states for expanding state button
  const [expanded, setExpanded] = useState(false);
  const [dropDownClick, setDropDownClick] = useState(false);
  const [weftSpacingClick, setWeftSpacingClick] = useState(false);
  const [warpSpacingClick, setWarpSpacingClick] = useState(false);
  const [weftThicknessClick, setWeftThicknessClick] = useState(false);
  const [warpThicknessClick, setWarpThicknessClick] = useState(false);

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
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none",
          backgroundColor: expanded
            ? clickedBackgroundButtonColor
            : "transparent",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "5px",
        }}
      >
        <Settings size={buttonSize} color={unClickedButtonColor} />
        {expanded ? (
          <ChevronLeft
            size={buttonSize}
            strokeWidth={3}
            color={unClickedButtonColor}
          />
        ) : (
          <ChevronRight
            size={buttonSize}
            strokeWidth={3}
            color={unClickedButtonColor}
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
                size={"icon"}
                onClick={() => setShowGrid(!showGrid)}
                style={{
                  backgroundColor: showGrid
                    ? clickedBackgroundButtonColor
                    : "transparent",
                  cursor: "pointer",
                }}
              >
                <Frame
                  size={buttonSize}
                  strokeWidth={3}
                  color={unClickedButtonColor}
                />
              </Button>

              {/* show nav box button */}
              <Button
                size="icon"
                onClick={() => setShowNavigationCube(!showNavigationCube)}
                style={{
                  backgroundColor: showNavigationCube
                    ? clickedBackgroundButtonColor
                    : "transparent",
                  cursor: "pointer",
                }}
              >
                {" "}
                <Box
                  size={buttonSize}
                  strokeWidth={3}
                  color={unClickedButtonColor}
                />{" "}
              </Button>

              {/* show loops button */}
              <Button
                size="icon"
                onClick={() => setShowLoops(!showLoops)}
                style={{
                  backgroundColor: showLoops
                    ? clickedBackgroundButtonColor
                    : "transparent",
                  cursor: "pointer",
                }}
              >
                {" "}
                <Redo2
                  size={buttonSize}
                  strokeWidth={3}
                  color={unClickedButtonColor}
                />{" "}
              </Button>

              {/* display options dropdown options */}
              <Select
                onValueChange={(value) => setDisplayOption(value)} // Updates the state with the selected value
                value={displayOption}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select what to Display" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="raw">Raw Weave Design</SelectItem>
                    <SelectItem value="one">1 Layered Loop</SelectItem>
                    <SelectItem value="two">2 Layered Loop</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* weft spacing input popover */}
              <button
                onClick={() => setWeftSpacingClick(!weftSpacingClick)}
                style={{
                  background: "none",
                  backgroundColor: weftSpacingClick
                    ? clickedBackgroundButtonColor
                    : "transparent",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                }}
              >
                {" "}
                Weft Spacing
              </button>
              <Popover open={weftSpacingClick}>
                <PopoverTrigger />
                <PopoverContent
                  className="w-80"
                  side="top"
                  align="center"
                  sideOffset={30}
                >
                  <div
                    className="grid gap-2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "0px",
                    }}
                  >
                    <Slider defaultValue={[0.2]} max={3} step={0.01} />
                    <Input defaultValue="0.2" className="col-span-2 h-8" />
                  </div>
                </PopoverContent>
              </Popover>

              {/* warp spacing input popover */}
              <button
                onClick={() => setWarpSpacingClick(!warpSpacingClick)}
                style={{
                  background: "none",
                  backgroundColor: warpSpacingClick
                    ? clickedBackgroundButtonColor
                    : "transparent",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                }}
              >
                {" "}
                Warp Spacing
              </button>
              <Popover open={warpSpacingClick}>
                <PopoverTrigger />
                <PopoverContent
                  className="w-80"
                  side="top"
                  align="center"
                  sideOffset={30}
                >
                  <div
                    className="grid gap-2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "0px",
                    }}
                  >
                    <Slider defaultValue={[0.2]} max={3} step={0.01} />
                    <Input defaultValue="0.2" className="col-span-2 h-8" />
                  </div>
                </PopoverContent>
              </Popover>

              {/* weft thickness input popover */}
              <button
                onClick={() => setWeftThicknessClick(!weftThicknessClick)}
                style={{
                  background: "none",
                  backgroundColor: weftThicknessClick
                    ? clickedBackgroundButtonColor
                    : "transparent",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                }}
              >
                {" "}
                Weft Spacing
              </button>
              <Popover open={weftThicknessClick}>
                <PopoverTrigger />
                <PopoverContent
                  className="w-80"
                  side="top"
                  align="center"
                  sideOffset={30}
                >
                  <div
                    className="grid gap-2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "0px",
                    }}
                  >
                    <Slider defaultValue={[0.1]} max={0.6} step={0.01} />
                    <Input defaultValue="0.2" className="col-span-2 h-8" />
                  </div>
                </PopoverContent>
              </Popover>

              {/* warp thickness input popover */}
              <button
                onClick={() => setWarpThicknessClick(!warpThicknessClick)}
                style={{
                  background: "none",
                  backgroundColor: warpThicknessClick
                    ? clickedBackgroundButtonColor
                    : "transparent",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                }}
              >
                {" "}
                Weft Spacing
              </button>
              <Popover open={warpThicknessClick}>
                <PopoverTrigger />
                <PopoverContent
                  className="w-80"
                  side="top"
                  align="center"
                  sideOffset={30}
                >
                  <div
                    className="grid gap-2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "0px",
                    }}
                  >
                    <Slider defaultValue={[0.1]} max={0.6} step={0.01} />
                    <Input defaultValue="0.2" className="col-span-2 h-8" />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

export default ButtonsBar;
