import React from 'react';
import FastImage, { FastImageProps } from 'react-native-fast-image';

/**
 * Safe wrapper for FastImage that filters out props that cause crashes in RN 0.75.4
 * Removes onPress, onClick, and other touch-related props that FastImage doesn't support
 */
const SafeFastImage: React.FC<FastImageProps> & {
  priority: typeof FastImage.priority;
  resizeMode: typeof FastImage.resizeMode;
  cacheControl: typeof FastImage.cacheControl;
  preload: typeof FastImage.preload;
  clearMemoryCache: typeof FastImage.clearMemoryCache;
  clearDiskCache: typeof FastImage.clearDiskCache;
} = (props) => {
  // Filter out props that FastImage doesn't support
  const {
    onPress,
    onClick,
    onLongPress,
    onPressIn,
    onPressOut,
    ...safeProps
  } = props as any;

  return <FastImage {...safeProps} />;
};

// Copy static properties from FastImage
SafeFastImage.priority = FastImage.priority;
SafeFastImage.resizeMode = FastImage.resizeMode;
SafeFastImage.cacheControl = FastImage.cacheControl;
SafeFastImage.preload = FastImage.preload;
SafeFastImage.clearMemoryCache = FastImage.clearMemoryCache;
SafeFastImage.clearDiskCache = FastImage.clearDiskCache;

export default SafeFastImage;
