import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  Controls,
  Background,
} from "reactflow";
import TextNode from "./TextNode";

const nodeTypes = {
  textNode: TextNode,
};

function Canvas({
  nodes,
  edges,
  setNodes,
  setEdges,
  setSelectedNodeId,
  setSelectedEdgeId,
  canvasTheme,
  canvasPattern,
}) {
  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onConnect = (connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          type: "smoothstep",
          style: { stroke: "#94a3b8", strokeWidth: 2 },
        },
        eds,
      ),
    );
  };

 const onSelectionChange = ({ nodes, edges }) => {
   if (nodes.length > 0) setSelectedNodeId(nodes[0].id);
   else setSelectedNodeId(null);

   if (edges.length > 0) setSelectedEdgeId(edges[0].id);
   else setSelectedEdgeId(null);
 };


  const renderBackground = () => {
    if (canvasPattern === "dots")
      return (
        <Background
          variant="dots"
          gap={20}
          size={2}
          color={canvasTheme === "dark" ? "#374151" : "#e5e7eb"}
        />
      );

    if (canvasPattern === "grid")
      return (
        <Background
          variant="lines"
          gap={24}
          size={1}
          color={canvasTheme === "dark" ? "#374151" : "#e5e7eb"}
        />
      );

    return null;
  };

  return (
    <div
      className={`w-full h-full ${
        canvasTheme === "dark" ? "bg-slate-900" : "bg-[#f6f7fb]"
      }`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView
      >
        <MiniMap  className="border-2 border-blue-500 bg-gray-800"/>
        <Controls />
        {renderBackground()}
      </ReactFlow>
    </div>
  );
}

export default Canvas;
