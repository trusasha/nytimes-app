import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => ({
  container: {
    backgroundColor: p.background,
    width: w,
  },
  image: {
    width: w,
    height: 350,
    backgroundColor: p.border,
  },
}));

export default useStyles;
