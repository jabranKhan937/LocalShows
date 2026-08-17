import React, { memo } from 'react'
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'
import { colors } from '../../blocks/utilities/src/Colors'

type Props = {
    value: string;
    onChange: (e: string) => void;
    error?: any;
    inputProps?: TextInputProps;
    label?: string;
}

const CustomInput: React.FC<Props> = ({ onChange, value, children, error, inputProps, label }) => {
    return (
        <View>
            <Text style={[styles.text, styles.textInputLabel]}>{label}</Text>
            <TextInput
                testID="txtInputName"
                placeholder="Enter your name"
                placeholderTextColor="#CBD5E1"
                style={[styles.textInputSty, styles.selectorSty]}
                value={value}
                onChangeText={onChange}
                {...inputProps}
            />
            <Text style={[styles.text, styles.errorText]}>
                {error}
            </Text>
        </View>
    )
}

export default memo(CustomInput)

const styles = StyleSheet.create({
    textInputLabel: {
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    textInputSty: {
        width: "100%",
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#C5C5FF",
        color: colors(false).text,
        height: 50,
    },
    selectorSty: {
        height: 50,
        justifyContent: "center",
        backgroundColor: '#FFF',
        fontFamily: "OpenSans"
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        paddingTop: 2,
    },
    text: {
        fontFamily: "OpenSans",
        alignSelf: "flex-start",
        color: colors(false).text,
    },
    textInput: {
        width: "100%",
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: "#C5C5FF",
        color: colors(false).text,
        height: 50,
    },
})