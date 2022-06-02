import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(
  (
    { p, w, h, l, n, i },
    /**
     * @type {{
     * containerStyle: import('react-native').ViewStyle,
     * textStyle: import('react-native').TextStyle,
     * labelStyle: import('react-native').TextStyle
     * }}
     * */
    { containerStyle, textStyle, labelStyle },
  ) => ({
    container: {
      backgroundColor: p.secondaryBackground,
      borderRadius: 8,
      minWidth: 100,
      paddingHorizontal: 16,
      paddingVertical: 0,
      borderWidth: 1,
      borderColor: p.border,
      ...containerStyle,
    },
    label: {
      position: 'absolute',
      top: -24,
      right: 8,
      ...getTextStyles(12, '400', 24, p.stroke),
      ...labelStyle,
    },
    textInput: {
      ...getTextStyles(14, '400', 24, 'red'),
      ...textStyle,
    },
  }),
);

export default useStyles;
