// ────────────────────────────────────────────────────────
// useAngleMeasurer.ts — 사진 각도 측정 커스텀 훅
// [PRD 1] Data Layer 로직 분리: UI와 계산 로직을 분리합니다.
// ────────────────────────────────────────────────────────

import { useRef, useState, useCallback, useEffect } from 'react';

interface Point { x: number; y: number; }

// [PRD 4-3] 상수 선언
const POINT_RADIUS = 9;
const LINE_WIDTH = 2.5;
const POINT_COLORS = ['#3B82F6', '#22C55E', '#EF4444'] as const;
const POINT_LABELS = ['A', '관절', 'B'] as const;
const MAX_CANVAS_WIDTH = 900;

/** 세 점으로 꼭짓점(points[1])에서의 각도를 계산합니다. */
const calculateAngleDeg = (p0: Point, vertex: Point, p2: Point, isInverted: boolean): number => {
    const v1 = { x: p0.x - vertex.x, y: p0.y - vertex.y };
    const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
    const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
    if (mag1 === 0 || mag2 === 0) return 0;
    const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    const angle = Math.round(Math.acos(cosAngle) * (180 / Math.PI));
    return isInverted ? 360 - angle : angle;
};

const drawCanvas = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
    pts: Point[],
    isInverted: boolean,
): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 선분 그리기
    if (pts.length >= 2) {
        ctx.beginPath();
        ctx.strokeStyle = '#3B82F6'; // A -> vertex
        ctx.lineWidth = LINE_WIDTH;
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.stroke();
    }
    if (pts.length === 3) {
        ctx.beginPath();
        ctx.strokeStyle = '#EF4444'; // vertex -> B
        ctx.lineWidth = LINE_WIDTH;
        ctx.moveTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.stroke();

        // 호(Arc) 그리기
        const startAngle = Math.atan2(pts[0].y - pts[1].y, pts[0].x - pts[1].x);
        const endAngle = Math.atan2(pts[2].y - pts[1].y, pts[2].x - pts[1].x);

        ctx.beginPath();
        const arcRadius = 50;
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';

        ctx.arc(pts[1].x, pts[1].y, arcRadius, startAngle, endAngle, isInverted);
        ctx.stroke();

        // 내부 채우기 (반투명)
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.fill();
    }

    // 포인트 그리기
    pts.forEach((pt, i) => {
        ctx.beginPath();
        ctx.fillStyle = POINT_COLORS[i];
        ctx.arc(pt.x, pt.y, POINT_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${POINT_RADIUS}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(POINT_LABELS[i], pt.x, pt.y);
    });
};

export const useAngleMeasurer = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [calculatedAngle, setCalculatedAngle] = useState<number | null>(null);
    const [isInverted, setIsInverted] = useState(false);

    const redraw = useCallback((pts: Point[], currentInverted: boolean) => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;
        const ctx = canvas.getContext('2d');
        if (ctx) drawCanvas(ctx, img, canvas, pts, currentInverted);
    }, []);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            setImageDataUrl(evt.target?.result as string);
            setPoints([]);
            setCalculatedAngle(null);
            setIsInverted(false);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || points.length >= 3) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const newPts = [...points, {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        }];
        setPoints(newPts);
        redraw(newPts, isInverted);
        if (newPts.length === 3) {
            setCalculatedAngle(calculateAngleDeg(newPts[0], newPts[1], newPts[2], isInverted));
        }
    }, [points, redraw, isInverted]);

    const resetPoints = useCallback(() => {
        setPoints([]);
        setCalculatedAngle(null);
        setIsInverted(false);
        redraw([], false);
    }, [redraw]);

    const toggleInversion = useCallback(() => {
        const nextInverted = !isInverted;
        setIsInverted(nextInverted);
        redraw(points, nextInverted);
        if (points.length === 3) {
            setCalculatedAngle(calculateAngleDeg(points[0], points[1], points[2], nextInverted));
        }
    }, [isInverted, points, redraw]);

    useEffect(() => {
        if (!imageDataUrl) return;
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = Math.min(img.naturalWidth, MAX_CANVAS_WIDTH);
            canvas.height = canvas.width * (img.naturalHeight / img.naturalWidth);
            imageRef.current = img;
            redraw(points, isInverted);
        };
        img.src = imageDataUrl;
    }, [imageDataUrl, redraw, points, isInverted]);

    return {
        canvasRef, imageDataUrl, points, calculatedAngle, isInverted,
        handleFileUpload, handleCanvasClick, resetPoints, toggleInversion
    };
};
