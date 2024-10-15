import React, { useState } from "react";
import { View, TextInput, Button, Text, Picker } from "react-native"; // Import Picker
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import twrnc from "twrnc";

const CreateOrchid = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Cattleya"); // Default category
  const navigation = useNavigation();

  const createOrchid = async () => {
    try {
      // Include the selected category in the payload
      await axios.post("https://66fae8018583ac93b40a55e4.mockapi.io/peMMa301", {
        name,
        image,
        category,
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={twrnc`p-4`}>
      <Text style={twrnc`font-bold text-xl mb-4`}>Create New Orchid</Text>
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

      <Text style={twrnc`font-bold text-lg mb-2`}>Select Category</Text>

      {/* Picker for category selection */}
      <Picker
        selectedValue={category}
        style={twrnc`border p-2 mb-4`}
        onValueChange={(itemValue) => setCategory(itemValue)} // Update selected category
      >
        <Picker.Item label="Cattleya" value="Cattleya" />
        <Picker.Item label="Dendrobium" value="Dendrobium" />
        <Picker.Item label="Phalaenopsis" value="Phalaenopsis" />
      </Picker>

      <Button title="Create" onPress={createOrchid} />
    </View>
  );
};

export default CreateOrchid;
