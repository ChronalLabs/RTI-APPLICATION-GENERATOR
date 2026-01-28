import { useState, useCallback, useEffect, memo } from 'react';
import ReactFlow, {
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    Handle,
    Position,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { questionService } from '../services/api';

// Custom Node Components using Tailwind/SaaS Variables
const RootNode = memo(({ data }) => (
    <div className="bg-indigo-600 text-white rounded-xl px-6 py-3 font-bold text-center shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-400 min-w-[180px]">
        <Handle type="source" position={Position.Bottom} className="!bg-white" />
        {data.label}
    </div>
));

const DepartmentNode = memo(({ data }) => (
    <div className="bg-cyan-600 text-white rounded-xl px-4 py-2.5 font-bold text-center border border-cyan-400/30 min-w-[160px] shadow-lg">
        <Handle type="target" position={Position.Top} className="!bg-white" />
        {data.label}
        <Handle type="source" position={Position.Bottom} className="!bg-white" />
    </div>
));

const CategoryNode = memo(({ data }) => (
    <div className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm text-center border border-emerald-400/30 min-w-[140px]">
        <Handle type="target" position={Position.Top} className="!bg-white" />
        {data.label}
        <Handle type="source" position={Position.Bottom} className="!bg-white" />
    </div>
));

const TemplateNode = memo(({ data }) => (
    <div className="bg-amber-600 text-white rounded-lg px-4 py-2 text-sm text-center border border-amber-400/30 min-w-[140px] shadow-lg">
        <Handle type="target" position={Position.Top} className="!bg-white" />
        {data.label}
    </div>
));

const QuestionNode = memo(({ data }) => (
    <div className="bg-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs text-center border border-slate-700 min-w-[120px]">
        <Handle type="target" position={Position.Top} className="!bg-slate-500" />
        {data.label}
    </div>
));

// Node type mapping
const nodeTypes = {
    root: RootNode,
    department: DepartmentNode,
    category: CategoryNode,
    intent: CategoryNode, // Reuse Category style for Intent
    template: TemplateNode,
    question: QuestionNode,
};

const nodeWidth = 200;
const nodeHeight = 60;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = 'top';
        node.sourcePosition = 'bottom';

        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

export default function GraphPage() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await questionService.getGraphData();
                if (response.success && response.data) {
                    const layouted = getLayoutedElements(response.data.nodes, response.data.edges);
                    setNodes(layouted.nodes);
                    setEdges(layouted.edges);
                }
            } catch (err) {
                console.error('Failed to load graph data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    // Search Effect
    useEffect(() => {
        setNodes((currentNodes) =>
            currentNodes.map((node) => {
                const isMatch = node.data.label.toLowerCase().includes(searchQuery.toLowerCase());
                const shouldDim = searchQuery && !isMatch;
                return {
                    ...node,
                    style: {
                        opacity: shouldDim ? 0.2 : 1,
                        transition: 'opacity 0.3s ease'
                    }
                };
            })
        );
    }, [searchQuery]);

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-[1800px] mx-auto flex flex-col h-screen">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Knowledge Graph</h1>
                    <p className="text-slate-400 text-sm">Interactive visualization of Department-Issue-Question relationships.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-96">
                    <input
                        type="text"
                        placeholder="Search graph..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg input-saas text-sm"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</div>
                </div>
            </div>

            <div className="flex-1 glass-panel rounded-2xl overflow-hidden border border-white/10 relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                )}
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-black/20"
                >
                    <Background color="#333" gap={20} size={1} />
                    <Controls className="bg-slate-800 border-slate-700 text-white rounded-lg overflow-hidden" />
                </ReactFlow>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <h3 className="text-cyan-400 font-medium text-sm">Departments</h3>
                    <p className="text-xl font-bold text-white">{nodes.filter(n => n.type === 'department').length}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <h3 className="text-emerald-400 font-medium text-sm">Categories</h3>
                    <p className="text-xl font-bold text-white">{nodes.filter(n => n.type === 'category').length}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <h3 className="text-indigo-400 font-medium text-sm">Connections</h3>
                    <p className="text-xl font-bold text-white">{edges.length}</p>
                </div>
            </div>
        </div>
    );
}
