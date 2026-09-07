import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const OUTPUT_WIDTH = 1400;
const ASPECT = 16 / 9;

async function cropToDataUrl(src: string, area: Area): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_WIDTH;
  canvas.height = Math.round(OUTPUT_WIDTH / ASPECT);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas.toDataURL("image/jpeg", 0.82);
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
};

export function CoverImagePicker({ value, onChange, label = "Featured image", id }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);

  function pickFile(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("That image is larger than 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSource(String(reader.result));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  }

  async function applyCrop() {
    if (!source || !area) return;
    setSaving(true);
    try {
      onChange(await cropToDataUrl(source, area));
      setSource(null);
    } catch {
      toast.error("Could not prepare that image.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {value ? (
        <div className="overflow-hidden rounded-md border border-border">
          <img
            src={value}
            alt="Featured image preview"
            className="aspect-video w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
          No image chosen yet
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <ImagePlus className="mr-2 h-4 w-4" aria-hidden />
          {value ? "Replace image" : "Upload image"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            <Trash2 className="mr-2 h-4 w-4" aria-hidden />
            Remove
          </Button>
        )}
      </div>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          pickFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <Dialog open={!!source} onOpenChange={(open) => !open && setSource(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop the featured image</DialogTitle>
          </DialogHeader>
          <div className="relative h-[320px] w-full overflow-hidden rounded-md bg-muted">
            {source && (
              <Cropper
                image={source}
                crop={crop}
                zoom={zoom}
                aspect={ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label>Zoom</Label>
            <Slider
              value={[zoom]}
              min={1}
              max={4}
              step={0.05}
              onValueChange={(v) => setZoom(v[0] ?? 1)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSource(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={applyCrop} disabled={saving}>
              {saving ? "Preparing…" : "Use this image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
