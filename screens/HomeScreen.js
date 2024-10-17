import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import twrnc from "twrnc";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import CreateOrchidForm from "./CreateOrchidForm";
import EditOrchid from "./EditOrchid";

const HomeScreen = ({ route }) => {
  const [orchids, setOrchids] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigation = useNavigation();
  const [showEditForm, setShowEditForm] = useState(false);
  const [orchidToEdit, setOrchidToEdit] = useState(null);

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
        "https://670dca82073307b4ee4476f2.mockapi.io/api/orchid"
      );

      if (response.data && Array.isArray(response.data)) {
        const flattenedData = response.data.flatMap((category) =>
          category.items
            ? category.items.map((item) => ({
                ...item,
                category: category.name,
                parentId: category.id,
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

  const toggleDelete = async (orchid) => {
    Alert.alert(
      "Delete Orchid",
      `Are you sure you want to delete ${orchid.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await axios.get(
                `https://670dca82073307b4ee4476f2.mockapi.io/api/orchid/${orchid.parentId}`
              );

              if (response.data && response.data.items) {
                const updatedItems = response.data.items.filter(
                  (item) => item.id !== orchid.id
                );

                await axios.put(
                  `https://670dca82073307b4ee4476f2.mockapi.io/api/orchid/${orchid.parentId}`,
                  {
                    ...response.data,
                    items: updatedItems,
                  }
                );

                setOrchids((prevOrchids) =>
                  prevOrchids.filter((item) => item.id !== orchid.id)
                );
              }
            } catch (error) {
              console.error("Failed to delete orchid:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
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

      <TouchableOpacity
        onPress={() => {
          setOrchidToEdit(item);
          setShowEditForm(true);
        }}
        style={twrnc`ml-4`}
      >
        <FontAwesome name="edit" size={24} color="blue" />
      </TouchableOpacity>

      <TouchableOpacity style={twrnc`ml-4`} onPress={() => toggleDelete(item)}>
        <FontAwesome name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const handleAddOrchid = async (newOrchid) => {
    try {
      const response = await axios.get(
        "https://670dca82073307b4ee4476f2.mockapi.io/api/orchid"
      );

      if (response.data && Array.isArray(response.data)) {
        const flattenedData = response.data.flatMap((category) =>
          category.items
            ? category.items.map((item) => ({
                ...item,
                category: category.name,
                parentId: category.id,
              }))
            : []
        );
        setOrchids(flattenedData);
      }
    } catch (error) {
      console.error("Failed to fetch updated orchids:", error);
    }

    setShowCreateForm(false);
  };
  const handleEditOrchid = (updatedOrchid) => {
    setOrchids((prevOrchids) =>
      prevOrchids.map((orchid) =>
        orchid.id === updatedOrchid.id ? updatedOrchid : orchid
      )
    );
    setShowEditForm(false);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
  };

  return (
    <View style={twrnc`flex-1 bg-gray-100`}>
      <FlatList
        data={orchids}
        keyExtractor={(item) => item.id}
        renderItem={renderOrchid}
        contentContainerStyle={twrnc`p-4`}
      />

      {showCreateForm && (
        <CreateOrchidForm onAdd={handleAddOrchid} onCancel={handleCancel} />
      )}

      {showEditForm && orchidToEdit && (
        <EditOrchid
          orchid={orchidToEdit}
          onEdit={handleEditOrchid}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowCreateForm(true)}
        style={twrnc`absolute bottom-8 right-8 bg-blue-500 p-3 rounded-full shadow-lg`}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
