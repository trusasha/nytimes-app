import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => ({
  container: {
    zIndex: 10,
    position: 'absolute',
    paddingTop: 12 + i.top,
    width: w,
    backgroundColor: p.background,
    borderRadius: 24,
    overflow: 'hidden',
  },
  backdrop: {
    position: 'absolute',
    width: w,
    height: h,
    backgroundColor: 'black',
  },
}));

export default useStyles;
