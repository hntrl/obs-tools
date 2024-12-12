import { useMemo, useState } from "react";
import { Separator } from "./components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

export function ColorConverterPage() {
  const [inputColor, setInputColor] = useState("#ffffff");
  const [targetColor, setTargetColor] = useState("#ffffff");

  const { hueShift, saturationChange, brightnessChange } = useMemo(
    () => calculateColorTransform(inputColor, targetColor),
    [inputColor, targetColor]
  );

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-2">
          Color Correction Converter
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          Select a starting color, and the color you want to convert to using
          OBS's 'Color Correction' effect filter.
        </p>
        <Separator />
      </div>
      <div className="w-[60%] flex gap-6 mb-6">
        <ControlledColorInput
          label="Input Color"
          value={inputColor}
          onChange={setInputColor}
        />
        <ControlledColorInput
          label="Target Color"
          value={targetColor}
          onChange={setTargetColor}
        />
      </div>
      <div>
        <Table className="w-[60%]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Property</TableHead>
              <TableHead className="w-24">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Gamma</TableCell>
              <TableCell>{0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Contrast</TableCell>
              <TableCell>{0}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Brightness</TableCell>
              <TableCell>{brightnessChange.toFixed(4)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Saturation</TableCell>
              <TableCell>{saturationChange.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hue Shift</TableCell>
              <TableCell>{hueShift.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Opacity</TableCell>
              <TableCell>1</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ControlledColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const hsl = useMemo(() => rgbToHsl(hexToRgb(value)), [value]);
  return (
    <div>
      <h2 className="text-lg font-medium pb-2">{label}</h2>
      <div className="space-y-2 flex flex-col max-w-40">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-24 w-full p-1 block bg-neutral-100 border cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <p className="text-xs text-muted-foreground">
          HSL: {hsl.h.toFixed(0)}°, {(hsl.s * 100).toFixed(0)}%,{" "}
          {(hsl.l * 100).toFixed(0)}%
        </p>
      </div>
    </div>
  );
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta) {
    if (max === r) h = (g - b) / delta + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);

  const l = (max + min) / 2;

  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s, l };
}

function calculateColorTransform(inputHex: string, targetHex: string) {
  const inputHsl = rgbToHsl(hexToRgb(inputHex));
  const targetHsl = rgbToHsl(hexToRgb(targetHex));

  const hueShift = targetHsl.h - inputHsl.h;
  const saturationChange = targetHsl.s - inputHsl.s;
  const brightnessChange = targetHsl.l - inputHsl.l;

  return {
    hueShift,
    saturationChange,
    brightnessChange,
  };
}
