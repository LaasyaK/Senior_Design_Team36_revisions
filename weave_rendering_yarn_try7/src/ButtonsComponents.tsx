// * Imports *
import React from "react";
import { Button } from "@/components/ui/button";
import { Frame, Box, Redo2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

// * constant styles *
export const buttonsStyles = {
  size: "30px",
  strokeWidth: 3,
  spacing: "10px",
  buttonBarBackgroundColor: "#FFFFFF",
  buttonClickedColor: "#D8D8D8",
  buttonUnclickedColor: "transparent",
  iconColor: "#5A5A5A",
};

// * button functions *
export type ButtonProps = {
  showElement?: boolean;
  toggleElement: () => void;
  styles: {
    size: string;
    strokeWidth: number;
    iconColor: string;
    buttonClickedColor: string;
    buttonUnclickedColor: string;
  };
};

export const GridButton: React.FC<ButtonProps> = ({
  showElement,
  toggleElement,
  styles,
}) => (
  <Button
    size={"icon"}
    onClick={toggleElement}
    style={{
      backgroundColor: showElement
        ? styles.buttonClickedColor
        : styles.buttonUnclickedColor,
      cursor: "pointer",
    }}
  >
    <Frame
      size={styles.size}
      strokeWidth={styles.strokeWidth}
      color={styles.iconColor}
    />
  </Button>
);

export const NavigationCubeButton: React.FC<ButtonProps> = ({
  showElement,
  toggleElement,
  styles,
}) => (
  <Button
    size="icon"
    onClick={toggleElement}
    style={{
      backgroundColor: showElement
        ? styles.buttonClickedColor
        : styles.buttonUnclickedColor,
      cursor: "pointer",
    }}
  >
    <Box
      size={styles.size}
      strokeWidth={styles.strokeWidth}
      color={styles.iconColor}
    />
  </Button>
);

export const LoopsButton: React.FC<ButtonProps> = ({
  showElement,
  toggleElement,
  styles,
}) => (
  <Button
    size="icon"
    onClick={toggleElement}
    style={{
      backgroundColor: showElement
        ? styles.buttonClickedColor
        : styles.buttonUnclickedColor,
      cursor: "pointer",
    }}
  >
    <Redo2
      size={styles.size}
      strokeWidth={styles.strokeWidth}
      color={styles.iconColor}
    />
  </Button>
);

export type DropdownProps = {
  value?: string;
  onChange: (value: string) => void;
};

export const DisplayOptionsDropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
}) => (
  <Select value={value} onValueChange={onChange}>
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
);

export type SliderProps = {
  open?: boolean;
  toggleOpen: () => void;
  label: string;
  defaultValue: number;
  max: number;
  step: number;
  clickedBackgroundColor: string;
  input: number;
  inputChange: (input: number) => void;
};

export const PopoverSlider: React.FC<SliderProps> = ({
  open,
  toggleOpen,
  label,
  defaultValue,
  max,
  step,
  clickedBackgroundColor,
  input,
  inputChange,
}) => {
  const handleSliderChange = (value: number[]) => {
    if (value[0] !== undefined) {
      inputChange(value[0]);
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= max) {
      inputChange(newValue);
    }
  };
  return (
    <>
      <button
        onClick={toggleOpen}
        style={{
          background: "none",
          backgroundColor: open ? clickedBackgroundColor : "transparent",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "5px",
        }}
      >
        {label}
      </button>
      <Popover open={open}>
        <PopoverTrigger />
        <PopoverContent
          className="w-80"
          side="top"
          align="center"
          sideOffset={30}
        >
          <div style={{ display: "flex", alignItems: "center", margin: "0px" }}>
            <Slider
              defaultValue={[defaultValue]}
              value={[input]}
              max={max}
              step={step}
              onValueChange={handleSliderChange}
              className="w-3/4"
            />
            <Input
              defaultValue={defaultValue}
              value={input}
              onChange={handleInputChange}
              className="col-span-2 h-8 w-16 text-center"
              type="number"
              min={0}
              max={max}
              step={step}
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
