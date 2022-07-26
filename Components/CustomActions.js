import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewPropTypes,
} from "react-native";
// Image, Audio and Geolocation APIs
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import "firebase/firestore";
import firebase from "firebase";

export default function CustomActions() {
  // Storing image information
  const [img, setImg] = useState(null);
  const [location, setLocation] = useState(null);

  //Pick an image from device. Called in Permissions view
  const pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      }).catch((error) => cpnsole.log(error));

      if (!result.canceled) {
        setImg(result);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.MEDIA_LIBRARY
    );

    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      }).catch((error) => console.log(error));

      if (!result.canceled) {
        setImg(result);
      }
    }
  };
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    try {
      if (status === "granted") {
        let result = await Location.getCurrentPositionAsync({}).catch((error) =>
          console.log(error)
        );

        if (result) {
          console.log(result);
          onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onActionPress = () => {
    const options = [
      "Choose from library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return pickImage();
          case 1:
            console.log("user wants to take a photo");
            return takePhoto();
          case 2:
            console.log("user wants to get their location");
            return getLocation();
          default:
        }
      }
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container]}
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Here you can choose to send an image or your location."
      onPress={onActionPress}
    >
      <View style={styles.wrapper}>
        <Text style={styles.iconText}> + </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: 'center',
  
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomActions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  renderIcon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style,
};
