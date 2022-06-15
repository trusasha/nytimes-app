import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(
  (
    { p, w, h, l, n, i },
    /** @type {{modalContainerStyle: import('react-native').ViewStyle}} */
    { modalContainerStyle },
  ) => ({
    container: {
      backgroundColor: 'red',
      zIndex: 10,
      position: 'absolute',
      width: w * 0.8,
      borderRadius: 24,
      overflow: 'hidden',
      ...modalContainerStyle,
    },
    backdrop: {
      position: 'absolute',
      width: w,
      height: h,
      backgroundColor: 'black',
    },
    actionModal: {
      position: 'absolute',
      zIndex: 9,
      top: 0,
    },
  }),
);

export default useStyles;
