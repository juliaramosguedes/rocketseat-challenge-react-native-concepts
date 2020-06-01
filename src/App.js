import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "./services/api";

export default () => {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("repositories").then((response) => {
      setRepositories(response.data);
    });
  }, []);

  const handleLikeRepository = async (id) => {
    try {
      const response = await api.post(`repositories/${id}/like`);
      const likedRepository = response.data;

      setRepositories(
        repositories.map((repository) =>
          repository.id === id ? likedRepository : repository
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: { title, id, techs, likes } }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{title}</Text>
              <FlatList
                data={techs}
                keyExtractor={(repository, index) => `${id}-techs-${index}`}
                renderItem={({ item: tech }) => (
                  <View style={styles.techsContainer}>
                    <Text style={styles.tech}>{tech}</Text>
                  </View>
                )}
              />
              <View style={styles.likesContainer}>
                <Text style={styles.likeText} testID={`repository-likes-${id}`}>
                  {likes} curtida{likes > 1 && "s"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(id)}
                testID={`like-button-${id}`}
                activeOpacity={0.6}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
