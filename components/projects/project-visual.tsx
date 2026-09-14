import Image from "next/image";

type ProjectVisualProps = {
  image: string | null;
  title: string;
  sizes: string;
};

export function ProjectVisual({ image, title, sizes }: ProjectVisualProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={`${title} interface preview`}
        fill
        sizes={sizes}
      />
    );
  }

  return (
    <div
      className="project-placeholder"
      role="img"
      aria-label={`${title} visual coming soon`}
    >
      <span>Case study</span>
      <strong>{title}</strong>
      <small>Visual coming soon</small>
    </div>
  );
}
