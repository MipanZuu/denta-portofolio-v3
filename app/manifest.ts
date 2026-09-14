import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Denta Bramasta — Software Engineer",
    short_name: "Denta Bramasta",
    description: "Portfolio of Software Engineer Denta Bramasta Hidayat.",
    start_url: "/",
    display: "standalone",
    background_color: "#f1f0e9",
    theme_color: "#101411",
    icons: [{ src: "/images/logo.png", sizes: "367x367", type: "image/png" }],
  };
}
