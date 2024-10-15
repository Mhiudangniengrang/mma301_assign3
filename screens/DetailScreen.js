import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import twrnc from "twrnc";
import { useFocusEffect } from "@react-navigation/native";

const DetailScreen = ({ route, navigation }) => {
  const orchid = route.params?.orchid;
  const [isFavorite, setIsFavorite] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkFavoriteStatus = async () => {
        try {
          const savedFavorites = await AsyncStorage.getItem("favoriteOrchids");
          const favoriteOrchids = savedFavorites
            ? JSON.parse(savedFavorites)
            : [];

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

  const toggleFavorite = async () => {
    if (!orchid) return;

    try {
      const savedFavorites = await AsyncStorage.getItem("favoriteOrchids");
      const favoriteOrchids = savedFavorites ? JSON.parse(savedFavorites) : [];

      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = favoriteOrchids.filter(
          (fav) => fav.id !== orchid.id
        );
      } else {
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

  if (!orchid) {
    return <Text style={twrnc`text-center text-lg mt-9`}>No Detail</Text>;
  }
  return (
    <View style={twrnc`p-4`}>
      <Image source={{ uri: orchid.image }} style={twrnc`w-48 h-48 mx-auto`} />

      <Text style={twrnc`text-xl font-bold mt-4`}>{orchid.name}</Text>

      <Text style={twrnc`text-base mt-2`}>Category: {orchid.category}</Text>

      <Text style={twrnc`text-base mt-2`}>
        Is Nature: {orchid.isNature ? "Yes" : "No"}
      </Text>
      <Text style={twrnc`text-base mt-2`}>Rating: {orchid.rating}</Text>

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
