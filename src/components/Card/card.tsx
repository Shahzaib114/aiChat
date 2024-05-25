import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import FONTS from '../../theme/FONTS';
import themeColors from '../../theme/colors';
import Vector from '../../../assets/svgs/vector';
import { SvgXml } from 'react-native-svg';

const CustomCard = ({ description, text, smallDesc, save, isCircleActive, purchased, handleCardPress }: any) => {

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={[styles.card, { alignItems: 'flex-start', }]}
    >
      <View style={styles.cardinnerview}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              style={[
                styles.circle,
                { backgroundColor: isCircleActive ? '#02A67E' : 'grey', },
              ]}
            />
            <Text style={styles.headerText}>{text.replace('(EVA: Your AI Assistant)', '') }</Text>
          </View>
          <View>
            <Text style={styles.description}>
              {description}
              <Text style={styles.smallDescription}>
                {smallDesc}
              </Text>
            </Text>
          </View>
        </View>
        {save.includes('yearly') &&
          <View style={styles.saveView}>
            <Text style={styles.saveTxt}>
              80% off
            </Text>
          </View>
        }
      </View>
      {purchased ?
        <View style={[styles.saveView, { backgroundColor: themeColors.primary }]}>
          <Text style={styles.saveTxt}>
            Active
          </Text>
        </View>
        :
        <View style={styles.fourthview5}>
          <SvgXml xml={Vector} width="100%" height="100%" style={{ alignSelf: 'flex-start' }} />
        </View>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: responsiveFontSize(1.8),
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: themeColors.blackLight,
    borderRadius: 10,
    borderColor: themeColors.dark,
    borderWidth: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveView: {
    backgroundColor: themeColors.blue,
    alignSelf: 'baseline',
    marginLeft: 4,
    padding: responsiveFontSize(0.5),
    borderRadius: responsiveFontSize(1.5),
    justifyContent: 'center',
    alignItems: 'center'
  },
  fourthview5: {
    width: responsiveScreenWidth(5),
    height: responsiveScreenHeight(5),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 5
  },

  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  description: {
    fontSize: responsiveScreenFontSize(4),
    color: themeColors.white,
    fontFamily: FONTS.Manrope_ExtraBold
  },
  saveTxt: {
    fontSize: responsiveScreenFontSize(1.5),
    color: themeColors.black,
    fontFamily: FONTS.Manrope_Regular,
    paddingHorizontal: 5
  },
  smallDescription: {
    fontSize: responsiveScreenFontSize(2),
    color: themeColors.white,
    fontFamily: FONTS.Manrope_SemiBold
  },
  headerText: {
    fontSize: responsiveScreenFontSize(2),
    color: themeColors.white,
    fontFamily: FONTS.Manrope_Light
  },
  cardinnerview: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default CustomCard;
