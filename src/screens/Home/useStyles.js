import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, n }) => {
  return {
    container: {
      backgroundColor: p.primaryColor,
      flex: 1,
    },
    contentContainer: {
      padding: 12,
    },
  };
});

export default useStyles;
