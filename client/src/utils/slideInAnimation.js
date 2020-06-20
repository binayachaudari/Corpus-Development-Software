export const slideInAnimation = (animationDelay) => ({
  className: `slidein__animation`,
  style: {
    animationDelay: `${animationDelay}s`,
  },
});

export const slideInAnimationWithIndex = (index, animationDelay, initialDelay = 0.4) => ({
  className: `slidein__animation`,
  style: {
    animationDelay: `${initialDelay + index * animationDelay}s`,
  },
});
