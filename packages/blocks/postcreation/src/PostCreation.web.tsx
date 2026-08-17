import React from 'react';
// Customizable Area Start
import {
  ScrollView,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

import scale, { verticalScale } from '../../../components/src/Scale';

//@ts-ignore
// import { Dropdown } from "react-native-material-dropdown";
import PostCreationController from './PostCreationCommonController';
import { edit } from '../src/assets';
import Scale from '../../../components/src/Scale';
import Select from 'react-select';
// Customizable Area End

export interface Props {
  navigation: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class PostCreation extends PostCreationController {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView>
          {/* Customizable Area Start */}
          <TouchableOpacity
            testID={'textProductImageUpload'}
            onPress={this.chooseImage}
            style={{ marginTop: 10 }}
          >
            {this.state.image ? (
              <>
                <Image
                  style={styles.imageStyle}
                  // value={this.state.image.data}
                  source={{ uri: this.state.image }}
                />
              </>
            ) : this.state.profileImageData ? (
              <Image
                style={styles.imageStyle}
                // value={this.state.image.data}
                source={{ uri: this.state.profileImageData.data }}
              />
            ) : (
              ''
            )}
            <Image source={edit} style={styles.editIcon} />
          </TouchableOpacity>

          <Select
            value={this.state.selectedCategory}
            onChange={this.handleCatChangeChange}
            options={this.state.allCategories}
          />

          <TextInput
            placeholder="Product Name"
            testID={'textProductName'}
            style={[styles.inputTextField1]}
            value={this.state.name}
            {...this.txtInputProductNameProps} //Merge Engine::From BDS - {...this.testIDProps}
          />
          <TextInput
            testID={'textProductDiscripation'}
            placeholder="Description"
            multiline={true}
            numberOfLines={10}
            value={this.state.description}
            {...this.txtInputProductDiscripationProps}
            style={[styles.inputTextField]}
          />

          <TextInput
            testID={'textProductPrice'}
            placeholder="Price"
            keyboardType={'numeric'}
            style={[styles.inputTextField1]}
            value={this.state.price}
            {...this.txtInputProductPriceProps}
          />
          {!this.state.id ? (
            <TouchableOpacity
              testID={'clickCreatePostButton'}
              style={[styles.buttonStyle]}
              onPress={() => this.createPostCreation()}
            >
              <Text style={styles.buttonText}>Create Post</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              testID={'clickUpadtePostButton'}
              style={[styles.buttonStyle]}
              onPress={() => this.updateCreatePostData(this.state.id)}
            >
              <Text style={styles.buttonText}>Update Post</Text>
            </TouchableOpacity>
          )}
          {/* Customizable Area End */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    alignSelf: 'center',
    width: '90%',
  },
  inputTextField: {
    height: verticalScale(80),
    borderColor: 'grey',
    borderWidth: 1,
    color: 'black',
    fontSize: scale(16.7),
    borderBottomWidth: 0.3,
    margin: scale(3),
    padding: 10,
    marginTop: verticalScale(5),
  },

  inputTextField1: {
    height: verticalScale(50),
    borderColor: 'grey',
    borderWidth: 1,
    color: 'black',
    fontSize: scale(16.7),
    borderBottomWidth: 0.3,
    paddingLeft: 10,
    paddingRight: 10,
    margin: scale(3),
  },

  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#366ef9',
    height: scale(50),
    marginTop: verticalScale(20),
  },
  imageStyle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: 1,
    borderColor: 'black',
    marginTop: verticalScale(5),
    marginBottom: verticalScale(25),
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
  },
  editIcon: {
    position: 'absolute',
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    top: verticalScale(90),
    left: Scale(90),
  },
});
// Customizable Area End
