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
      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNode();
          }}
          className="nodrag absolute -top-2.5 -right-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md border-none transition-all hover:scale-115 cursor-pointer duration-150 font-bold"
          style={{ fontSize: "14px", paddingBottom: "2px" }}
          title="Delete Node"
        >
          ×
        </button>
      )}

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
