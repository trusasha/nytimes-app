import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, n }) => {
  return {
    container: {
      backgroundColor: p.background,
      flex: 1,
      padding: 16,
    },
  };
});

export default useStyles;
