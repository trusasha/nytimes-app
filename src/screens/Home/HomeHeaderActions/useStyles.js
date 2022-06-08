import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => ({
  container: {
    width: 30,
    height: 30,
    backgroundColor: p.strokeSecondary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    height: 100,
    width: 100,
    backgroundColor: p.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
}));

export default useStyles;
