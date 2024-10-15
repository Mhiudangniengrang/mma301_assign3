import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import twrnc from "twrnc";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const HomeScreen = ({ route }) => {
  const [orchids, setOrchids] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrchid, setCurrentOrchid] = useState({ name: "", image: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        const savedFavorites = await AsyncStorage.getItem("favoriteOrchids");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      };
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    if (route.params && route.params.cleared) {
      setFavorites([]);
    }
  }, [route.params]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://66fae8018583ac93b40a55e4.mockapi.io/peMMa301"
      );

      if (response.data && Array.isArray(response.data)) {
        const flattenedData = response.data.flatMap((category) =>
          category.items
            ? category.items.map((item) => ({
                ...item,
                category: category.name,
              }))
            : []
        );
        setOrchids(flattenedData);
      } else {
        console.error("Unexpected data structure", response.data);
        setOrchids([]);
      }

      const savedFavorites = await AsyncStorage.getItem("favoriteOrchids");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async (orchid) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.name === orchid.name)) {
      updatedFavorites = favorites.filter((fav) => fav.name !== orchid.name);
    } else {
      updatedFavorites = [...favorites, orchid];
    }
    setFavorites(updatedFavorites);

    try {
      await AsyncStorage.setItem(
        "favoriteOrchids",
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteOrchid = async (name) => {
    try {
      const updatedOrchids = orchids.filter((orchid) => orchid.name !== name);
      setOrchids(updatedOrchids);

      // Optionally, update the API if needed, e.g., using axios
    } catch (error) {
      console.error("Error deleting orchid:", error);
    }
  };

  const confirmDelete = (orchid) => {
    Alert.alert(
      "Delete Orchid",
      `Are you sure you want to delete ${orchid.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteOrchid(orchid.name),
        },
      ]
    );
  };

  const handleAddOrEdit = async () => {
    if (!currentOrchid.name.trim() || !currentOrchid.image.trim()) {
      setError("Both name and image URL are required.");
      return;
    }

    if (!selectedCategory) {
      setError("Category is required.");
      return;
    }

    try {
      const orchidData = {
        ...currentOrchid,
        category: selectedCategory,
      };

      if (isEditing) {
        const updatedOrchids = orchids.map((orchid) => {
          if (orchid.category === selectedCategory) {
            const updatedItems = orchid.items.map((item) =>
              item.name === currentOrchid.name ? orchidData : item
            );
            return { ...orchid, items: updatedItems };
          }
          return orchid;
        });
        setOrchids(updatedOrchids);

        await axios.put(
          `https://66fae8018583ac93b40a55e4.mockapi.io/peMMa301/${currentOrchid.id}`,
          orchidData
        );
      } else {
        const updatedOrchids = orchids.map((orchid) => {
          if (orchid.name === selectedCategory) {
            return { ...orchid, items: [...orchid.items, orchidData] };
          }
          return orchid;
        });

        setOrchids(updatedOrchids);

        await axios.post(
          "https://66fae8018583ac93b40a55e4.mockapi.io/peMMa301",
          orchidData
        );
      }

      setModalVisible(false);
      setCurrentOrchid({ name: "", image: "" });
      setSelectedCategory("");
      setIsEditing(false);
      setError("");
    } catch (error) {
      console.error("Error updating orchid:", error);
    }
  };

  const openEditModal = (orchid) => {
    setCurrentOrchid(orchid);
    setSelectedCategory(orchid.category);
    setIsEditing(true);
    setModalVisible(true);
    setError("");
  };

  const renderOrchid = ({ item }) => (
    <View
      style={twrnc`my-2 p-4 bg-white rounded-lg shadow-md flex-row items-center`}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Detail", { orchid: item })}
        style={twrnc`flex-1 flex-row items-center`}
      >
        <Image
          source={{ uri: item.image }}
          style={twrnc`w-16 h-16 rounded-full`}
        />
        <View style={twrnc`ml-4`}>
          <Text style={twrnc`font-bold text-lg text-gray-800`}>
            {item.name || "Unnamed Orchid"}
          </Text>
          {item.category ? (
            <Text style={twrnc`text-sm text-gray-500`}>{item.category}</Text>
          ) : (
            <Text style={twrnc`text-sm text-gray-500`}>No Category</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => toggleFavorite(item)}
        style={twrnc`ml-4`}
      >
        <FontAwesome
          name={
            favorites.some((fav) => fav.name === item.name)
              ? "heart"
              : "heart-o"
          }
          size={24}
          color={
            favorites.some((fav) => fav.name === item.name) ? "red" : "gray"
          }
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => openEditModal(item)} style={twrnc`ml-4`}>
        <FontAwesome name="edit" size={24} color="blue" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => confirmDelete(item)} style={twrnc`ml-4`}>
        <FontAwesome name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={twrnc`flex-1 bg-gray-100`}>
      <FlatList
        data={orchids}
        keyExtractor={(item) => item.name}
        renderItem={renderOrchid}
        contentContainerStyle={twrnc`p-4`}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={twrnc`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={twrnc`w-4/5 p-6 bg-white rounded-lg`}>
            <Text style={twrnc`font-bold text-xl mb-4`}>
              {isEditing ? "Edit Orchid" : "Create New Orchid"}
            </Text>

            {error ? (
              <Text style={twrnc`text-red-500 mb-4`}>{error}</Text>
            ) : null}

            <TextInput
              placeholder="Name"
              value={currentOrchid.name}
              onChangeText={(text) =>
                setCurrentOrchid((prev) => ({ ...prev, name: text }))
              }
              style={twrnc`border border-gray-300 p-2 rounded mb-4`}
            />
            <TextInput
              placeholder="Image URL"
              value={currentOrchid.image}
              onChangeText={(text) =>
                setCurrentOrchid((prev) => ({ ...prev, image: text }))
              }
              style={twrnc`border border-gray-300 p-2 rounded mb-4`}
            />
            <Button
              title={isEditing ? "Update Orchid" : "Add Orchid"}
              onPress={handleAddOrEdit}
            />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
