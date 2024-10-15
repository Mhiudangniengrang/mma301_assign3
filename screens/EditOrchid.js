import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import twrnc from "twrnc";

const EditOrchid = ({ route }) => {
  const { orchid } = route.params;
  const [name, setName] = useState(orchid.name);
  const [image, setImage] = useState(orchid.image);
  const navigation = useNavigation();

  const updateOrchid = async () => {
    try {
      // Use id instead of name for the PUT request
      await axios.put(
        `https://66fae8018583ac93b40a55e4.mockapi.io/peMMa301/${orchid.id}`,
        {
          name,
          image,
        }
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={twrnc`p-4`}>
      <Text style={twrnc`font-bold text-xl mb-4`}>Edit Orchid</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={twrnc`border p-2 mb-4`}
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={twrnc`border p-2 mb-4`}
      />
      <Button title="Update" onPress={updateOrchid} />
    </View>
  );
};

export default EditOrchid;
