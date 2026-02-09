'use client'

import {useRef, useState, useEffect} from 'react'
import MatrixPageComponent from '@/components/matrix/MatrixPageComponent'
import {Menu, X, TriangleAlert, ArrowBigLeft} from 'lucide-react'
/* =======================
   Constants
======================= */
const MIN_SCALE = 0.3
const MAX_SCALE = 3
const WHEEL_ZOOM_SPEED = 0.0015
const PINCH_ZOOM_SPEED = 0.004

/* =======================
   Pan & Zoom Hook
======================= */
function usePanZoom(
    ref: React.RefObject<HTMLDivElement | null>,
    options?: {
        initialScale?: number
        initialX?: number
        initialY?: number
        centerOnInit?: boolean
    }
) {
    const state = useRef({
        x: options?.initialX ?? 0,
        y: options?.initialY ?? 0,
        scale: options?.initialScale ?? 1,

        // pan
        isPanning: false,
        startX: 0,
        startY: 0,

        // pinch
        lastDistance: 0,
    })

    const apply = () => {
        if (!ref.current) return
        const {x, y, scale} = state.current
        ref.current.style.transform =
            `translate(${x}px, ${y}px) scale(${scale})`
    }

    /* ===== INIT ZOOM ===== */
    useEffect(() => {
        if (!ref.current) return

        if (options?.centerOnInit) {
            const rect = ref.current.getBoundingClientRect()
            const cx = rect.width / 2
            const cy = rect.height / 2

            const s = state.current
            const prevScale = 1
            const nextScale = s.scale

            const k = nextScale / prevScale
            s.x = cx - k * (cx - s.x)
            s.y = cy - k * (cy - s.y)
        }

        apply()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /* =======================
       DESKTOP
    ======================= */

    // ZOOM (wheel)
    const onWheel = (e: React.WheelEvent) => {
        e.preventDefault()
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const cx = e.clientX - rect.left
        const cy = e.clientY - rect.top

        const s = state.current
        const prevScale = s.scale

        s.scale *= Math.exp(-e.deltaY * WHEEL_ZOOM_SPEED)
        s.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s.scale))

        const k = s.scale / prevScale
        s.x = cx - k * (cx - s.x)
        s.y = cy - k * (cy - s.y)

        apply()
    }

    // PAN (mouse)
    const onMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return
        e.preventDefault()

        const s = state.current
        s.isPanning = true
        s.startX = e.clientX - s.x
        s.startY = e.clientY - s.y

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
        const s = state.current
        if (!s.isPanning) return

        s.x = e.clientX - s.startX
        s.y = e.clientY - s.startY
        apply()
    }

    const onMouseUp = () => {
        state.current.isPanning = false
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
    }

    /* =======================
       MOBILE
    ======================= */

    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            const t = e.touches[0]
            const s = state.current
            s.isPanning = true
            s.startX = t.clientX - s.x
            s.startY = t.clientY - s.y
        }
    }

    const onTouchMove = (e: React.TouchEvent) => {
        const s = state.current

        // PAN
        if (e.touches.length === 1 && s.isPanning) {
            const t = e.touches[0]
            s.x = t.clientX - s.startX
            s.y = t.clientY - s.startY
            apply()
        }

        // PINCH ZOOM
        if (e.touches.length === 2) {
            e.preventDefault()

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const [a, b] = e.touches
            const dx = a.clientX - b.clientX
            const dy = a.clientY - b.clientY
            const distance = Math.hypot(dx, dy)

            const cx = (a.clientX + b.clientX) / 2
            const cy = (a.clientY + b.clientY) / 2

            if (s.lastDistance) {
                const prevScale = s.scale

                s.scale += (distance - s.lastDistance) * PINCH_ZOOM_SPEED
                s.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s.scale))

                const k = s.scale / prevScale
                s.x = cx - k * (cx - s.x)
                s.y = cy - k * (cy - s.y)

                apply()
            }

            s.lastDistance = distance
        }
    }

    const onTouchEnd = () => {
        const s = state.current
        s.isPanning = false
        s.lastDistance = 0
    }

    /* ===== API ===== */
    const setZoom = (scale: number, cx?: number, cy?: number) => {
        const s = state.current
        const prevScale = s.scale

        s.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))

        if (cx !== undefined && cy !== undefined) {
            const k = s.scale / prevScale
            s.x = cx - k * (cx - s.x)
            s.y = cy - k * (cy - s.y)
        }

        apply()
    }

    return {
        onWheel,
        onMouseDown,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        setZoom,
    }
}

/* =======================
   Legend
======================= */
function LegendContent() {
    return (
        <div className="flex flex-col gap-3 ">
            <div className="flex items-center gap-2 border-b pb-2">
                <TriangleAlert className="w-5 h-5 text-yellow-500"/>
                <b>Chú thích ký hiệu</b>
            </div>

            <div className="text-sm">🚚 Xe giao hàng</div>
            <div className="text-sm">🟢 Điểm lấy hàng</div>
            <div className="text-sm">🔺 Điểm giao hàng</div>
            <div className="text-sm">🟡 Trạm xăng</div>

            <button
                onClick={() => window.location.href = '/'}
                className="cursor-pointer mt-3 w-fit flex items-center gap-2 px-3 py-2 bg-black/5 rounded-lg hover:bg-black/30"
            >
                <ArrowBigLeft size={16}/>
                Quay lại dashboard
            </button>
        </div>
    )
}

/* =======================
   Main Component
======================= */
export default function MatrixView() {
    const viewRef = useRef<HTMLDivElement>(null)
    const [legendOpen, setLegendOpen] = useState(false)

    const panZoom = usePanZoom(viewRef, {
        initialScale: 0.8,   // 🔥 ZOOM DEFAULT
        centerOnInit: true,  // 🔥 GIỮ Ở GIỮA
    })

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-muted">
            {/* CANVAS */}
            <div
                className="w-full h-full touch-pan-x touch-pan-y cursor-grab active:cursor-grabbing"
                onWheel={panZoom.onWheel}
                onMouseDown={panZoom.onMouseDown}
                onTouchStart={panZoom.onTouchStart}
                onTouchMove={panZoom.onTouchMove}
                onTouchEnd={panZoom.onTouchEnd}
            >
                <div
                    ref={viewRef}
                    className="origin-top-left will-change-transform p-3 md:ml-64 md:p-8"
                >
                    <MatrixPageComponent/>
                </div>
            </div>

            {/* MENU */}
            <button
                onClick={() => setLegendOpen(v => !v)}
                className="cursor-pointer fixed bottom-4 right-4 z-[100] w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg"
            >
                {legendOpen ? <X/> : <Menu/>}
            </button>

            {/* LEGEND */}
            {legendOpen && (
                <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setLegendOpen(v => !v)}>
                    <div className="absolute w-full max-w-sm bg-white rounded-2xl p-5 m-1"  onClick={(e) => e.stopPropagation()}>
                        <LegendContent/>
                    </div>
                </div>
            )}
        </div>
    )
}
