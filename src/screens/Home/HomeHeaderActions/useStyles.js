import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => ({
  container: {
    width: 40,
    height: 40,
    backgroundColor: p.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    height: 100,
    width: 100,
    backgroundColor: p.strokeSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
}));

export default useStyles;
