'use client'

import { useEffect, useRef, useState } from 'react'
import MatrixPageComponent from '@/components/matrix/MatrixPageComponent'
import {
    ArrowBigLeft,
    TriangleAlert,
    Menu,
    X,
} from 'lucide-react'

/* =======================
   Constants & Types
======================= */
const ZOOM_SPEED = 0.0015
const MIN_SCALE = 0.2
const MAX_SCALE = 3

type ViewState = {
    x: number
    y: number
    scale: number
    dragging: boolean
    startX: number
    startY: number
}

/* =======================
   Legend Item
======================= */
function LegendItem({
    icon,
    children,
}: {
    icon: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className="flex items-start gap-3 text-sm leading-snug">
            <div className="mt-1 shrink-0">{icon}</div>
            <p>{children}</p>
        </div>
    )
}

/* =======================
   Legend Content (REUSE)
======================= */
function LegendContent({ onBack }: { onBack: () => void }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b">
                <TriangleAlert className="w-5 h-5 text-yellow-500" />
                <p className="text-base font-semibold tracking-wide">
                    Chú thích ký hiệu
                </p>
            </div>

            <LegendItem
                icon={
                    <div className="relative w-5 h-5">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-red-500" />
                        <div
                            className="
                absolute right-0 top-1/2 -translate-y-1/2
                w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px]
                border-t-transparent border-b-transparent border-l-red-500
              "
                        />
                    </div>
                }
            >
                <span className="font-semibold">Xe giao hàng</span>
                <span className="text-muted-foreground"> — hướng di chuyển</span>
            </LegendItem>

            <LegendItem icon={<div className="w-5 h-5 rounded bg-green-500" />}>
                <span className="font-semibold">Điểm lấy hàng</span>{' '}
                <span className="text-muted-foreground">(Pickup)</span>
            </LegendItem>

            <LegendItem
                icon={
                    <div
                        className="
              w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px]
              border-l-transparent border-r-transparent border-b-red-500
            "
                    />
                }
            >
                <span className="font-semibold">Điểm giao hàng</span>{' '}
                <span className="text-muted-foreground">(Delivery)</span>
            </LegendItem>

            <LegendItem icon={<div className="w-5 h-5 rounded-full bg-yellow-500" />}>
                <span className="font-semibold">Trạm xăng</span>{' '}
                <span className="text-muted-foreground">(có thể đổ xăng)</span>
            </LegendItem>

            <LegendItem icon={<div className="w-5 h-5 bg-blue-500/40" />}>
                <span className="font-semibold">Dấu vết di chuyển</span>{' '}
                <span className="text-muted-foreground">của xe</span>
            </LegendItem>

            <LegendItem icon={<div className="w-5 h-5 bg-green-500 rounded-full" />}>
                <span className="font-semibold">Điểm xe dừng</span>{' '}
                <span className="text-muted-foreground">
                    (lấy hàng / giao hàng / đổ xăng)
                </span>
            </LegendItem>

            <div
                onClick={onBack}
                className="
          mt-2 flex items-center gap-2
          px-3 py-2 rounded-lg
          bg-black/5 hover:bg-black/10
          dark:bg-white/10 dark:hover:bg-white/20
          text-sm font-medium
          cursor-pointer transition
        "
            >
                <ArrowBigLeft className="w-4 h-4" />
                <p>Quay lại dashboard</p>
            </div>
        </div>
    )
}

/* =======================
   Main Component
======================= */
export default function MatrixView() {
    const containerRef = useRef<HTMLDivElement>(null)
    const viewRef = useRef<HTMLDivElement>(null)
    const [legendOpen, setLegendOpen] = useState(false)

    const state = useRef<ViewState>({
        x: 0,
        y: 0,
        scale: 1,
        dragging: false,
        startX: 0,
        startY: 0,
    })

    /* ===== Transform ===== */
    const applyTransform = () => {
        const el = viewRef.current
        if (!el) return
        const { x, y, scale } = state.current
        el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
    }

    /* ===== Zoom ===== */
    const handleWheel = (e: React.WheelEvent) => {
        const view = viewRef.current
        if (!view) return

        const rect = view.getBoundingClientRect()
        const ox = e.clientX - rect.left
        const oy = e.clientY - rect.top

        const s = state.current
        const prevScale = s.scale

        s.scale *= Math.exp(-e.deltaY * ZOOM_SPEED)
        s.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s.scale))

        const k = s.scale / prevScale
        s.x = ox - k * (ox - s.x)
        s.y = oy - k * (oy - s.y)

        applyTransform()
    }

    /* ===== Drag ===== */
    const handleMouseDown = (e: React.MouseEvent) => {
        const s = state.current
        s.dragging = true
        s.startX = e.clientX - s.x
        s.startY = e.clientY - s.y

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e: MouseEvent) => {
        const s = state.current
        if (!s.dragging) return
        s.x = e.clientX - s.startX
        s.y = e.clientY - s.startY
        applyTransform()
    }

    const handleMouseUp = () => {
        state.current.dragging = false
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
    }

    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    const backToDashboard = () => {
        window.location.href = '/'
    }

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* ===== CANVAS ===== */}
            <div
                ref={containerRef}
                className="bg-muted w-full h-full select-none"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
            >
                <div
                    ref={viewRef}
                    className="origin-top-left will-change-transform md:ml-64 p-4 md:p-8"
                >
                    <MatrixPageComponent />
                </div>
            </div>

            {/* ===== TOGGLE BUTTON (ALWAYS) ===== */}
            <button
                onClick={() => setLegendOpen((v) => !v)}
                className="
                cursor-pointer
                    fixed top-4 left-4 z-50
                    w-10 h-10
                    rounded-full
                    bg-black text-white
                    flex items-center justify-center
                    shadow-lg
                    hover:scale-105 active:scale-95
                    transition
                    "
            >
                {legendOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* ===== LEGEND PANEL ===== */}
            {legendOpen && (
                <>
                    {/* Overlay (mobile focus) */}
                    <div
                        className="fixed inset-0 bg-black/30 z-40 md:hidden"
                        onClick={() => setLegendOpen(false)}
                    />

                    <div
                        className="
              fixed z-50
              left-4 top-16
              md:top-4 md:left-16
              max-w-xs
              w-[90vw] md:w-80
              bg-white/90 dark:bg-neutral-900/90
              backdrop-blur-lg
              border border-black/10 dark:border-white/10
              p-4 rounded-xl
              shadow-xl
              animate-slide-up
            "
                    >
                        <LegendContent onBack={backToDashboard} />
                    </div>
                </>
            )}
        </div>
    )
}
