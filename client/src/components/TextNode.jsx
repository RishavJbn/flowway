import { Handle, Position, useReactFlow } from "reactflow";

function TextNode({ id, data, selected }) {
  const { setNodes, setEdges } = useReactFlow();

  const onChange = (e) => {
    const value = e.target.value;

    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: value } } : n,
      ),
    );
  };

  const deleteNode = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const colorMap = {
    blue: "bg-indigo-100",
    purple: "bg-purple-100",
    pink: "bg-pink-100",
    green: "bg-green-100",
    yellow: "bg-yellow-100",
  };

  const shapeMap = {
    rounded: "rounded-xl",
    circle: "rounded-full",
    pill: "rounded-3xl",
  };

  return (
    <div
      className={`
        ${colorMap[data.color] || "bg-white"}
        ${shapeMap[data.shape] || "rounded-xl"}
        border border-gray-200
        px-5 py-4
        relative
        min-w-40
        cursor-move
        backdrop-blur
        ${selected ? "ring-2 ring-indigo-300" : ""}
      `}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteNode();
        }}
        className="nodrag absolute -top-2 -right-2 bg-white border rounded-full w-5 h-5 text-xs"
      >
        ×
      </button>

      <input
        value={data.label}
        onChange={onChange}
        className="nodrag bg-transparent outline-none w-full text-center"
      />

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default TextNode;
