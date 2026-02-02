import { Entypo, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "expo-audio";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabaseClient.js";

import Constants from "expo-constants";

console.log("EXTRA:", Constants.expoConfig?.extra);

type AudioPlayerType = {
  play: () => void;
  pause: () => void;
  stop?: () => void;
  seekTo?: (value: number) => void;
  currentTime?: number;
  duration?: number;
};

function AudioPlayerInstance({
  uri,
  onReady,
}: {
  uri: string;
  onReady: (player: AudioPlayerType) => void;
}) {
  const player = useAudioPlayer(uri, {
    updateInterval: 300,
    downloadFirst: true,
  });

  useEffect(() => {
    onReady(player);
  }, [player]);

  return null;
}

export default function SpotifyPlayer() {
  const { SongName, SongURL, ArtistName, SongImage } = useLocalSearchParams<{
    SongName?: string;
    SongURL?: string;
    ArtistName?: string;
    SongImage?: string;
  }>();

  const [tracks, setTracks] = useState([
    {
      title: "Kalimba",
      artist: "LearningContainer",
      artwork: "https://picsum.photos/300?random=10",
      uri: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    },
  ]);

  useEffect(() => {
    UpdateTracks();
    setShouldAutoPlayNext(true);
  }, []);


  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [player, setPlayer] = useState<AudioPlayerType | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [shouldAutoPlayNext, setShouldAutoPlayNext] = useState(false);

  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (!SongURL) return;

    setTracks([
      {
        title: SongName ?? "Unknown",
        artist: ArtistName ?? "Unknown",
        artwork: SongImage ?? "",
        uri: SongURL,
      },
    ]);
    setCurrentTrackIndex(0);
    setShouldAutoPlayNext(true);
  }, [SongURL]);

  useEffect(() => {
    setIsPlaying(false);
    setIsReady(false);
    setPosition(0);
    setDuration(1);
    setIsLooping(false);
  }, [currentTrack.uri]);

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      if (player.currentTime !== undefined) {
        setPosition(player.currentTime);
      }

      if (player.duration !== undefined && player.duration > 0 && !isReady) {
        setDuration(player.duration);
        setIsReady(true);

        if (shouldAutoPlayNext) {
          player.play();
          setIsPlaying(true);
          setShouldAutoPlayNext(false);
        }
      }

      if (
        isReady &&
        player.currentTime !== undefined &&
        player.duration !== undefined &&
        player.currentTime >= player.duration - 0.1
      ) {
        if (isLooping) {
          player.seekTo?.(0);
          player.play();
        } else {
          setShouldAutoPlayNext(true);
          nextTrack();
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [player, isReady, isLooping, shouldAutoPlayNext, currentTrackIndex]);

  const UpdateTracks = async () => {
    let count = 5;

    const { count: fetchedCount, error: countError } = await supabase
      .from("MusicApp")
      .select("*", { count: "exact", head: true });

    if (!countError && fetchedCount !== null) {
      count = fetchedCount;
    }

    const randomOffset = Math.floor(Math.random() * (count - 2));

    const { data, error } = await supabase
      .from("MusicApp")
      .select("*")
      .range(randomOffset, randomOffset + 2);

    if (error || !data?.length) {
      console.error(error);
      return;
    }

    const formatted = data.map((t) => ({
      title: t.SongName,
      artist: t.ArtistName,
      artwork: t.SongImage,
      uri: t.SongURL,
    }));

    setTracks(formatted);
    setCurrentTrackIndex(0);
  };

  /* -------- CONTROLS -------- */
  const togglePlayPause = () => {
    if (!player || !isReady) return;

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    setShouldAutoPlayNext(true);
    if (currentTrackIndex + 1 < tracks.length) {
      setCurrentTrackIndex((i) => i + 1);
    } else {
      UpdateTracks();
    }
  };

  const previousTrack = () => {
    setShouldAutoPlayNext(true);
    if (currentTrackIndex - 1 >= 0) {
      setCurrentTrackIndex((i) => i - 1);
    }
  };

  const onSeek = (value: number) => {
    if (!player || !isReady) return;
    setPosition(value);
    player.seekTo?.(value);
  };

  return (
    <View style={styles.container}>
      <AudioPlayerInstance
        key={currentTrack.uri}
        uri={currentTrack.uri}
        onReady={setPlayer}
      />

      <View style={styles.card}>
        <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
        <Text style={styles.title}>{currentTrack.title}</Text>
        <Text style={styles.artist}>{currentTrack.artist}</Text>

        <View style={styles.controls}>
          <TouchableOpacity onPress={previousTrack}>
            <Ionicons name="play-skip-back" size={32} color="#0affe6" />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayPause}>
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={64}
              color="#0affe6"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={nextTrack}>
            <Ionicons name="play-skip-forward" size={32} color="#0affe6" />
          </TouchableOpacity>
        </View>

        <Slider
          style={{ width: 300 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={onSeek}
          minimumTrackTintColor="#0affe6"
          maximumTrackTintColor="#444"
          thumbTintColor="#0affe6"
        />

        <TouchableOpacity onPress={() => setIsLooping(!isLooping)}>
          <Entypo
            name="loop"
            size={24}
            color={isLooping ? "#0affe6" : "#444"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  card: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  artwork: {
    width: 300,
    height: 300,
    borderRadius: 15,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },
  artist: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 15,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 250,
    marginTop: 10,
  },
});

// import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
// import Slider from "@react-native-community/slider";
// import { useAudioPlayer } from "expo-audio";
// import React, { useEffect, useState } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { supabase } from "./supabaseClient.js";

// type AudioPlayerType = {
//   play: () => void;
//   pause: () => void;
//   stop?: () => void;
//   seekTo?: (value: number) => void;
//   currentTime?: number;
//   duration?: number;
// };

// export default function SpotifyPlayer() {
//   const [tracks, setTracks] = useState([
//     {
//       title: "Kalimba Sample 1",
//       artist: "LearningContainer",
//       artwork: "https://picsum.photos/300?random=10",
//       uri: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
//     },
//   ]);

//   const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [position, setPosition] = useState(0); // current playback position
//   const [duration, setDuration] = useState(1); // total duration
//   const [isLooping, setIsLooping] = useState(false); // loop toggle

//   const currentTrack = tracks[currentTrackIndex];

//   const player: AudioPlayerType = useAudioPlayer(currentTrack.uri, {
//     updateInterval: 500,
//     downloadFirst: true,
//   });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (player.currentTime !== undefined) setPosition(player.currentTime);
//       if (player.duration !== undefined) setDuration(player.duration);

//       if (
//         player.currentTime !== undefined &&
//         player.duration !== undefined &&
//         player.currentTime >= player.duration - 0.1
//       ) {
//         if (isLooping) {
//           player.seekTo?.(0);
//           player.play();
//         } else {
//           nextTrack();
//         }
//       }
//     }, 500);

//     return () => clearInterval(interval);
//   }, [player, currentTrackIndex, isLooping]);

//   const UpdateTracks = async () => {
//     const { data, error } = await supabase.from("MusicApp").select("*").limit(3);

//     if (error) {
//       console.error("Error fetching data:", error);
//     } else if (data.length > 0) {
//       const formattedTracks = data.map((track) => ({
//         title: track.SongName,
//         artist: track.ArtistName,
//         artwork: track.SongImage,
//         uri: track.SongURL,
//       }));

//       setTracks(formattedTracks);
//       setCurrentTrackIndex(0);
//       setPosition(0);
//       setIsPlaying(false);

//       setTimeout(() => {
//         player.play();
//         setIsPlaying(true);
//       }, 100);
//     }
//   };

//   useEffect(() => {
//     UpdateTracks()
//   }, []);

//   const togglePlayPause = () => {
//     if (isPlaying) {
//       player.pause();
//       setIsPlaying(false);
//     } else {
//       player.play();
//       setIsPlaying(true);
//     }
//   };

//   const nextTrack = () => {
//     player.pause();
//     setIsPlaying(false);
//     if (currentTrackIndex + 1 < tracks.length) {
//       setCurrentTrackIndex(currentTrackIndex + 1);
//       setPosition(0);
//       setTimeout(() => {
//         player.play();
//         setIsPlaying(true);
//       }, 100);
//     } else {
//       UpdateTracks();
//     }
//   };

//   const previousTrack = () => {
//     player.pause();
//     setIsPlaying(false);
//     if (currentTrackIndex - 1 >= 0) {
//       setCurrentTrackIndex(currentTrackIndex - 1);
//       setPosition(0);
//       setTimeout(() => {
//         player.play();
//         setIsPlaying(true);
//       }, 100);
//     }
//   };

//   const onSeek = (value: number) => {
//     setPosition(value);
//     player.seekTo?.(value);
//   };

//   const toggleLoop = () => {
//     setIsLooping(!isLooping);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
//         <Text style={styles.title}>{currentTrack.title}</Text>
//         <Text style={styles.artist}>{currentTrack.artist}</Text>

//         <View style={styles.controls}>
//           <TouchableOpacity onPress={previousTrack}>
//             <MaterialIcons name="skip-previous" size={24} color= "#0affe6" />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={togglePlayPause}>
//             <Ionicons
//               name={isPlaying ? "pause-circle" : "play-circle"}
//               size={64}
//               color="#0affe6"
//             />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={nextTrack}>
//             <Entypo name="controller-next" size={24} color="#0affe6" />
//           </TouchableOpacity>

//         </View>

//         <Slider
//           style={{ width: 300, height: 40 }}
//           minimumValue={0}
//           maximumValue={duration}
//           value={position}
//           minimumTrackTintColor="#0affe6"
//           maximumTrackTintColor="#444"
//           thumbTintColor="#0affe6"
//           onValueChange={onSeek}
//         />

//         <TouchableOpacity onPress={toggleLoop} style={{ marginLeft: 15 }}>
//             <Entypo name="loop" size={24} color={isLooping ? "#0affe6" : "#444"} />
//           </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#121212",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     width: 350,
//     alignItems: "center",
//     backgroundColor: "#1e1e1e",
//     padding: 25,
//     borderRadius: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.5,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   artwork: {
//     width: 300,
//     height: 300,
//     borderRadius: 15,
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: "#0affe6",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//     marginBottom: 5,
//   },
//   artist: {
//     fontSize: 16,
//     color: "#aaa",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   controls: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//     width: "100%",
//     marginBottom: 25,
//   },
//   button: {
//     padding: 10,
//     borderRadius: 50,
//     backgroundColor: "#2a2a2a",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loopButton: {
//     padding: 10,
//     borderRadius: 50,
//     backgroundColor: "#2a2a2a",
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 10,
//   },
//   slider: {
//     width: 320,
//     height: 40,
//   },
// });
