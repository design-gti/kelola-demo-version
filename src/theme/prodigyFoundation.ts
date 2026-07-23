import { createTheme, defaultVariantColorsResolver, type MantineColorsTuple, type VariantColorsResolver } from "@mantine/core";

/**
 * Foundation-level theme mirroring @talentlytica/prodigy's `kelolaTheme`
 * (colors, typography, radius, shadows, spacing). Token values copied 1:1 from
 * the Prodigy `kelolaTheme` bundle so the design tokens render identically.
 *
 * We intentionally recreate the tokens via `createTheme` instead of importing
 * `kelolaTheme` directly: Prodigy's theme runs `Component.extend()` at module
 * evaluation for component-level defaultProps, which crashes under the Next.js
 * Turbopack ESM loader. Foundation scope doesn't need those component overrides.
 */

const primary: MantineColorsTuple = [
  "#F9FAFB", "#E7F5FF", "#D6E6FF", "#A4C7FF", "#2F95DE",
  "#016699", "#005079", "#002E4A", "#01293D", "#001925",
];
const secondary: MantineColorsTuple = [
  "#FFF2E4", "#FFE3C5", "#FFD399", "#FFBB65", "#FDA637",
  "#FD9F28", "#F28700", "#E27E00", "#CA6F00", "#854800",
];
const success: MantineColorsTuple = [
  "#F2F9F7", "#E0EFEB", "#ACEECA", "#80E5AD", "#5BDD94",
  "#00875A", "#00714C", "#006241", "#005035", "#003F2A",
];
const error: MantineColorsTuple = [
  "#FDF5F3", "#FADFD8", "#FFD3D3", "#F6A5A6", "#EF7476",
  "#DE350B", "#E01419", "#CB1418", "#B60C14", "#650009",
];
const neutral: MantineColorsTuple = [
  "#FFFFFF", "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA",
  "#ADB5BD", "#868E96", "#495057", "#343A40", "#212529",
];
const tertiary: MantineColorsTuple = [
  "#eef4ff", "#e1e7ee", "#c6ccd5", "#a8afbc", "#8e97a7",
  "#7d889a", "#748094", "#616e81", "#546276", "#45546a",
];

const FONT = 'Avenir, "Avenir Next", "Open Sans", sans-serif';

/**
 * Mantine's default resolver picks a near-black shade for "subtle"/"light"
 * text color on some hue orderings. Prodigy's real `kelolaTheme` fixes this by
 * forcing subtle-variant text to shade 5 (the brand color) — replicated here
 * since we can't import the real theme (see note above).
 */
const variantColorResolver: VariantColorsResolver = (input) => {
  const resolved = defaultVariantColorsResolver(input);
  if (input.variant === "subtle" || input.variant === "light" || input.variant === "transparent") {
    const color = input.color || input.theme.primaryColor;
    return { ...resolved, color: `var(--mantine-color-${color}-5)` };
  }
  return resolved;
};

export const prodigyFoundationTheme = createTheme({
  primaryColor: "primary",
  primaryShade: 5,
  variantColorResolver,
  colors: { primary, secondary, success, error, neutral, tertiary },
  black: "#495057",
  white: "#FFFFFF",

  fontFamily: FONT,
  fontFamilyMonospace: FONT,
  headings: { fontFamily: FONT, fontWeight: "700" },

  fontSizes: {
    xs: "0.625rem",
    sm: "0.75rem",
    md: "0.875rem",
    lg: "1rem",
    xl: "1.125rem",
  },
  lineHeights: {
    xs: "1.4",
    sm: "1.4",
    md: "1.4",
    lg: "1.6",
    xl: "1.65",
  },

  defaultRadius: "sm",

  shadows: {
    xs: "2px 2px 8px 0 rgba(0, 0, 0, 0.06)",
    sm: "3px 3px 18px 0 rgba(0, 0, 0, 0.08)",
    md: "5px 5px 35px 0 rgba(0, 0, 0, 0.1)",
    lg: "8px 8px 50px 0 rgba(0, 0, 0, 0.12)",
    xl: "12px 12px 70px 0 rgba(0, 0, 0, 0.16)",
  },

  defaultGradient: { from: "#2F95DE", to: "#016699", deg: 186 },
  cursorType: "pointer",
  other: { appBackground: "#F7F7F7" },

  /**
   * Plain nested config (no `Component.extend()` call) — safe under Turbopack.
   * Replicates Prodigy's Button label weight, lost when we dropped `kelolaTheme`'s
   * own `.extend()`-based component overrides to avoid the module-eval crash.
   */
  components: {
    Button: {
      styles: { label: { fontWeight: 700 } },
    },
  },
});
