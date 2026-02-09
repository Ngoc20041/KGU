
'use client';

import { useMemo } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
    Position,
    ConnectionLineType,
    BackgroundVariant,
    ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { schemaData } from '@/lib/schema-meta';
import * as dagre from 'dagre';
import { TableNode } from './TableNode';



// --- Graph Logic ---

// Helper function to layout using dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 240; // Approx typical width
    // Heuristic for height based on cols (header ~36px + each row ~28px)
    const getNodeHeight = (node: Node) => {
        const cols = Array.isArray(node.data?.columns) ? node.data.columns.length : 3;
        return 36 + (cols * 28) + 16;
    };

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: getNodeHeight(node) });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        // Dagre uses center point, ReactFlow uses top-left
        // Center it
        node.targetPosition = direction === 'LR' ? Position.Left : Position.Top;
        node.sourcePosition = direction === 'LR' ? Position.Right : Position.Bottom;

        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - getNodeHeight(node) / 2,
        };

        return node;
    });

    return { nodes: layoutedNodes, edges };
};

// Transform metadata to ReactFlow elements
const initialNodes: Node[] = schemaData.map(table => ({
    id: table.name,
    type: 'table', // using custom node type
    position: { x: 0, y: 0 }, // Will be laid out later
    data: {
        name: table.name,
        columns: table.columns,
    },
}));

const initialEdges: Edge[] = []; // Collect edges

// Populate edges based on FKs
schemaData.forEach(table => {
    table.columns.forEach(col => {
        if (col.foreignKey) {
            // FK format: "target_table.column" (simplified earlier) or "schema.table.fk"
            // Our meta uses "table.id" pattern mostly? Let's check schema-meta.ts
            // In schema-meta.ts, FKs like "product.id"
            const [targetTable, targetCol] = col.foreignKey.split('.');

            if (targetTable) {
                initialEdges.push({
                    id: `e-${table.name}-${col.name}-${targetTable}`,
                    source: table.name,
                    sourceHandle: `${col.name}-right`,
                    target: targetTable,
                    targetHandle: `${targetCol}-left`, // Assuming linking to specific col logic if implemented
                    // However, standard dagre layout just links nodes. 
                    // To link specific handles inside nodes requires more complex logic.
                    // For now, let's keep it simple: link node to node, or try to handle?
                    // Custom node has handles for each row. 
                    // Let's try to link specific handles if possible. 
                    // ReactFlow handles: `id` prop on Handle component.

                    type: 'smoothstep',
                    animated: false,
                    style: { stroke: '#94a3b8', strokeWidth: 1.5 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 15,
                        height: 15,
                        color: '#94a3b8',
                    },
                });
            }
        }
    });
});


function SchemaERDInner() {
    const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
        () => getLayoutedElements(initialNodes, initialEdges, 'LR'),
        []
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    const nodeTypes = useMemo(() => ({ table: TableNode }), []);

    return (
        <div className="relative w-full h-full min-h-[800px] bg-gray-50 dark:bg-zinc-950">
            <div className="absolute inset-0">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                className="bg-gray-50 dark:bg-zinc-900"
                minZoom={0.1}
            >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                <Controls />
                <MiniMap
                    nodeColor={() => '#e2e8f0'}
                    maskColor="rgba(0, 0, 0, 0.1)"
                    className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm"
                />
            </ReactFlow>
            </div>
        </div>
    );
}

export default function SchemaERD() {
    return (
        <ReactFlowProvider>
            <SchemaERDInner />
        </ReactFlowProvider>
    );
}
