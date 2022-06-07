import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => ({
  container: {
    position: 'absolute',
    width: w,
    height: h,
    backgroundColor: p.background,
  },
  header: {
    padding: 12,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: p.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: p.border,
    position: 'absolute',
    left: 12,
  },
  title: {
    ...getTextStyles(14, '700', 22, p.stroke),
  },
}));

export default useStyles;