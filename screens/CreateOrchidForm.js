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

const CreateOrchidForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [rating, setRating] = useState("5.0");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [bonus, setBonus] = useState("");
  const [origin, setOrigin] = useState("");
  const [parentId, setParentId] = useState("1");
  const [image, setImage] = useState(
    "https://cdn.tgdd.vn/Files/2021/07/24/1370576/hoa-lan-tim-dac-diem-y-nghia-va-cach-trong-hoa-no-dep-202107242028075526.jpg"
  );
  const createOrchid = async () => {
    if (!name || !weight || !price || !color || !bonus || !origin) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    let category = "";
    if (parentId === "1") category = "Cattleya";
    else if (parentId === "2") category = "Dendrobium";
    else if (parentId === "3") category = "Phalaenopsis";

    const newOrchid = {
      id: Math.random().toString(36).substring(2),
      name,
      weight: parseInt(weight),
      rating,
      price: parseInt(price),
      isTopOfTheWeek: false,
      image,
      color,
      bonus,
      origin,
      category,
    };

    try {
      const response = await axios.get(
        `https://670dca82073307b4ee4476f2.mockapi.io/api/orchid/${parentId}`
      );

      if (response.data && response.data.items) {
        const updatedItems = [...response.data.items, newOrchid];

        await axios.put(
          `https://670dca82073307b4ee4476f2.mockapi.io/api/orchid/${parentId}`,
          {
            ...response.data,
            items: updatedItems,
          }
        );

        onAdd(newOrchid);
        Alert.alert("Success", "Orchid added successfully!");
      }
    } catch (error) {
      console.error("Failed to add orchid:", error);
      Alert.alert("Error", "Failed to add orchid. Please try again.");
    }
  };

  return (
    <View style={twrnc`p-2 bg-white rounded-lg shadow-md`}>
      <Text style={twrnc`text-lg font-bold mb-4`}>Add New Orchid</Text>

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
        selectedValue={parentId}
        style={twrnc`border mb-2`}
        onValueChange={(itemValue) => setParentId(itemValue)}
      >
        <Picker.Item label="Cattleya" value="1" />
        <Picker.Item label="Dendrobium" value="2" />
        <Picker.Item label="Phalaenopsis" value="3" />
      </Picker>

      <View style={twrnc`flex-row justify-between `}>
        <Button title="Create Orchid" onPress={createOrchid} />
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

export default CreateOrchidForm;
