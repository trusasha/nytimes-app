import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(
  (
    { p, w, h, l, n, i },
    /** @type {{modalContainerStyle: import('react-native').ViewStyle, backdropStyles: import('react-native').ViewStyle}} */
    { modalContainerStyle, backdropStyles },
  ) => ({
    container: {
      zIndex: 10,
      position: 'absolute',
      width: w,
      borderRadius: 24,
      overflow: 'hidden',
      ...modalContainerStyle,
    },
    backdrop: {
      position: 'absolute',
      width: w,
      height: h,
      backgroundColor: 'black',
      ...backdropStyles,
    },
  }),
);

export default useStyles;
