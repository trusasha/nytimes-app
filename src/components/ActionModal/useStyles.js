import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => {
  return {
    container: {
      position: 'absolute',
      top: 0,
      alignSelf: 'center',
      zIndex: 1,
      shadowRadius: 8,
      shadowOpacity: 0.2,
      shadowColor: 'black',
    },
    backdrop: {
      position: 'absolute',
      left: -w,
      width: w * 2,
      height: h,
    },
  };
});

export default useStyles;
