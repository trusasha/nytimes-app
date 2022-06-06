import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(
  (
    { p, w, h, l, n, i },
    /** @type {{childrenLayout: import('react-native').LayoutRectangle, offset: number}} */
    { childrenLayout, offset },
  ) => {
    const containerTop = (childrenLayout?.height || 0) + (offset || 8);

    return {
      container: {
        position: 'absolute',
        top: containerTop,
        alignSelf: 'center',
        zIndex: 1,
      },
      backdrop: {
        position: 'absolute',
        left: -w,
        width: w * 2,
        height: h,
      },
    };
  },
);

export default useStyles;
