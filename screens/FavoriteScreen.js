import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import twrnc from "twrnc";
import { FontAwesome } from "@expo/vector-icons";

const FavoriteScreen = ({ navigation }) => {
  const [favoriteOrchids, setFavoriteOrchids] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const getFavoriteOrchids = async () => {
        try {
          const orchids = await AsyncStorage.getItem("favoriteOrchids");
          if (orchids) {
            setFavoriteOrchids(JSON.parse(orchids));
          } else {
            setFavoriteOrchids([]);
          }
        } catch (error) {
          console.error(error);
        }
      };

      getFavoriteOrchids();
    }, [])
  );

  const removeOrchid = async (orchid) => {
    Alert.alert(
      "Remove Orchid",
      `Are you sure you want to remove ${orchid.name} from your favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            const updatedFavorites = favoriteOrchids.filter(
              (fav) => fav.id !== orchid.id 
            );
            setFavoriteOrchids(updatedFavorites);
            await AsyncStorage.setItem(
              "favoriteOrchids",
              JSON.stringify(updatedFavorites)
            );
          },
        },
      ]
    );
  };

  const removeAllOrchids = async () => {
    Alert.alert(
      "Remove All",
      "Are you sure you want to remove all favorite orchids?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            setFavoriteOrchids([]);
            await AsyncStorage.removeItem("favoriteOrchids");
            navigation.navigate("Home", { cleared: true });
          },
        },
      ]
    );
  };

  return (
    <View style={twrnc`p-4`}>
      {favoriteOrchids.length === 0 ? (
        <Text style={twrnc`text-center text-lg mt-4`}>No Favorite</Text>
      ) : (
        <FlatList
          data={favoriteOrchids}
          keyExtractor={(item) => item.id.toString()} // Sử dụng `id` làm key
          renderItem={({ item }) => (
            <View style={twrnc`m-4 p-4 bg-white shadow-lg rounded-lg`}>
              <Image
                source={{ uri: item.image }}
                style={twrnc`w-24 h-24 rounded-full mx-auto`}
              />
              <Text style={twrnc`text-center font-bold mt-2`}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => removeOrchid(item)}
                style={twrnc`mt-2 justify-center items-center`}
              >
                <FontAwesome name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={() =>
            favoriteOrchids.length > 0 && (
              <TouchableOpacity
                onPress={removeAllOrchids}
                style={twrnc`mt-2 justify-center items-center`}
              >
                <Text style={twrnc`text-red-500`}>Remove All</Text>
              </TouchableOpacity>
            )
          }
        />
      )}
    </View>
  );
};

export default FavoriteScreen;
