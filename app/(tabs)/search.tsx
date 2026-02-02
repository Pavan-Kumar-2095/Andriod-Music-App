import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supabaseClient";

const TINT = "#0affe6";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("MusicApp")
      .select("*")
      .ilike("SongName", `%${text}%`);

    if (!error) setResults(data || []);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#0affe6" />

        <TextInput
          placeholder="Search songs..."
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={handleSearch}
          style={styles.input}
        />

        {query.length > 0 && (
          <Pressable onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </Pressable>
        )}
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
        data={results}
        keyExtractor={(item) => item.id.toString()}
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

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
    letterSpacing: 0.5,
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
    marginBottom: 18,

    // glow
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
