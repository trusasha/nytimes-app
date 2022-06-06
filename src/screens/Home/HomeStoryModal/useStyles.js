import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => ({
  container: {
    padding: 12,
    paddingBottom: 120 + i.bottom,
  },
  title: {
    ...getTextStyles(16, '700', 22, p.stroke),
  },
  image: {
    resizeMode: 'cover',
    width: w,
    height: h / 3,
    marginLeft: -12,
    backgroundColor: p.border,
    marginBottom: 12,
  },
  byline: {
    ...getTextStyles(12, '400', 18, p.strokeSecondary),
    marginBottom: 12,
  },
  abstract: {
    ...getTextStyles(14, '400', 22, p.stroke),
    marginBottom: 12,
  },
  sectionContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  section: {
    ...getTextStyles(12, '400', 22, p.strokeSecondary),
    backgroundColor: p.border,
    paddingHorizontal: 12,
    borderRadius: 40,
    marginRight: 12,
  },
}));

export default useStyles;
