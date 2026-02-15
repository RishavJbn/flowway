import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import TextNode from "./TextNode.jsx";

// ✅ STATIC — defined outside component
const nodeTypes = {
  textNode: TextNode,
};

function Canvas({ nodes, edges, setNodes, setEdges }) {
  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onConnect = (connection) => {
    setEdges((eds) => addEdge(connection, eds));
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
}

export default Canvas;
