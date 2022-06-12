import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => {
  const container = n({
    flex: 1,
    marginBottom: 16,
    margin: 6,
  });

  return {
    container,
    itemContainer: {
      height: 124,
      // padding: 12,
      flexDirection: 'row',
      backgroundColor: p.background,
      borderRadius: 8,
      shadowRadius: 4,
      shadowColor: 'black',
      shadowOpacity: 0.2,
      elevation: 4,
      overflow: 'hidden',
    },
    image: {
      flex: 1,
      // width: 100,
      // maxWidth: 100,
      backgroundColor: 'grey',
      borderRadius: 4,
      // marginRight: 12,
      flexGrow: 1,
    },
    content: {
      flex: 1,
    },
    title: {
      ...getTextStyles(16, '700', 20, p.stroke),
      marginBottom: 'auto',
    },
    byline: {
      ...getTextStyles(12, '400', 18, p.strokeSecondary),
      marginBottom: 4,
    },
    published: {
      ...getTextStyles(12, '400', 18, p.strokeSecondary),
    },
  };
});

export default useStyles;
