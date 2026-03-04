import { PosterDesignSpec } from "@/lib/design-spec";
import { renderPosterSvg } from "@/lib/poster-renderer";

type Props = {
  spec: PosterDesignSpec;
  zoom?: number;
};

export function PosterPreview({ spec, zoom = 1 }: Props) {
  const svg = renderPosterSvg(spec, "preview");

  return (
    <div className="mx-auto flex w-full flex-col lg:h-full">
      <div className="mx-auto flex w-full items-center justify-center lg:min-h-0 lg:flex-1">
        <div className="aspect-[216/303] w-full max-w-[560px] overflow-hidden rounded-xl border border-stone-300/90 bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-4 lg:h-full lg:w-auto lg:max-h-full lg:max-w-full">
          <div className="flex h-full w-full items-center justify-center overflow-hidden">
            <div
              className="h-full w-full origin-center transition-transform duration-200 ease-out [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
              style={{ transform: `scale(${zoom})` }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs uppercase tracking-[0.14em] text-stone-500">A4 portrait + 3mm bleed (216mm x 303mm)</p>
    </div>
  );
}
