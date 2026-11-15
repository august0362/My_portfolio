export interface MapView { x: number; y: number; zoom: number }
export interface MapSize { width: number; height: number; planeWidth: number; planeHeight: number }

export function fitScene(width: number, height: number, aspect = 16 / 9): MapSize {
  const planeWidth = Math.max(width, height * aspect);
  return { width, height, planeWidth, planeHeight: planeWidth / aspect };
}

export function boundView(view: MapView, size: MapSize): MapView {
  const zoom = Math.max(1, Math.min(1.8, view.zoom));
  const limitX = Math.max(0, (size.planeWidth * zoom - size.width) / 2);
  const limitY = Math.max(0, (size.planeHeight * zoom - size.height) / 2);
  return { zoom, x: Math.max(-limitX, Math.min(limitX, view.x)), y: Math.max(-limitY, Math.min(limitY, view.y)) };
}

export function zoomView(view: MapView, zoom: number, size: MapSize, point = { x: 0, y: 0 }): MapView {
  const nextZoom = Math.max(1, Math.min(1.8, zoom));
  const ratio = nextZoom / view.zoom;
  return boundView({ zoom: nextZoom, x: point.x - (point.x - view.x) * ratio, y: point.y - (point.y - view.y) * ratio }, size);
}

export function revealPoint(view: MapView, size: MapSize, point: { x: number; y: number }): MapView {
  return boundView({ ...view, x: (0.5 - point.x) * size.planeWidth * view.zoom, y: (0.5 - point.y) * size.planeHeight * view.zoom }, size);
}
