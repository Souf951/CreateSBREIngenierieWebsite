const SKETCHFAB_MODEL = "6757208506d941da8c6ed1758c7b7c8a";
const EMBED_URL = `https://sketchfab.com/models/${SKETCHFAB_MODEL}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_watermark_link=0`;

export default function VillaGLBTestScene({
  phase = 3,
}: {
  phase?: number;
  onFailure: () => void;
}) {
  return (
    <div
      className="building-canvas"
      role="img"
      aria-label={`Prévisualisation d'une villa contemporaine 3D — phase ${phase + 1} sur 4.`}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "18px",
        background: "rgba(8, 28, 23, 0.12)",
      }}
    >
      <iframe
        title="Villa contemporaine 3D"
        src={EMBED_URL}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        style={{
          position: "absolute",
          inset: "-42px -18px -52px -18px",
          width: "calc(100% + 36px)",
          height: "calc(100% + 94px)",
          border: 0,
          background: "transparent",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: "inset 0 0 0 1px rgba(20, 83, 61, .22)",
          borderRadius: "18px",
        }}
      />
    </div>
  );
}
