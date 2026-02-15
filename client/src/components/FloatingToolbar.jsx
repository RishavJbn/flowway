import { useState, useEffect, useRef } from "react";
import {
  Palette,
  Square,
  Circle,
  Minus,
  Grid3X3,
  Dot,
  Slash,
  Moon,
  Sun,
  Plus,
  ArrowRight,
  ArrowRightCircle,
  Minus as LineIcon,
} from "lucide-react";

function FloatingToolbar({
  addNode,
  selectedNodeId,
  selectedEdgeId,
  setNodes,
  setEdges,
  setCanvasTheme,
  setCanvasPattern,
}) {
  const [activePanel, setActivePanel] = useState(null);
  const toolbarRef = useRef();

  /* ---------- close panel when clicking outside ---------- */
  useEffect(() => {
    const handleClick = (e) => {
      if (!toolbarRef.current?.contains(e.target)) {
        setActivePanel(null);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  /* ---------- NODE COLORS ---------- */
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

  /* ---------- SHAPE ---------- */
  const changeShape = (shape) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNodeId ? { ...n, data: { ...n.data, shape } } : n,
      ),
    );
  };

  /* ---------- EDGE ---------- */
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
          return { ...e, style: { strokeDasharray: "5 5", strokeWidth: 2 } };

        if (styleType === "thick") return { ...e, style: { strokeWidth: 4 } };

        if (styleType === "normal") return { ...e, style: { strokeWidth: 2 } };

        return e;
      }),
    );
  };

  return (
    <div ref={toolbarRef}>
      {/* MAIN BAR */}
      <div className="fw-toolbar">
        {/* ADD NODE */}
        <button className="fw-btn primary" onClick={addNode} title="Add node">
          <Plus size={18} />
        </button>

        <div className="fw-divider" />

        {/* COLOR */}
        <button
          className="fw-btn"
          onClick={() => togglePanel("color")}
          title="Color"
        >
          <Palette size={18} />
        </button>

        {/* SHAPE */}
        <button
          className="fw-btn"
          onClick={() => togglePanel("shape")}
          title="Shape"
        >
          <Square size={18} />
        </button>

        {/* EDGE */}
        <button
          className="fw-btn"
          onClick={() => togglePanel("edge")}
          title="Edge"
        >
          <Slash size={18} />
        </button>

        {/* CANVAS */}
        <button
          className="fw-btn"
          onClick={() => togglePanel("canvas")}
          title="Canvas"
        >
          <Grid3X3 size={18} />
        </button>
      </div>

      {/* ---------- COLOR PANEL ---------- */}
      {activePanel === "color" && (
        <div className="fw-panel">
          {colors.map((c) => (
            <button
              key={c.key}
              className="fw-color"
              style={{ background: c.bg }}
              onClick={() => changeColor(c.key)}
            />
          ))}
        </div>
      )}

      {/* ---------- SHAPE PANEL ---------- */}
      {activePanel === "shape" && (
        <div className="fw-panel">
          <button className="fw-btn" onClick={() => changeShape("rounded")}>
            <Square size={18} />
          </button>
          <button className="fw-btn" onClick={() => changeShape("circle")}>
            <Circle size={18} />
          </button>
          <button className="fw-btn" onClick={() => changeShape("pill")}>
            <Minus size={18} />
          </button>
        </div>
      )}

      {/* ---------- EDGE PANEL ---------- */}
      {activePanel === "edge" && (
        <div className="fw-panel">
          <button
            className="fw-btn"
            onClick={() => changeEdgeType("smoothstep")}
          >
            <ArrowRight size={18} />
          </button>
          <button className="fw-btn" onClick={() => changeEdgeType("straight")}>
            <LineIcon size={18} />
          </button>
          <button className="fw-btn" onClick={() => changeEdgeStyle("dashed")}>
            <Slash size={18} />
          </button>
          <button className="fw-btn" onClick={() => changeEdgeStyle("thick")}>
            <ArrowRightCircle size={18} />
          </button>
        </div>
      )}

      {/* ---------- CANVAS PANEL ---------- */}
      {activePanel === "canvas" && (
        <div className="fw-panel">
          <button className="fw-btn" onClick={() => setCanvasPattern("grid")}>
            <Grid3X3 size={18} />
          </button>
          <button className="fw-btn" onClick={() => setCanvasPattern("dots")}>
            <Dot size={18} />
          </button>
          <button className="fw-btn" onClick={() => setCanvasPattern("blank")}>
            <Square size={18} />
          </button>
          <button className="fw-btn" onClick={() => setCanvasTheme("light")}>
            <Sun size={18} />
          </button>
          <button
            className="fw-btn dark"
            onClick={() => setCanvasTheme("dark")}
          >
            <Moon size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default FloatingToolbar;
