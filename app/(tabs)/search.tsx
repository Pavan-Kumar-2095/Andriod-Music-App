import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../../lib/supabaseClient";

const TINT = "#0affe6";

interface Song {
  id: number;
  SongName: string;
  SongURL: string;
  ArtistName: string;
  SongImage?: string;
  Language?: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [allSongs, setAllSongs] = useState<Song[]>([]); // songs loaded for selected language
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const [carouselOptions] = useState([
    { id: 1, label: "Kannada" },
    { id: 2, label: "Telugu" },
    { id: 3, label: "Hindi" },
    { id: 4, label: "English" },
  ]);

  const [selectedOption, setSelectedOption] = useState<string>("*");

  // Load all songs of selected language
  const loadSongsByLanguage = async (language: string) => {
    setLoading(true);
    setQuery(""); // clear search box
    const { data, error } = await supabase
      .from("MusicApp")
      .select("*")
      .eq("Language", language);

    if (error) {
      console.error(error);
      setAllSongs([]);
      setFilteredSongs([]);
    } else {
      setAllSongs(data || []);
      setFilteredSongs(data || []);
    }
    setLoading(false);
  };

  // Handle language click
  const handleLanguageClick = (language: string) => {
    setSelectedOption(language);
    loadSongsByLanguage(language);
  };

  // Client-side search filter
  useEffect(() => {
    if (query.length < 2) {
      setFilteredSongs(allSongs);
      return;
    }

    const filtered = allSongs.filter((song) =>
      song.SongName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered);
  }, [query, allSongs]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={TINT} />

        <TextInput
          placeholder="Search songs..."
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />

        {query.length > 0 && (
          <Pressable
            onPress={() => {
              setQuery("");
            }}
          >
            <Ionicons name="close-circle" size={20} color="#888" />
          </Pressable>
        )}
      </View>

      {/* Language Buttons */}
      <View style={styles.optionCarousel}>
        {carouselOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleLanguageClick(option.label)}
            style={[
              styles.optionItem,
              selectedOption === option.label && styles.optionItemSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option.label && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <ActivityIndicator
          size="small"
          color={TINT}
          style={{ marginBottom: 10 }}
        />
      )}

      {/* Results */}
      <FlatList
        data={filteredSongs}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/",
                params: {
                  SongName: item.SongName,
                  SongURL: item.SongURL,
                  ArtistName: item.ArtistName,
                  SongImage: item.SongImage,
                },
              })
            }
          >
            <Text style={styles.title}>{item.SongName}</Text>
            <Text style={styles.artist}>{item.ArtistName}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 12,
    shadowColor: TINT,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  optionCarousel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  optionItem: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#444",
    marginRight: 8,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  optionItemSelected: {
    backgroundColor: "#0affe6",
  },
  optionText: {
    color: "#fff",
    fontSize: 12,
  },
  optionTextSelected: {
    color: "#111",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#161616",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: TINT,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  artist: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 4,
  },
});

