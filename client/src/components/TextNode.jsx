import { Handle, Position } from "reactflow";

function TextNode({ id, data, setNodes }) {
  const onChange = (e) => {
    const newText = e.target.value;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newText } }
          : node,
      ),
    );
  };

  return (
    <div className="bg-white border rounded px-3 py-2 shadow">
      {/* input */}
      <input value={data.label} onChange={onChange} className="nodrag outline-none" />

      {/* connection points */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default TextNode;
