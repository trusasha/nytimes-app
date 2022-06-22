import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => {
  return {
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100,
      shadowRadius: 8,
      shadowOpacity: 0.2,
      shadowColor: 'black',
    },
    backdrop: {
      position: 'absolute',
      width: w,
      height: h,
    },
  };
});

export default useStyles;
