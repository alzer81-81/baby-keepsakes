import { PosterDesignSpec } from "@/lib/design-spec";
import { renderPosterSvg } from "@/lib/poster-renderer";

type Props = {
  spec: PosterDesignSpec;
};

export function PosterPreview({ spec }: Props) {
  const svg = renderPosterSvg(spec, "preview");

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="mx-auto aspect-[216/303] w-full max-w-[470px] overflow-hidden rounded-sm border border-stone-300 bg-white p-4 shadow-2xl shadow-stone-400/20">
        <div className="h-full w-full [&_svg]:block [&_svg]:h-full [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <p className="mt-4 text-center text-xs uppercase tracking-[0.14em] text-stone-500">A4 portrait + 3mm bleed (216mm x 303mm)</p>
    </div>
  );
}
