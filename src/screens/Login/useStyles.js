import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  input: {
    marginBottom: 24,
  },
}));

export default useStyles;
