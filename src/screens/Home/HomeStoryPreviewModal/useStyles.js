import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => ({
  container: {
    backgroundColor: p.background,
    height: h / 3 + 40,
  },
  image: {
    width: w,
    height: h / 3,
  },
}));

export default useStyles;
