import React, { useState } from 'react'
import { Modal, StyleSheet, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../blocks/utilities/src/Colors'
import { leftArrow } from '../../blocks/email-account-registration/src/assets';

interface Props {
    labelField: string;
    valueField: string;
    data: any[];
    onSelect: (e: any) => void;
    selected: string;
    label: string;
    error?: any;
}

const CustomDropdown: React.FC<Props> = ({ data, label, error, labelField, onSelect, selected, valueField }) => {
    const [isVisible, setIsVisible] = useState(false)
    const renderCountryiOSDropdown = () => {
        return (
            <TouchableOpacity
                testID="btnCountrySelect"
                style={[styles.textInputSty, styles.selectorSty]}
                onPress={() => setIsVisible(true)} >
                <Text style={[styles.selectedText]}>
                    {selected}
                </Text>
                <Image source={leftArrow} style={styles.downArrowSty} />
            </TouchableOpacity>
        )
    }

    const renderCountryAndroidDropdown = () => {
        return (
            <View style={[styles.textInputSty, styles.selectorSty]}>
                <Picker
                    testID="countryPicker"
                    // style={[styles.textInputSty, styles.selectorSty]}
                    itemStyle={[styles.selectedText]}
                    selectedValue={selected}
                    dropdownIconColor={"#fff"}
                    dropdownIconRippleColor={"#fff"}
                    onValueChange={onSelect}>

                    <Picker.Item
                        label={"Select a country"} value={""} />
                    {data.map(
                        (val: any, index: number) => (
                            <Picker.Item key={index} value={val[valueField]} label={val[labelField]} />
                        )
                    )}
                </Picker>
                <Image source={leftArrow} style={styles.downArrowSty} />
            </View>
        )
    }
    return (
        <View>
            <Text style={[styles.textInputLabel]}>{label}</Text>
            {Platform.OS == 'ios'?renderCountryiOSDropdown():renderCountryAndroidDropdown()}
            {error && <Text style={styles.errorTextMsg}>
                {error}
            </Text>}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible} >
                <TouchableWithoutFeedback testID="hideCountryModal" onPress={() => setIsVisible(false)}>
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
                                <Picker
                                    testID="countryPickerModal"
                                    selectedValue={selected}
                                    onValueChange={(value)=>{
                                        onSelect(value)
                                        setIsVisible(false)
                                        }} >
                                    {data.map(
                                        (val: any, index: number) => (
                                            <Picker.Item key={index} value={val[valueField]} label={val[labelField]} />
                                        )
                                    )}
                                </Picker>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

export default CustomDropdown

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#33415580",
    },
    modalView: {
        height: 320,
        backgroundColor: "white",
        borderTopEndRadius: 20,
        justifyContent: 'space-between',
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 100,
    },
    labelTxt: {
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        fontFamily: "OpenSans",
        alignSelf: "flex-start"
    },
    errorTextMsg: {
        color: "red",
        fontSize: 13,
        paddingTop: 2,
        fontFamily: "OpenSans",
        alignSelf: "flex-start"
    },
    textInputLabelSty: {
        fontWeight: "bold",
        marginBottom: 5,
    },
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
    downArrowSty: {
        position: "absolute",
        right: 15,
        marginRight: 5,
        width: 8,
        transform: [{ rotate: "-90deg" }],
        resizeMode: "contain",
        tintColor: "#4949EE"
    },
    selectedText: {
        fontFamily: "OpenSans",
        alignSelf: "flex-start",
        color: colors(false).text
    }
})