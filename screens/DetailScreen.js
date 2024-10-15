import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import twrnc from "twrnc";
import { useFocusEffect } from "@react-navigation/native";

const DetailScreen = ({ route, navigation }) => {
  const orchid = route.params?.orchid;
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the orchid is in favorites when the component is focused or orchid data changes
  useFocusEffect(
    React.useCallback(() => {
      const checkFavoriteStatus = async () => {
        try {
          const savedFavorites = await AsyncStorage.getItem("favoriteOrchids");
          const favoriteOrchids = savedFavorites
            ? JSON.parse(savedFavorites)
            : [];

          // Check if the orchid exists in favorites based on `id`
          setIsFavorite(favoriteOrchids.some((fav) => fav.id === orchid.id));
        } catch (error) {
          console.error("Error loading favorites: ", error);
        }
      };

      if (orchid) {
        checkFavoriteStatus();
      }
    }, [orchid])
  );

  // Function to toggle the orchid as a favorite or remove it from favorites
  const toggleFavorite = async () => {
    if (!orchid) return;

    try {
      const savedFavorites = await AsyncStorage.getItem("favoriteOrchids");
      const favoriteOrchids = savedFavorites ? JSON.parse(savedFavorites) : [];

      let updatedFavorites;
      if (isFavorite) {
        // Remove from favorites if already favorited
        updatedFavorites = favoriteOrchids.filter(
          (fav) => fav.id !== orchid.id
        );
      } else {
        // Add to favorites if not favorited
        updatedFavorites = [...favoriteOrchids, orchid];
      }

      await AsyncStorage.setItem(
        "favoriteOrchids",
        JSON.stringify(updatedFavorites)
      );
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites: ", error);
    }
  };

  // Return "No Detail" message if the orchid is missing
  if (!orchid) {
    return <Text style={twrnc`text-center text-lg mt-9`}>No Detail</Text>;
  }
  return (
    <View style={twrnc`p-4`}>
      {/* Orchid Image */}
      <Image source={{ uri: orchid.image }} style={twrnc`w-48 h-48 mx-auto`} />

      {/* Orchid Name */}
      <Text style={twrnc`text-xl font-bold mt-4`}>{orchid.name}</Text>

      {/* Orchid Category */}
      <Text style={twrnc`text-base mt-2`}>Category: {orchid.category}</Text>

      {/* Orchid Nature and Rating */}
      <Text style={twrnc`text-base mt-2`}>
        Is Nature: {orchid.isNature ? "Yes" : "No"}
      </Text>
      <Text style={twrnc`text-base mt-2`}>Rating: {orchid.rating}</Text>

      {/* Toggle Favorite Button */}
      <TouchableOpacity onPress={toggleFavorite} style={twrnc`mt-4`}>
        <Text
          style={twrnc`text-center text-lg ${
            isFavorite ? "text-red-500" : "text-gray-400"
          }`}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailScreen;
