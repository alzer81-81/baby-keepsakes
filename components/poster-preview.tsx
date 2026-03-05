import { useEffect, useState } from "react";

import { PosterDesignSpec } from "@/lib/design-spec";
import { renderPosterSvg } from "@/lib/poster-renderer";
import { previewFontPrimaryName } from "@/lib/poster-style";

type Props = {
  spec: PosterDesignSpec;
  zoom?: number;
  maxHeightPx?: number;
};

export function PosterPreview({ spec, zoom = 1, maxHeightPx }: Props) {
  const [fontRenderTick, setFontRenderTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const family = previewFontPrimaryName[spec.font];
    if (typeof document === "undefined") return;

    const linkId = `preview-font-${spec.font}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      const queryFamily = family.replace(/\s+/g, "+");
      link.href = `https://fonts.googleapis.com/css2?family=${queryFamily}:wght@400;500;600;700;800&display=swap`;
      document.head.appendChild(link);
    }

    const fontsApi = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fontsApi) {
      setFontRenderTick((prev) => prev + 1);
      return;
    }

    void fontsApi
      .load(`700 1em "${family}"`)
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) setFontRenderTick((prev) => prev + 1);
      });

    return () => {
      cancelled = true;
    };
  }, [spec.font]);

  const svg = renderPosterSvg(spec, "preview");
  const maxHeightStyle = maxHeightPx ? { maxHeight: `${maxHeightPx}px` } : undefined;

  return (
    <div className="mx-auto w-full lg:max-h-full" style={maxHeightStyle}>
      <div
        className="mx-auto aspect-[216/303] w-full max-w-[560px] overflow-hidden rounded-xl border border-stone-300/90 bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-4 lg:h-auto lg:max-h-full lg:w-auto lg:max-w-full"
        style={maxHeightStyle}
      >
        <div className="flex h-full w-full items-center justify-center overflow-hidden">
          <div
            key={`${spec.font}-${fontRenderTick}`}
            className="h-full w-full origin-center transition-transform duration-200 ease-out [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
            style={{ transform: `scale(${zoom})` }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>
      <p className="mt-4 px-2 text-center text-[11px] uppercase tracking-[0.1em] text-stone-500">A4 portrait + 3mm bleed (216mm x 303mm)</p>
    </div>
  );
}
