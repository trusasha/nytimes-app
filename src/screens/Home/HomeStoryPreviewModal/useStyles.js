import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => ({
  container: {
    backgroundColor: p.background,
  },
  image: {
    width: w,
    height: h / 3,
  },
}));

export default useStyles;
