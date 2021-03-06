import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, n, i }) => {
  return {
    container: {
      backgroundColor: p.background,
      flex: 1,
    },
    contentContainer: {
      paddingTop: 12 + i.top,
    },
  };
});

export default useStyles;
