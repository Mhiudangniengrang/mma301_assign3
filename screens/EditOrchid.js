import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import twrnc from "twrnc";
import { Picker } from "@react-native-picker/picker";

const EditOrchid = ({ orchid, onEdit, onCancel }) => {
  const [name, setName] = useState(orchid.name || "");
  const [weight, setWeight] = useState(orchid.weight.toString());
  const [rating, setRating] = useState(orchid.rating || "5.0");
  const [price, setPrice] = useState(orchid.price.toString());
  const [color, setColor] = useState(orchid.color || "");
  const [bonus, setBonus] = useState(orchid.bonus || "");
  const [origin, setOrigin] = useState(orchid.origin || "");
  const [image, setImage] = useState(orchid.image || "");
  const [category, setCategory] = useState(orchid.parentId.toString());

  const handleEditOrchid = async () => {
    const updatedOrchid = {
      ...orchid,
      name,
      weight: parseInt(weight),
      rating,
      price: parseInt(price),
      color,
      bonus,
      origin,
      image,
      category:
        category === "1"
          ? "Cattleya"
          : category === "2"
          ? "Dendrobium"
          : "Phalaenopsis",
    };

    try {
      const response = await axios.put(
        `https://670dca82073307b4ee4476f2.mockapi.io/api/orchid/${orchid.parentId}`,
        { ...orchid, ...updatedOrchid }
      );
      onEdit(updatedOrchid);
      Alert.alert("Success", "Orchid updated successfully!");
    } catch (error) {
      console.error("Failed to edit orchid:", error);
      Alert.alert("Error", "Failed to edit orchid.");
    }
  };

  return (
    <View style={twrnc`p-2 bg-white rounded-lg shadow-md`}>
      <Text style={twrnc`text-lg font-bold mb-4`}>Edit Orchid</Text>

      <TextInput
        style={twrnc`border p-2 mb-2`}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={twrnc`border p-2 mb-2`}
        placeholder="Weight"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={twrnc`border p-2 mb-2`}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        style={twrnc`border p-2 mb-2`}
        placeholder="Color"
        value={color}
        onChangeText={setColor}
      />
      <TextInput
        style={twrnc`border p-2 mb-2`}
        placeholder="Bonus"
        value={bonus}
        onChangeText={setBonus}
      />
      <TextInput
        style={twrnc`border p-2 mb-2`}
        placeholder="Origin"
        value={origin}
        onChangeText={setOrigin}
      />
      <TextInput
        style={twrnc`border p-2 mb-2`}
        placeholder="Image"
        value={image}
        onChangeText={setImage}
      />

      <Text style={twrnc`mb-2`}>Select Orchid Type:</Text>
      <Picker
        selectedValue={category}
        style={twrnc`border mb-2`}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Cattleya" value="1" />
        <Picker.Item label="Dendrobium" value="2" />
        <Picker.Item label="Phalaenopsis" value="3" />
      </Picker>

      <View style={twrnc`flex-row justify-between `}>
        <Button title="Edit Orchid" onPress={handleEditOrchid} />
        <TouchableOpacity
          onPress={onCancel}
          style={twrnc`ml-4 bg-red-500 p-2 rounded-lg`}
        >
          <Text style={twrnc`text-white text-center`}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditOrchid;
