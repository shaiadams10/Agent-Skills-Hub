export function MaterialIcon({
  name,
  fill = false,
  className = "",
  size,
}: {
  name: string;
  fill?: boolean;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined ${fill ? "icon-fill" : ""} ${className}`}
      style={size ? { fontSize: size } : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}
