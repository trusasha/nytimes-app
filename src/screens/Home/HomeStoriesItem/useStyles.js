import getTextStyles from 'helpers/getTextStyles';
import newUseStyles from 'hooks/newUseStyles';

const useStyles = newUseStyles(({ p, w, h, l, n, i }) => {
  const container = n({
    flex: 1,
    margin: 0.5,
  });

  return {
    container,
    itemContainer: {
      height: 124,
      flexDirection: 'row',
      backgroundColor: p.background,
      shadowRadius: 4,
      shadowColor: 'black',
      shadowOpacity: 0.2,
      elevation: 4,
      overflow: 'hidden',
    },
    image: {
      flex: 1,
      backgroundColor: 'grey',
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
    modalContainer: {
      paddingTop: i.top,
      backgroundColor: p.background,
    },
    header: {
      backgroundColor: p.background,
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
      position: 'absolute',
      left: 12,
      zIndex: 10,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    backIconProps: {
      width: 20,
      height: 20,
      fill: p.stroke,
    },
    headerTitle: {
      paddingHorizontal: 48,
      ...getTextStyles(14, '700', 22, p.stroke),
    },
    previewTitle: {
      paddingHorizontal: 12,
      ...getTextStyles(14, '700', 22, p.stroke),
    },
    actionModal: {
      backgroundColor: 'white',
      borderRadius: 12,
      opacity: 0.9,
      overflow: 'hidden',
    },
    actionButton: {
      marginTop: -1,
      paddingHorizontal: 20,
      paddingVertical: 4,
      borderTopColor: p.border,
      borderTopWidth: 1,
    },
    actionText: {
      ...getTextStyles(16, '400', 22, p.stroke),
    },
  };
});

export default useStyles;
