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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconProps: {
    height: 70,
  },
  modal: {
    width: 100,
    backgroundColor: p.border,
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    opacity: 0.9,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  actionText: {
    ...getTextStyles(16, '400', 22, p.stroke),
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: p.strokeSecondary,
  },
}));

export default useStyles;
