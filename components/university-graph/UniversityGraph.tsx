'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import cytoscape, { Core, ElementDefinition, NodeSingular } from 'cytoscape';
import { universities, University } from '@/lib/data/universities';
import { Search, Info, MapPin, Users, GraduationCap, ZoomIn, ZoomOut, Maximize, Loader2 } from 'lucide-react';
import clsx from 'clsx';

// Constants for visualization
// Constants for visualization
const REGION_COLORS = {
    Bac: '#ef4444',   // Red-500
    Trung: '#3b82f6', // Blue-500
    Nam: '#10b981',   // Emerald-500
};

const REGION_LABELS = {
    Bac: 'Miền Bắc',
    Trung: 'Miền Trung',
    Nam: 'Miền Nam',
};

// Helper to interpolate color between two hex values
const interpolateColor = (color1: string, color2: string, factor: number = 0.5) => {
    const result = color1.slice(1).match(/.{2}/g)!.map((hex, i) => {
        return Math.round(parseInt(hex, 16) + factor * (parseInt(color2.slice(1).match(/.{2}/g)![i], 16) - parseInt(hex, 16))).toString(16).padStart(2, '0');
    });
    return `#${result.join('')}`;
};

// Helper to update colors based on lecturer count (Lighter -> Darker)
const getLecturerColor = (region: 'Bac' | 'Trung' | 'Nam', lecturers: number, minL: number, maxL: number) => {
    const baseColor = REGION_COLORS[region];
    // Create a lighter version for min (mix with white) and darker for max (mix with black or just use base)
    // Actually, user asked for "gradient from light to dark".
    // Let's define Light and Dark bounds for each region.

    // Simplified approach: Mix base color with White (for light) and Black (for dark).
    // Factor 0 = Lightest (Min Lecturers), Factor 1 = Darkest (Max Lecturers)

    const factor = Math.max(0, Math.min(1, (lecturers - minL) / (maxL - minL || 1)));

    // Generate light and dark variants of the base color
    // Light: Tint 80% (closer to white)
    // Dark: Shade 20% (closer to black)

    // Hardcoded gradients for better aesthetics than pure math mixing
    const Gradients = {
        Bac: { start: '#fca5a5', end: '#7f1d1d' }, // Red-300 to Red-900
        Trung: { start: '#93c5fd', end: '#1e3a8a' }, // Blue-300 to Blue-900
        Nam: { start: '#6ee7b7', end: '#064e3b' },   // Emerald-300 to Emerald-900
    };

    return interpolateColor(Gradients[region].start, Gradients[region].end, factor);
}

// Helper to generate graph elements
const generateElements = (filterRegions: { Bac: boolean; Trung: boolean; Nam: boolean }): ElementDefinition[] => {
    const elements: ElementDefinition[] = [];

    // Calculate min/max lecturers for scaling
    const lecturerCounts = universities.map(u => u.lecturers);
    const minLecturers = Math.min(...lecturerCounts);
    const maxLecturers = Math.max(...lecturerCounts);

    // 1. Create Region Nodes (Level 1)
    const regions = ['Bac', 'Trung', 'Nam'] as const;
    regions.forEach(r => {
        if (filterRegions[r]) {
            elements.push({
                data: {
                    id: `region_${r}`,
                    label: REGION_LABELS[r],
                    type: 'region',
                    color: REGION_COLORS[r],
                    size: 80, // Fixed large size for regions
                },
                position: r === 'Bac' ? { x: 400, y: 100 } : r === 'Trung' ? { x: 400, y: 400 } : { x: 400, y: 700 }, // Initial rough positions
                locked: false,
                grabbable: true,
                classes: 'region',
            });
        }
    });

    // 2. Create University Nodes (Level 2) & Edges
    universities.forEach(uni => {
        if (filterRegions[uni.region]) {
            // Node
            // Size: 20 -> 60 based on students (5k -> 60k)
            // Note: Updated logic to handle larger student numbers if user changed data (e.g. 400k)
            // Clamp visualization size to reasonable bounds [25, 90]
            const size = Math.max(25, Math.min(90, 25 + (uni.students / 50000) * 15));

            // Color gradient based on lecturers
            const nodeColor = getLecturerColor(uni.region, uni.lecturers, minLecturers, maxLecturers);

            elements.push({
                data: {
                    id: uni.id,
                    label: uni.label,
                    type: 'university',
                    parentRegion: uni.region,
                    students: uni.students,
                    lecturers: uni.lecturers,
                    desc: uni.description,
                    color: nodeColor,
                    size: size,
                },
                classes: 'university',
            });

            // Edge to Region
            elements.push({
                data: {
                    id: `e_${uni.id}_region`,
                    source: uni.id,
                    target: `region_${uni.region}`,
                },
                classes: 'edge-region',
            });
        }
    });

    // 3. Connect Regions together (optional, helps layout keep them relative)
    if (filterRegions.Bac && filterRegions.Trung) {
        elements.push({ data: { id: 'e_bac_trung', source: 'region_Bac', target: 'region_Trung' }, classes: 'edge-backbone' });
    }
    if (filterRegions.Trung && filterRegions.Nam) {
        elements.push({ data: { id: 'e_trung_nam', source: 'region_Trung', target: 'region_Nam' }, classes: 'edge-backbone' });
    }

    return elements;
};


export default function UniversityGraph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cy, setCy] = useState<Core | null>(null);
    const [selectedNode, setSelectedNode] = useState<University | null>(null);
    const [hoverNode, setHoverNode] = useState<string | null>(null); // Label of hovered node
    const [filters, setFilters] = useState<{ Bac: boolean; Trung: boolean; Nam: boolean }>({ Bac: true, Trung: true, Nam: true });

    // Initialize Graph
    useEffect(() => {
        if (!containerRef.current) return;

        // Init Cytoscape
        const cyInstance = cytoscape({
            container: containerRef.current,
            elements: [], // Will follow up with update
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'color': '#fff',
                        'text-outline-width': 2,
                        'text-outline-color': '#333',
                        'background-color': 'data(color)',
                        'width': 'data(size)',
                        'height': 'data(size)',
                        'font-size': '12px',
                    }
                },
                {
                    selector: 'node.region',
                    style: {
                        'font-size': '18px',
                        'font-weight': 'bold',
                        'text-outline-width': 3,
                        'border-width': 4,
                        'border-color': '#fff',
                        'shape': 'hexagon',
                        'z-index': 10,
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 1,
                        'line-color': '#ccc',
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'none',
                    }
                },
                {
                    selector: 'edge.edge-backbone',
                    style: {
                        'width': 3,
                        'line-color': '#ddd',
                        'line-style': 'dashed',
                    }
                },
                {
                    selector: ':selected',
                    style: {
                        'border-width': 4,
                        'border-color': '#fbbf24', // Amber border
                        'background-opacity': 1,
                    }
                }
            ],
            layout: {
                name: 'grid', // Initial placeholder
            },
            minZoom: 0.2,
            maxZoom: 3,
            wheelSensitivity: 0.2,
        });

        // Events
        cyInstance.on('tap', 'node', (evt) => {
            const node = evt.target;
            const data = node.data();
            if (data.type === 'university') {
                // Find full university object details
                const uni = universities.find(u => u.id === data.id);
                if (uni) setSelectedNode(uni);
            } else {
                setSelectedNode(null);
            }
        });

        // Clear selection on bg tap
        cyInstance.on('tap', (evt) => {
            if (evt.target === cyInstance) {
                setSelectedNode(null);
            }
        });

        cyInstance.on('mouseover', 'node', (evt) => {
            const node = evt.target;
            containerRef.current!.style.cursor = 'pointer';
            // Only show tooltip for small nodes?
            setHoverNode(node.data('label'));
        });

        cyInstance.on('mouseout', 'node', () => {
            containerRef.current!.style.cursor = 'default';
            setHoverNode(null);
        });

        setCy(cyInstance);

        return () => {
            cyInstance.destroy();
        };
    }, []);

    // Update Data & Layout when filters change, OR when cy is ready
    useEffect(() => {
        if (!cy) return;

        const elements = generateElements(filters);

        // Batch update
        cy.batch(() => {
            cy.elements().remove();
            cy.add(elements);
        });

        // Run layout
        const layout = cy.layout({
            name: 'cose', // cose (Compound Spring Embedder) works well for networks
            animate: true,
            animationDuration: 500,
            padding: 50,
            nodeOverlap: 20,
            idealEdgeLength: 60,
            edgeElasticity: 100,
            nestingFactor: 5,
            gravity: 80,
            numIter: 1000,
            initialTemp: 200,
            coolingFactor: 0.95,
            minTemp: 1.0
        } as any);
        layout.run();

    }, [cy, filters]);

    // Handlers
    const handleZoomIn = () => cy?.zoom(cy.zoom() * 1.2);
    const handleZoomOut = () => cy?.zoom(cy.zoom() / 1.2);
    const handleFit = () => cy?.fit(undefined, 50);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-gray-50 dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-sm relative">

            {/* Header / Filter Bar */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md p-3 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 flex flex-col gap-3">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Khu vực hiển thị
                </h3>
                <div className="flex flex-col gap-2">
                    {(['Bac', 'Trung', 'Nam'] as const).map(r => (
                        <label key={r} className="flex items-center space-x-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded transition">
                            <input
                                type="checkbox"
                                checked={filters[r]}
                                onChange={() => setFilters(prev => ({ ...prev, [r]: !prev[r] }))}
                                className={clsx(
                                    "rounded text-indigo-600 focus:ring-indigo-500 border-gray-300",
                                )}
                            />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: REGION_COLORS[r] }}></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{REGION_LABELS[r]}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Canvas Area */}
            <div ref={containerRef} className="w-full h-full relative" />

            {/* Hover Tooltip (Simple floating) */}
            {hoverNode && (
                <div className="absolute top-4 right-4 z-10 bg-black/75 text-white px-3 py-1 rounded-full text-sm pointer-events-none transition-opacity">
                    {hoverNode}
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
                <button onClick={handleZoomIn} className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700">
                    <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
                <button onClick={handleZoomOut} className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700">
                    <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
                <button onClick={handleFit} className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700">
                    <Maximize className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
            </div>

            {/* Selected Node Info Panel */}
            {selectedNode && (
                <div className="absolute top-4 right-4 z-20 w-80 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 p-4 animate-in slide-in-from-right-10 fade-in duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                                {REGION_LABELS[selectedNode.region]}
                            </span>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2 leading-tight">
                                {selectedNode.label}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedNode.description}</p>
                        </div>
                        <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                                <Users className="w-4 h-4" />
                                <span className="text-xs font-semibold">Sinh viên</span>
                            </div>
                            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                {selectedNode.students.toLocaleString()}
                            </span>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                                <GraduationCap className="w-4 h-4" />
                                <span className="text-xs font-semibold">Giảng viên</span>
                            </div>
                            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                {selectedNode.lecturers.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
