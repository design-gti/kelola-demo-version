// Palette copied from kelola-app config/mantineTheme.ts so the ported DISC wheel
// renders identically without pulling in Mantine.
export type MantineColor = string;

export const mantineColor: Record<string, string[]> = {
  primary:   ["#F9FAFB", "#E7F5FF", "#D6E6FF", "#A4C7FF", "#2F95DE", "#016699", "#005079", "#002E4A", "#01293D", "#001925"],
  secondary: ["#FFF2E4", "#FFE3C5", "#FFD399", "#FFBB65", "#FDA637", "#FD9F28", "#F28700", "#E27E00", "#CA6F00", "#854800"],
  error:     ["#FDF5F3", "#FADFD8", "#FFD3D3", "#F6A5A6", "#EF7476", "#DE350B", "#E01419", "#CB1418", "#B60C14", "#650009"],
  success:   ["#F2F9F7", "#E0EFEB", "#ACEECA", "#80E5AD", "#5BDD94", "#00875A", "#00714C", "#006241", "#005035", "#003F2A"],
  neutral:   ["#FFFFFF", "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DADA", "#ADB5BD", "#868E96", "#495057", "#343A40", "#212529"],
  tertiary:  ["#eef4ff", "#e1e7ee", "#c6ccd5", "#a8afbc", "#8e97a7", "#7d889a", "#748094", "#616e81", "#546276", "#45546a"],
};
