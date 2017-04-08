import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatColorValues } from '../../../utils/toolHelpers';

const MAGNIFIER_SIZE = 132;
const MAGNIFIER_GRID = 11;
const MAGNIFIER_OFFSET = 10;

function ColorEyedropperOverlays({
  canvasRef,
  stageRef,
  imageLoaded,
  onSample,
  onStatusChange,
}) {
  const { t } = useTranslation();
  const magnifierRef = useRef(null);
  const [cursor, setCursor] = useState(null);
  const [hoverHex, setHoverHex] = useState('#1d4ed8');

  const sampleAtPoint = useCallback(
    (clientX, clientY) => {
      const canvas = canvasRef.current;
      const stage = stageRef.current;
      if (!canvas || !imageLoaded) return null;

      const canvasRect = canvas.getBoundingClientRect();
      const stageRect = stage?.getBoundingClientRect() ?? canvasRect;

      if (
        clientX < canvasRect.left ||
        clientY < canvasRect.top ||
        clientX >= canvasRect.right ||
        clientY >= canvasRect.bottom
      ) {
        return null;
      }

      const scaleX = canvas.width / canvasRect.width;
      const scaleY = canvas.height / canvasRect.height;
      const x = Math.min(canvas.width - 1, Math.max(0, Math.floor((clientX - canvasRect.left) * scaleX)));
      const y = Math.min(canvas.height - 1, Math.max(0, Math.floor((clientY - canvasRect.top) * scaleY)));

      const pixel = canvas.getContext('2d').getImageData(x, y, 1, 1).data;

      return {
        x,
        y,
        stageX: clientX - stageRect.left,
        stageY: clientY - stageRect.top,
        color: formatColorValues(pixel[0], pixel[1], pixel[2]),
      };
    },
    [canvasRef, imageLoaded, stageRef]
  );

  const drawMagnifier = useCallback(
    (centerX, centerY) => {
      const canvas = canvasRef.current;
      const magnifierCanvas = magnifierRef.current;
      if (!canvas || !magnifierCanvas) return;

      const half = Math.floor(MAGNIFIER_GRID / 2);
      const pixelSize = Math.floor(MAGNIFIER_SIZE / MAGNIFIER_GRID);
      const context = canvas.getContext('2d');
      const magnifierContext = magnifierCanvas.getContext('2d');
      const startX = centerX - half;
      const startY = centerY - half;
      const readX = Math.max(0, startX);
      const readY = Math.max(0, startY);
      const readWidth = Math.min(canvas.width, startX + MAGNIFIER_GRID) - readX;
      const readHeight = Math.min(canvas.height, startY + MAGNIFIER_GRID) - readY;

      magnifierContext.clearRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
      magnifierContext.fillStyle = '#0f172a';
      magnifierContext.fillRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);

      if (readWidth <= 0 || readHeight <= 0) return;

      const imageData = context.getImageData(readX, readY, readWidth, readHeight);

      for (let gridY = 0; gridY < MAGNIFIER_GRID; gridY += 1) {
        for (let gridX = 0; gridX < MAGNIFIER_GRID; gridX += 1) {
          const sampleX = startX + gridX;
          const sampleY = startY + gridY;

          if (sampleX < 0 || sampleY < 0 || sampleX >= canvas.width || sampleY >= canvas.height) {
            continue;
          }

          const localX = sampleX - readX;
          const localY = sampleY - readY;
          const index = (localY * readWidth + localX) * 4;
          magnifierContext.fillStyle = `rgb(${imageData.data[index]}, ${imageData.data[index + 1]}, ${imageData.data[index + 2]})`;
          magnifierContext.fillRect(gridX * pixelSize, gridY * pixelSize, pixelSize, pixelSize);
        }
      }

      const centerGridX = centerX - startX;
      const centerGridY = centerY - startY;

      if (
        centerGridX >= 0 &&
        centerGridY >= 0 &&
        centerGridX < MAGNIFIER_GRID &&
        centerGridY < MAGNIFIER_GRID
      ) {
        magnifierContext.strokeStyle = '#ffffff';
        magnifierContext.lineWidth = 2;
        magnifierContext.strokeRect(
          centerGridX * pixelSize + 0.5,
          centerGridY * pixelSize + 0.5,
          pixelSize - 1,
          pixelSize - 1
        );
      }
    },
    [canvasRef]
  );

  const getLoupePosition = useCallback(
    (stageX, stageY) => {
      const stage = stageRef.current;
      const stageWidth = stage?.clientWidth || MAGNIFIER_SIZE;
      const stageHeight = stage?.clientHeight || MAGNIFIER_SIZE;

      let left = stageX + MAGNIFIER_OFFSET;
      let top = stageY - MAGNIFIER_SIZE - MAGNIFIER_OFFSET;

      if (left + MAGNIFIER_SIZE > stageWidth) {
        left = stageX - MAGNIFIER_SIZE - MAGNIFIER_OFFSET;
      }
      if (left < 0) {
        left = Math.min(stageX + MAGNIFIER_OFFSET, Math.max(0, stageWidth - MAGNIFIER_SIZE));
      }

      if (top < 0) {
        top = stageY + MAGNIFIER_OFFSET;
      }
      if (top + MAGNIFIER_SIZE > stageHeight) {
        top = stageY - MAGNIFIER_SIZE - MAGNIFIER_OFFSET;
      }
      if (top < 0) {
        top = Math.max(0, stageHeight - MAGNIFIER_SIZE - MAGNIFIER_OFFSET);
      }

      return {
        left: Math.max(0, Math.min(left, stageWidth - MAGNIFIER_SIZE)),
        top: Math.max(0, Math.min(top, stageHeight - MAGNIFIER_SIZE)),
      };
    },
    [stageRef]
  );

  const applySample = useCallback(
    (sample, picked = false) => {
      setHoverHex(sample.color.hex);
      setCursor({
        x: sample.stageX,
        y: sample.stageY,
        loupe: getLoupePosition(sample.stageX, sample.stageY),
      });
      drawMagnifier(sample.x, sample.y);
      if (picked) onSample(sample.color, true);
      onStatusChange(
        picked
          ? t('tools.ui.imageColorStudio.picked', { hex: sample.color.hex, x: sample.x, y: sample.y })
          : t('tools.ui.imageColorStudio.hovering', { hex: sample.color.hex, x: sample.x, y: sample.y })
      );
    },
    [drawMagnifier, getLoupePosition, onSample, onStatusChange, t]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return undefined;

    const handleClick = (event) => {
      const sample = sampleAtPoint(event.clientX, event.clientY);
      if (sample) applySample(sample, true);
    };

    const handleMove = (event) => {
      const sample = sampleAtPoint(event.clientX, event.clientY);
      if (!sample) {
        setCursor(null);
        return;
      }
      applySample(sample, false);
    };

    const handleLeave = () => {
      setCursor(null);
      onStatusChange(t('tools.ui.imageColorStudio.statusReady'));
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseleave', handleLeave);
    };
  }, [applySample, canvasRef, imageLoaded, onStatusChange, sampleAtPoint, t]);

  if (!imageLoaded) return null;

  return (
    <>
      <div
        className={`image-color-loupe ${cursor ? 'is-visible' : ''}`}
        style={cursor ? { left: `${cursor.loupe.left}px`, top: `${cursor.loupe.top}px` } : undefined}
        aria-hidden="true"
      >
        <canvas ref={magnifierRef} className="image-color-loupe-canvas" width={MAGNIFIER_SIZE} height={MAGNIFIER_SIZE} />
      </div>
      {cursor ? (
        <span
          className="image-color-cursor"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            backgroundColor: hoverHex,
            boxShadow: `0 0 0 2px #fff, 0 0 0 3px rgba(15, 23, 42, 0.55), inset 0 0 0 1px ${hoverHex}`,
          }}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}

export default ColorEyedropperOverlays;
