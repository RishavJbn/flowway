import { useState } from "react";
import { Palette, Square, Circle, Minus, Grid, Dot, Slash } from "lucide-react";

function FloatingToolbar({
  selectedNodeId,
  selectedEdgeId,
  setNodes,
  setEdges,
  setCanvasTheme,
  setCanvasPattern,
}) {
  const [activePanel, setActivePanel] = useState(null);

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  /* ---------------- COLORS ---------------- */
  const colors = [
    { key: "blue", bg: "#c7d2fe" },
    { key: "purple", bg: "#e9d5ff" },
    { key: "pink", bg: "#fbcfe8" },
    { key: "green", bg: "#bbf7d0" },
    { key: "yellow", bg: "#fef9c3" },
  ];

  const changeColor = (color) => {
    if (!selectedNodeId) return;

    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNodeId ? { ...n, data: { ...n.data, color } } : n,
      ),
    );
  };

  /* ---------------- SHAPES ---------------- */
  const changeShape = (shape) => {
    if (!selectedNodeId) return;

    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNodeId ? { ...n, data: { ...n.data, shape } } : n,
      ),
    );
  };

  /* ---------------- EDGE ---------------- */
  const changeEdgeType = (type) => {
    if (!selectedEdgeId) return;

    setEdges((eds) =>
      eds.map((e) => (e.id === selectedEdgeId ? { ...e, type } : e)),
    );
  };

  const changeEdgeStyle = (styleType) => {
    if (!selectedEdgeId) return;

    setEdges((eds) =>
      eds.map((e) => {
        if (e.id !== selectedEdgeId) return e;

        if (styleType === "dashed")
          return {
            ...e,
            style: { strokeDasharray: "5 5", strokeWidth: 2 },
          };

        if (styleType === "thick")
          return {
            ...e,
            style: { strokeWidth: 4 },
          };

        if (styleType === "normal")
          return {
            ...e,
            style: { strokeWidth: 2 },
          };

        return e;
      }),
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* MAIN TOOLBAR */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 
        bg-white/70 backdrop-blur-md border border-gray-200 
        rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2 z-50"
      >
        {/* COLOR */}
        <button onClick={() => togglePanel("color")} className="toolbar-btn">
          <Palette size={18} />
        </button>

        {/* SHAPE */}
        <button onClick={() => togglePanel("shape")} className="toolbar-btn">
          <Square size={18} />
        </button>

        {/* EDGE */}
        <button onClick={() => togglePanel("edge")} className="toolbar-btn">
          <Slash size={18} />
        </button>

        {/* CANVAS */}
        <button onClick={() => togglePanel("canvas")} className="toolbar-btn">
          <Grid size={18} />
        </button>
      </div>

      {/* COLOR PANEL */}
      {activePanel === "color" && (
        <div className="toolbar-pop">
          {colors.map((c) => (
            <button
              key={c.key}
              onClick={() => changeColor(c.key)}
              className="w-7 h-7 rounded-full border"
              style={{ background: c.bg }}
            />
          ))}
        </div>
      )}

      {/* SHAPE PANEL */}
      {activePanel === "shape" && (
        <div className="toolbar-pop">
          <button
            onClick={() => changeShape("rounded")}
            className="toolbar-btn"
          >
            <Square size={18} />
          </button>

          <button onClick={() => changeShape("circle")} className="toolbar-btn">
            <Circle size={18} />
          </button>

          <button onClick={() => changeShape("pill")} className="toolbar-btn">
            <Minus size={18} />
          </button>
        </div>
      )}

      {/* EDGE PANEL */}
      {activePanel === "edge" && (
        <div className="toolbar-pop">
          <button
            onClick={() => changeEdgeType("smoothstep")}
            className="toolbar-btn"
          >
            curved
          </button>

          <button
            onClick={() => changeEdgeType("straight")}
            className="toolbar-btn"
          >
            straight
          </button>

          <button
            onClick={() => changeEdgeStyle("dashed")}
            className="toolbar-btn"
          >
            dashed
          </button>

          <button
            onClick={() => changeEdgeStyle("thick")}
            className="toolbar-btn"
          >
            thick
          </button>

          <button
            onClick={() => changeEdgeStyle("normal")}
            className="toolbar-btn"
          >
            normal
          </button>
        </div>
      )}

      {/* CANVAS PANEL */}
      {activePanel === "canvas" && (
        <div className="toolbar-pop">
          <button
            onClick={() => setCanvasPattern("grid")}
            className="toolbar-btn"
          >
            grid
          </button>

          <button
            onClick={() => setCanvasPattern("dots")}
            className="toolbar-btn"
          >
            dots
          </button>

          <button
            onClick={() => setCanvasPattern("blank")}
            className="toolbar-btn"
          >
            blank
          </button>

          <button
            onClick={() => setCanvasTheme("light")}
            className="toolbar-btn"
          >
            light
          </button>

          <button
            onClick={() => setCanvasTheme("dark")}
            className="toolbar-btn bg-slate-800 text-white"
          >
            dark
          </button>
        </div>
      )}
    </>
  );
}

export default FloatingToolbar;
