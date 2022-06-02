import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(
  (
    { p, w, h, l, n, i },
    /** @type {{textStyle: import('react-native').TextStyle, disabled: boolean}} */
    { textStyle, disabled },
  ) => ({
    container: {
      backgroundColor: p.primaryColor,
      paddingHorizontal: 16,
      height: 48,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: p.primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
      ...(disabled && {
        opacity: 0.5,
      }),
    },
    text: {
      ...getTextStyles(16, '700', 24, p.white),
      ...textStyle,
    },
  }),
);

export default useStyles;
