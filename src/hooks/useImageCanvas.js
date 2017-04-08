import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImageDropZone } from './useImageDropZone';

export function useImageCanvas({ onImageLoaded } = {}) {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);
  const stageRef = useRef(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageName, setImageName] = useState('');
  const [status, setStatus] = useState('');
  const [imageRevision, setImageRevision] = useState(0);

  useEffect(() => {
    setStatus(t('tools.ui.imageColorStudio.statusInitial'));
  }, [t]);

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const drawImageToCanvas = useCallback((image) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const maxWidth = parent?.clientWidth || 720;
    const maxHeight = parent?.clientHeight || Math.round(window.innerHeight * 0.8);
    const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    canvas.style.width = '';
    canvas.style.height = '';

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    setImageLoaded(true);
  }, []);

  const loadImageFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) {
        setStatus(t('tools.ui.imageColorStudio.invalidImageType'));
        return;
      }

      revokeObjectUrl();
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;

      const image = new Image();
      image.onload = () => {
        imageRef.current = image;
        drawImageToCanvas(image);
        setImageName(file.name || t('tools.ui.imageColorStudio.pastedImage'));
        setImageRevision((revision) => revision + 1);
        setStatus(t('tools.ui.imageColorStudio.statusReady'));
        onImageLoaded?.(image);
      };
      image.onerror = () => {
        setStatus(t('tools.ui.imageColorStudio.loadError'));
        setImageLoaded(false);
      };
      image.src = objectUrl;
    },
    [drawImageToCanvas, onImageLoaded, revokeObjectUrl, t]
  );

  const { isDragging, dropZoneProps } = useImageDropZone(loadImageFile);

  const clearImage = useCallback(() => {
    revokeObjectUrl();
    imageRef.current = null;
    setImageLoaded(false);
    setImageName('');
    setImageRevision(0);

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    setStatus(t('tools.ui.imageColorStudio.cleared'));
  }, [revokeObjectUrl, t]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) loadImageFile(file);
      event.target.value = '';
    },
    [loadImageFile]
  );

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) loadImageFile(file);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [loadImageFile]);

  useEffect(() => () => revokeObjectUrl(), [revokeObjectUrl]);

  return {
    canvasRef,
    imageRef,
    fileInputRef,
    stageRef,
    imageLoaded,
    imageName,
    status,
    imageRevision,
    isDragging,
    dropZoneProps,
    setStatus,
    loadImageFile,
    clearImage,
    openFilePicker,
    handleFileInputChange,
  };
}
