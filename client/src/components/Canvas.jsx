import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import TextNode from "./TextNode.jsx";
import { useMemo } from "react";



function Canvas({ nodes, setNodes, edges, setEdges }) {
  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onConnect = (connection) => {
    setEdges((eds) => addEdge(connection, eds));
  };
  //text editing on nodes
  // const nodeTypes = {
  //   textNode: (props) => <TextNode {...props} setNodes={setNodes} />,
  // };
const nodeTypes = useMemo(
  () => ({
    textNode: (props) => <TextNode {...props} setNodes={setNodes} />,
  }),
  [setNodes],
);


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
