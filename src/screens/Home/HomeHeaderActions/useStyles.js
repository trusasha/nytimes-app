import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => ({
  container: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    ...getTextStyles(16, '700', 22, p.stroke),
    marginRight: 'auto',
  },
  button: {
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
