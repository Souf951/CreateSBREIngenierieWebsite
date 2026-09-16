import { useId } from "react";

type Point = [number, number, number];
const project = ([x, y, z]: Point) => [
  400 + x - y * 0.72,
  360 + x * 0.32 + y * 0.38 - z,
];
const points = (vertices: Point[]) =>
  vertices.map((p) => project(p).join(",")).join(" ");

/** A small vector architectural model. All geometry is local; no WebGL or textures. */
export default function PartnerArchitecture({
  narrative = false,
}: {
  narrative?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const face = (vertices: Point[], fill: string, key?: string) => (
    <polygon
      key={key}
      points={points(vertices)}
      fill={fill}
      stroke={`url(#${id}-edge)`}
      strokeWidth=".8"
      strokeLinejoin="round"
    />
  );

  function volume(
    x: number,
    y: number,
    width: number,
    depth: number,
    floors: number,
    name: string,
  ) {
    const height = floors * 49;
    return (
      <g key={name}>
        <g
          className="pr-model-wire"
          fill="none"
          stroke="currentColor"
          strokeWidth=".7"
        >
          <polygon
            points={points([
              [x, y, 0],
              [x + width, y, 0],
              [x + width, y, height],
              [x, y, height],
            ])}
          />
          <polygon
            points={points([
              [x + width, y, 0],
              [x + width, y + depth, 0],
              [x + width, y + depth, height],
              [x + width, y, height],
            ])}
          />
          <polygon
            points={points([
              [x, y, height],
              [x + width, y, height],
              [x + width, y + depth, height],
              [x, y + depth, height],
            ])}
          />
        </g>
        {Array.from({ length: floors }, (_, level) => {
          const z = level * 49;
          return (
            <g
              key={level}
              className={
                narrative ? `pr-model-floor pr-model-floor-${level}` : undefined
              }
            >
              {face(
                [
                  [x, y, z],
                  [x + width, y, z],
                  [x + width, y, z + 49],
                  [x, y, z + 49],
                ],
                `url(#${id}-stone)`,
              )}
              {face(
                [
                  [x + width, y, z],
                  [x + width, y + depth, z],
                  [x + width, y + depth, z + 49],
                  [x + width, y, z + 49],
                ],
                `url(#${id}-side)`,
              )}
              {Array.from({ length: Math.floor(width / 26) }, (_, column) => {
                const left = x + 8 + column * 26;
                return (
                  <g key={column}>
                    {face(
                      [
                        [left, y - 0.4, z + 8],
                        [left + 19, y - 0.4, z + 8],
                        [left + 19, y - 0.4, z + 40],
                        [left, y - 0.4, z + 40],
                      ],
                      `url(#${id}-glass)`,
                    )}
                    <polyline
                      points={points([
                        [left + 10, y - 0.5, z + 8],
                        [left + 10, y - 0.5, z + 40],
                      ])}
                      fill="none"
                      stroke="#a0b1a7"
                      strokeWidth=".7"
                    />
                  </g>
                );
              })}
              {Array.from({ length: Math.floor(depth / 26) }, (_, column) => {
                const back = y + 8 + column * 26;
                return face(
                  [
                    [x + width + 0.4, back, z + 8],
                    [x + width + 0.4, back + 18, z + 8],
                    [x + width + 0.4, back + 18, z + 40],
                    [x + width + 0.4, back, z + 40],
                  ],
                  `url(#${id}-glassSide)`,
                  String(column),
                );
              })}
              {face(
                [
                  [x - 4, y - 4, z + 46],
                  [x + width + 4, y - 4, z + 46],
                  [x + width + 4, y + depth + 4, z + 46],
                  [x - 4, y + depth + 4, z + 46],
                ],
                `url(#${id}-roof)`,
              )}
              {face(
                [
                  [x - 4, y - 4, z + 46],
                  [x + width + 4, y - 4, z + 46],
                  [x + width + 4, y - 4, z + 50],
                  [x - 4, y - 4, z + 50],
                ],
                "#e5e1d5",
              )}
            </g>
          );
        })}
        <g className={narrative ? "pr-model-crown" : undefined}>
          {face(
            [
              [x - 4, y - 4, height],
              [x + width + 4, y - 4, height],
              [x + width + 4, y + depth + 4, height],
              [x - 4, y + depth + 4, height],
            ],
            `url(#${id}-roof)`,
          )}
          {face(
            [
              [x + 12, y + 12, height + 0.5],
              [x + width - 12, y + 12, height + 0.5],
              [x + width - 12, y + depth - 12, height + 0.5],
              [x + 12, y + depth - 12, height + 0.5],
            ],
            "#849680",
          )}
          {Array.from({ length: 5 }, (_, n) => (
            <polyline
              key={n}
              points={points([
                [x + 18 + n * 24, y + 18, height + 1],
                [x + 18 + n * 24, y + depth - 18, height + 1],
              ])}
              stroke="#c3c6b4"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </g>
      </g>
    );
  }

  return (
    <svg
      className="pr-architecture"
      viewBox="0 0 900 660"
      role="img"
      aria-label="Maquette architecturale illustrative : trois volumes, façades vitrées et terrasses reliées autour d’un même projet"
    >
      <defs>
        <linearGradient id={`${id}-stone`} x2=".8" y2="1">
          <stop stopColor="#f5f1e6" />
          <stop offset="1" stopColor="#d4d4c7" />
        </linearGradient>
        <linearGradient id={`${id}-side`} x2="1" y2="1">
          <stop stopColor="#a6b5a6" />
          <stop offset="1" stopColor="#799688" />
        </linearGradient>
        <linearGradient id={`${id}-roof`} x2="1" y2="1">
          <stop stopColor="#fcf9ed" />
          <stop offset="1" stopColor="#d9ddcc" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x2=".7" y2="1">
          <stop stopColor="#658a7b" />
          <stop offset=".5" stopColor="#355c4e" />
          <stop offset=".51" stopColor="#547968" />
          <stop offset="1" stopColor="#173d30" />
        </linearGradient>
        <linearGradient id={`${id}-glassSide`} x2="1" y2="1">
          <stop stopColor="#789c8b" />
          <stop offset="1" stopColor="#3b6152" />
        </linearGradient>
        <linearGradient id={`${id}-edge`}>
          <stop stopColor="#456852" stopOpacity=".3" />
          <stop offset="1" stopColor="#456852" stopOpacity=".12" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor="#254f3b" stopOpacity=".22" />
          <stop offset="1" stopColor="#254f3b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="pr-model-ground">
        <ellipse
          cx="460"
          cy="487"
          rx="350"
          ry="115"
          fill={`url(#${id}-shadow)`}
        />
        <g fill="none" stroke="currentColor" strokeWidth=".65" opacity=".15">
          {[-120, -40, 40, 120, 200, 280, 360].map((v) => (
            <g key={v}>
              <polyline
                points={points([
                  [v, -120, -5],
                  [v, 300, -5],
                ])}
              />
              <polyline
                points={points([
                  [-150, v, -5],
                  [390, v, -5],
                ])}
              />
            </g>
          ))}
        </g>
        {face(
          [
            [-125, -60, -8],
            [330, -60, -8],
            [330, 245, -8],
            [-125, 245, -8],
          ],
          "#dfdfd1",
        )}
        {face(
          [
            [-125, -60, -8],
            [330, -60, -8],
            [330, -60, -15],
            [-125, -60, -15],
          ],
          "#bdc8b8",
        )}
        {face(
          [
            [330, -60, -8],
            [330, 245, -8],
            [330, 245, -15],
            [330, -60, -15],
          ],
          "#9aaf9d",
        )}
        <g fill="none" stroke="#8c9e8a" strokeWidth=".65" opacity=".6">
          <polyline
            points={points([
              [-115, -43, -7],
              [315, -43, -7],
              [315, 229, -7],
            ])}
          />
          <polyline
            points={points([
              [-112, 217, -7],
              [305, 217, -7],
            ])}
          />
        </g>
      </g>
      <g className="pr-model-volumes">
        {volume(-45, 105, 176, 112, 4, "west")}
        {volume(128, 25, 156, 144, 5, "east")}
        {volume(-75, -30, 182, 112, 3, "front")}
        <g className={narrative ? "pr-model-crown" : undefined}>
          {face(
            [
              [108, 26, 48],
              [130, 26, 48],
              [130, 107, 48],
              [108, 107, 48],
            ],
            "#d8dfce",
          )}
          {face(
            [
              [108, 26, 49],
              [130, 26, 49],
              [130, 26, 79],
              [108, 26, 79],
            ],
            "#779c87",
          )}
          {[-92, 302].map((x) => (
            <g key={x}>
              <polyline
                points={points([
                  [x, 150, 0],
                  [x, 150, 54],
                ])}
                stroke="#6e8069"
                strokeWidth="3"
              />
              <ellipse
                cx={project([x, 150, 64])[0]}
                cy={project([x, 150, 64])[1]}
                rx="20"
                ry="30"
                fill="#698565"
                opacity=".9"
              />
              <ellipse
                cx={project([x - 5, 150, 71])[0]}
                cy={project([x - 5, 150, 71])[1]}
                rx="13"
                ry="23"
                fill="#8d9f7d"
              />
            </g>
          ))}
        </g>
      </g>
      <g
        className="pr-model-guides"
        fill="none"
        stroke="currentColor"
        strokeWidth=".65"
        opacity=".3"
      >
        <path d="M110 540L408 641L807 474M108 531v18m300 84v16m399-184v18M733 98v249m-5-249h10m-10 249h10" />
        <path d="M154 370V166L316 111M730 396l74 24" strokeDasharray="3 6" />
        <circle cx="154" cy="370" r="3" />
        <circle cx="730" cy="396" r="3" />
      </g>
    </svg>
  );
}
