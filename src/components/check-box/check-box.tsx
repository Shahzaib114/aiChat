import {Pressable, View} from 'react-native';
import themeColors from "../../theme/colors.ts";


const CheckBox = ({checked, onChange}:{
    checked: boolean;
    onChange: (checked: boolean) => void;
}) => {
    console.log(checked)
    return (
        <Pressable
            onPress={() => onChange(!checked)}
            style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: checked ? themeColors.primary  : 'transparent',
                borderWidth: 1,
                borderColor: themeColors.dark,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        />


    );
};

export default CheckBox;