import { PosterArtwork, PosterDesignSpec, PosterTheme } from "@/lib/design-spec";
import { artworkFileByType } from "@/lib/artwork-map";
import { previewFontFamilies, printFontFamilies, printSize, resolveThemePalette } from "@/lib/poster-style";

type RenderMode = "preview" | "print";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function estimateTextWidth(text: string, fontSize: number, letterSpacing = 0, widthFactor = 0.62): number {
  const chars = text.trim().length || 1;
  return chars * fontSize * widthFactor + Math.max(0, chars - 1) * letterSpacing;
}

function fitFontSize(
  text: string,
  maxWidth: number,
  minSize: number,
  maxSize: number,
  letterSpacing = 0,
  widthFactor = 0.62
): number {
  const chars = text.trim().length || 1;
  const spacingWidth = Math.max(0, chars - 1) * letterSpacing;
  const available = Math.max(1, maxWidth - spacingWidth);
  const fitted = available / (chars * widthFactor);
  return clamp(fitted, minSize, maxSize);
}

function fitText(
  raw: string,
  maxWidth: number,
  minSize: number,
  maxSize: number,
  letterSpacing = 0,
  widthFactor = 0.62
): { text: string; size: number } {
  const base = raw.trim() || "-";
  let size = fitFontSize(base, maxWidth, minSize, maxSize, letterSpacing, widthFactor);

  if (estimateTextWidth(base, size, letterSpacing, widthFactor) <= maxWidth) {
    return { text: base, size };
  }

  // At minimum font size, fall back to truncation to guarantee containment.
  size = minSize;
  if (estimateTextWidth(base, size, letterSpacing, widthFactor) <= maxWidth) {
    return { text: base, size };
  }

  let candidate = base;
  while (candidate.length > 1 && estimateTextWidth(`${candidate}\u2026`, size, letterSpacing, widthFactor) > maxWidth) {
    candidate = candidate.slice(0, -1);
  }
  return { text: `${candidate}\u2026`, size };
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function blendHexWithWhite(hex: string, alpha: number): string {
  const safe = hex.replace("#", "");
  if (safe.length !== 6) return hex;
  const r = parseInt(safe.slice(0, 2), 16);
  const g = parseInt(safe.slice(2, 4), 16);
  const b = parseInt(safe.slice(4, 6), 16);
  const mix = (channel: number) => Math.round(255 * (1 - alpha) + channel * alpha);
  const toHex = (channel: number) => channel.toString(16).padStart(2, "0");
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

function renderArtwork(artwork: PosterArtwork, theme: PosterTheme, mode: RenderMode, embeddedInlineSvg?: string): string {
  const hrefPrefix = mode === "print" ? "artwork/" : "/artwork/";
  const href = `${hrefPrefix}${artworkFileByType[artwork]}`;
  const themeFilterByTheme: Record<PosterTheme, string> = {
    blush_meadow: "hue-rotate(0deg) saturate(1)",
    warm_peach: "hue-rotate(-30deg) saturate(1.18)",
    powder_blue: "hue-rotate(118deg) saturate(0.86)",
    sage_rose: "hue-rotate(32deg) saturate(0.88)",
    terracotta_sky: "hue-rotate(86deg) saturate(0.92)",
    mono_ink: "saturate(0.18) contrast(1.03)",
    red: "hue-rotate(0deg) saturate(1)",
    orange: "hue-rotate(-35deg) saturate(1.2)",
    blue: "hue-rotate(120deg) saturate(0.85)"
  };
  const themeFilter = themeFilterByTheme[theme];

  if (mode === "print" && embeddedInlineSvg) {
    return `
      <g transform="translate(118 14)" style="filter:${themeFilter};">
        ${embeddedInlineSvg}
      </g>
    `;
  }

  return `
    <g transform="translate(118 14)">
      <image href="${href}" x="0" y="0" width="96" height="96" preserveAspectRatio="xMidYMid meet" style="filter:${themeFilter};" />
    </g>
  `;
}

export function renderPosterSvg(spec: PosterDesignSpec, mode: RenderMode = "preview", options?: { embeddedArtworkInlineSvg?: string }): string {
  const palette = resolveThemePalette(spec.theme, spec.textTone ?? "classic");
  const posterBackground = blendHexWithWhite(palette.background, 0.42);
  const fontFamily = mode === "preview" ? previewFontFamilies[spec.font] : printFontFamilies[spec.font];
  const svgWidth = mode === "print" ? `${printSize.widthMm}mm` : "100%";
  const svgHeight = mode === "print" ? `${printSize.heightMm}mm` : "100%";

  const monthRaw = spec.baby.month.toUpperCase();
  const dayRaw = String(spec.baby.day).padStart(2, "0");
  const yearRaw = String(spec.baby.year);
  const timeRaw = spec.baby.time.toUpperCase();
  const firstNameRaw = (spec.baby.firstName || "FIRST NAME").toUpperCase();
  const middleNameRaw = (spec.baby.middleName || "").toUpperCase();
  const lastNameRaw = (spec.baby.lastName || "LAST NAME").toUpperCase();
  const hospitalRaw = spec.baby.hospital || "Hospital";
  const cityRaw = (spec.baby.city || "City").toUpperCase();
  const countryRaw = (spec.baby.country || "Country").toUpperCase();

  const nameLaneLeft = 12;
  const nameLaneRight = 204;
  const nameLaneWidth = nameLaneRight - nameLaneLeft;
  const firstNameFit = fitText(firstNameRaw, nameLaneWidth, 22, 52, 1, 0.63);
  const middleNameFit = fitText(middleNameRaw || "-", nameLaneWidth * 0.6, 11, 22, 0.8, 0.63);
  const lastNameFit = fitText(lastNameRaw, nameLaneWidth * 0.82, 13, 30, 0.6, 0.63);
  const hospitalFit = fitText(hospitalRaw, 126, 8.5, 11.8, 0.16, 0.52);
  const cityFit = fitText(cityRaw, 128, 12.5, 21, 1, 0.62);
  const countryFit = fitText(countryRaw, 122, 10, 14.2, 0.8, 0.62);

  const month = esc(monthRaw);
  const day = esc(dayRaw);
  const year = esc(yearRaw);
  const time = esc(timeRaw);
  const firstName = esc(firstNameFit.text);
  const middleName = esc(middleNameFit.text);
  const lastName = esc(lastNameFit.text);
  const hospital = esc(hospitalFit.text);
  const city = esc(cityFit.text);
  const country = esc(countryFit.text);
  const poundsRaw = String(spec.baby.weightPounds);
  const pounds = esc(poundsRaw);
  const ounces = esc(String(spec.baby.weightOunces));
  const poundsFontSize = fitFontSize(poundsRaw, 40, 26, 36, 0, 0.56);

  let firstNameSize = firstNameFit.size;
  let secondLineSize = middleNameRaw
    ? Math.min(lastNameFit.size, middleNameFit.size)
    : clamp(lastNameFit.size * 1.12, 13, 30);
  const topZoneTop = 8;
  const topZoneBottom = 102;
  const timeLaneX = 18;
  const dateLaneLeft = 30;
  const dateLaneRight = 106;
  const topLeftCenterX = (dateLaneLeft + dateLaneRight) / 2;
  const topZoneHeight = topZoneBottom - topZoneTop;

  // Stable top-left composition: fixed anchors with bounded scaling.
  let daySize = fitFontSize(dayRaw, dateLaneRight - dateLaneLeft, 64, 80, 0, 0.58);
  let dayWidth = estimateTextWidth(dayRaw, daySize, 0, 0.58);
  dayWidth = clamp(dayWidth, 56, dateLaneRight - dateLaneLeft);
  const monthTargetWidth = clamp(dayWidth * 1.02, 58, dayWidth + 2);
  const yearTargetWidth = clamp(dayWidth * 0.9, 46, dayWidth - 2);

  const monthSize = fitFontSize(monthRaw, monthTargetWidth, 10.5, 13.2, 0.8, 0.58);
  const yearSize = fitFontSize(yearRaw, dayWidth, 10, 12.8, 0, 0.58);
  const monthLetterSpacing = clamp(0.92 - monthRaw.length * 0.022, 0.5, 0.82);
  const yearLetterSpacing = 0.46;

  const dayCenterY = topZoneTop + topZoneHeight * 0.56;
  const monthY = topZoneTop + topZoneHeight * 0.18;
  const dayY = dayCenterY;
  const yearY = topZoneTop + topZoneHeight * 0.86;
  const topSectionCenterY = topZoneTop + topZoneHeight / 2;

  // Ensure the day glyph box always fits between month and year lanes.
  const dayTopSafe = monthY + monthSize * 0.7;
  const dayBottomSafe = yearY - yearSize * 0.7;
  const maxDaySizeByHeight = Math.max(58, (dayBottomSafe - dayTopSafe) / 1.05);
  daySize = Math.min(daySize, maxDaySizeByHeight);
  const timeSpan = topZoneHeight * 0.6;

  const middleTop = 116;
  const middleBottom = 194;
  let nameGap = 0.2;
  let nameBlockHeight = firstNameSize + nameGap + secondLineSize;
  const maxNameBlockHeight = middleBottom - middleTop;
  if (nameBlockHeight > maxNameBlockHeight) {
    const scale = maxNameBlockHeight / nameBlockHeight;
    firstNameSize *= scale;
    secondLineSize *= scale;
    nameGap *= scale;
    nameBlockHeight = firstNameSize + nameGap + secondLineSize;
  }
  const middleCenterY = (middleTop + middleBottom) / 2;
  const firstNameY = middleCenterY - (nameGap / 2 + secondLineSize / 2);
  const lastNameY = middleCenterY + (nameGap / 2 + firstNameSize / 2);
  const firstNameSpacing = clamp(1.05 - firstNameRaw.length * 0.02, 0.15, 0.78);
  const middleNameSpacing = clamp(0.42 - middleNameRaw.length * 0.012, 0.03, 0.32);
  const lastNameSpacing = clamp(0.42 - lastNameRaw.length * 0.012, 0.03, 0.32);
  const firstNameWidth = clamp(
    estimateTextWidth(firstNameFit.text, firstNameSize, firstNameSpacing, 0.63),
    nameLaneWidth * 0.92,
    nameLaneWidth
  );
  const hasMiddleName = middleNameRaw.length > 0;
  const middleNameNaturalWidth = hasMiddleName
    ? estimateTextWidth(middleNameFit.text, secondLineSize, middleNameSpacing, 0.63)
    : 0;
  const lastNameNaturalWidth = estimateTextWidth(lastNameFit.text, secondLineSize, lastNameSpacing, 0.63);
  const secondLineMaxWidth = firstNameWidth;
  const secondGapWidth = hasMiddleName ? clamp(secondLineSize * 0.32, 2.4, 5) : 0;

  let middleNameWidth = middleNameNaturalWidth;
  let lastNameWidth = lastNameNaturalWidth;
  let secondLineTargetWidth = middleNameWidth + secondGapWidth + lastNameWidth;
  let needsSecondLineCompress = secondLineTargetWidth > secondLineMaxWidth;

  if (hasMiddleName) {
    const availableForText = secondLineMaxWidth - secondGapWidth;
    const totalNatural = middleNameNaturalWidth + lastNameNaturalWidth;
    const middleMin = availableForText * 0.22;
    const lastMin = availableForText * 0.45;
    const scale = totalNatural > 0 ? Math.min(1, availableForText / totalNatural) : 1;
    middleNameWidth = middleNameNaturalWidth * scale;
    lastNameWidth = lastNameNaturalWidth * scale;
    middleNameWidth = clamp(middleNameWidth, middleMin, availableForText - lastMin);
    lastNameWidth = availableForText - middleNameWidth;
    secondLineTargetWidth = middleNameWidth + secondGapWidth + lastNameWidth;
    needsSecondLineCompress = true;
  } else if (needsSecondLineCompress) {
    const scale = secondLineMaxWidth / secondLineTargetWidth;
    lastNameWidth *= scale;
    secondLineTargetWidth = lastNameWidth;
  }

  const secondLineStartX = 108 - secondLineTargetWidth / 2;
  const middleNameX = secondLineStartX;
  const lastNameX = secondLineStartX + middleNameWidth + secondGapWidth;

  const hospitalSize = hospitalFit.size;
  const citySize = cityFit.size;
  const countrySize = countryFit.size;
  const bottomTop = 226;
  const bottomBottom = 289;
  const line1 = hospitalSize;
  const gap12 = clamp(1.7, 1.2, 2.1);
  const line2 = citySize;
  const gap23 = clamp(1.3, 1, 1.8);
  const line3 = countrySize;
  const bottomTotal = line1 + gap12 + line2 + gap23 + line3;
  const bottomStart = bottomTop + (bottomBottom - bottomTop - bottomTotal) / 2;
  const hospitalY = bottomStart + line1;
  const cityY = hospitalY + gap12 + line2;
  const countryY = cityY + gap23 + line3;
  const locationCenterX = 66;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 216 303" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Birth poster preview">
  <rect x="0" y="0" width="216" height="303" fill="#ffffff" />
  <rect x="0" y="0" width="216" height="303" fill="${palette.background}" opacity="0.42" />

  <g transform="translate(${timeLaneX} ${topSectionCenterY}) rotate(-90)">
    <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" textLength="${timeSpan}" lengthAdjust="spacing" style="font-family:${fontFamily};font-size:9.2px;font-weight:600;letter-spacing:1.1px;font-variant-numeric:lining-nums tabular-nums;font-feature-settings:'lnum' 1,'tnum' 1;fill:${palette.time};">${time}</text>
  </g>
  <text x="${topLeftCenterX}" y="${monthY}" text-anchor="middle" dominant-baseline="middle" textLength="${monthTargetWidth}" lengthAdjust="spacing" style="font-family:${fontFamily};font-size:${monthSize}px;font-weight:700;letter-spacing:${monthLetterSpacing}px;fill:${palette.month};">${month}</text>
  <text x="${topLeftCenterX}" y="${dayY}" text-anchor="middle" dominant-baseline="middle" style="font-family:${fontFamily};font-size:${daySize}px;font-weight:800;font-variant-numeric:lining-nums tabular-nums;font-feature-settings:'lnum' 1,'tnum' 1;fill:${palette.day};">${day}</text>
  <text x="${topLeftCenterX}" y="${yearY}" text-anchor="middle" dominant-baseline="middle" textLength="${yearTargetWidth}" lengthAdjust="spacing" style="font-family:${fontFamily};font-size:${yearSize}px;font-weight:700;letter-spacing:${yearLetterSpacing}px;font-variant-numeric:lining-nums tabular-nums;font-feature-settings:'lnum' 1,'tnum' 1;fill:${palette.year};">${year}</text>

  ${renderArtwork(spec.artwork, spec.theme, mode, options?.embeddedArtworkInlineSvg)}

  <rect x="0" y="105" width="216" height="99" fill="${palette.band}" />
  <line x1="0" y1="110" x2="216" y2="110" stroke="${palette.stitch}" stroke-width="0.9" stroke-dasharray="3 2" />
  <line x1="0" y1="199" x2="216" y2="199" stroke="${palette.stitch}" stroke-width="0.9" stroke-dasharray="3 2" />

  <text x="108" y="${firstNameY}" text-anchor="middle" dominant-baseline="middle" textLength="${firstNameWidth}" lengthAdjust="spacingAndGlyphs" style="font-family:${fontFamily};font-size:${firstNameSize}px;font-weight:800;letter-spacing:${firstNameSpacing}px;fill:${palette.firstName};">${firstName}</text>
  ${
    hasMiddleName
      ? `<text x="${middleNameX}" y="${lastNameY}" text-anchor="start" dominant-baseline="middle" ${
          needsSecondLineCompress ? `textLength="${middleNameWidth}" lengthAdjust="spacingAndGlyphs"` : ""
        } style="font-family:${fontFamily};font-size:${secondLineSize}px;font-weight:700;letter-spacing:${middleNameSpacing}px;fill:${palette.lastName};fill-opacity:0.66;">${middleName}</text>
  <text x="${lastNameX}" y="${lastNameY}" text-anchor="start" dominant-baseline="middle" ${
    needsSecondLineCompress ? `textLength="${lastNameWidth}" lengthAdjust="spacingAndGlyphs"` : ""
  } style="font-family:${fontFamily};font-size:${secondLineSize}px;font-weight:700;letter-spacing:${lastNameSpacing}px;fill:${palette.lastName};">${lastName}</text>`
      : `<text x="108" y="${lastNameY}" text-anchor="middle" dominant-baseline="middle" ${
          needsSecondLineCompress ? `textLength="${secondLineTargetWidth}" lengthAdjust="spacingAndGlyphs"` : ""
        } style="font-family:${fontFamily};font-size:${secondLineSize}px;font-weight:700;letter-spacing:${lastNameSpacing}px;fill:${palette.lastName};">${lastName}</text>`
  }

  <text x="${locationCenterX}" y="${hospitalY}" text-anchor="middle" style="font-family:${fontFamily};font-size:${hospitalSize}px;line-height:0.95;font-style:italic;font-weight:500;fill:${palette.hospital};">${hospital}</text>
  <text x="${locationCenterX}" y="${cityY}" text-anchor="middle" style="font-family:${fontFamily};font-size:${citySize}px;line-height:0.95;font-weight:800;letter-spacing:0.68px;fill:${palette.city};stroke:${palette.city};stroke-width:0.14;stroke-dasharray:0.7 0.8;">${city}</text>
  <text x="${locationCenterX}" y="${countryY}" text-anchor="middle" style="font-family:${fontFamily};font-size:${countrySize}px;line-height:0.95;font-weight:700;letter-spacing:0.56px;fill:${palette.country};stroke:${palette.country};stroke-width:0.1;stroke-dasharray:0.7 0.7;">${country}</text>

  <g transform="translate(166 249)">
    <circle cx="0" cy="0" r="34" fill="${palette.badgeFill}" />
    <line x1="15" y1="-34" x2="15" y2="34" stroke="${posterBackground}" stroke-width="1.2" opacity="1" />
    <text x="-4" y="13" text-anchor="middle" style="font-family:${fontFamily};font-size:${poundsFontSize}px;font-weight:700;font-variant-numeric:lining-nums tabular-nums;font-feature-settings:'lnum' 1,'tnum' 1;fill:${palette.badgeText};">${pounds}</text>
    <text x="18" y="0" text-anchor="middle" transform="rotate(90 18 0)" style="font-family:${fontFamily};font-size:9.2px;font-weight:700;letter-spacing:0.48px;fill:${palette.background};">POUNDS</text>
    <text x="0" y="48" text-anchor="middle" style="font-family:${fontFamily};font-size:8px;font-weight:600;letter-spacing:0.72px;font-variant-numeric:lining-nums tabular-nums;font-feature-settings:'lnum' 1,'tnum' 1;fill:${palette.badgeFill};">${ounces} OUNCES</text>
  </g>
</svg>
`.trim();
}
