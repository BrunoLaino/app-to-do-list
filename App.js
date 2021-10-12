import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  ScrollView,
  TextInput,
  LogBox,
  AsyncStorage,
} from "react-native";
import { useFonts, Lato_400Regular } from "@expo-google-fonts/lato";
export default function App() {
  LogBox.ignoreAllLogs;

  const [modalVisible, setModalVisible] = useState(false);

  const [currentTask, setCurrentTask] = useState("");

  const [tasks, setTasks] = useState([]);

  const image = require("./resources/bg.jpg");

  let [fontsLoaded] = useFonts({
    Lato_400Regular,
  });

  useEffect(() => {
    (async () => {
      try {
        let currentTasks = await AsyncStorage.getItem("tasks");
        if (currentTasks == null) 
          setTasks([]); //Evitar crash
        else
          setTasks(JSON.parse(currentTasks));
        
      } catch (error) {}
    })();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  function saveItemAsyncStorage(item) {
    (async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(item));
      } catch (error) {}
    })();
  }

  function setTasksAndSaveAsyncStorage(task){
    setTasks(task);

    saveItemAsyncStorage(task);
  }

  function deleteTask(id) {
    alert("Tarefa com id " + id + " foi deletada com suceso!");
    let newTask = tasks.filter(function (listItem) {
      return listItem.id != id;
    });

    setTasksAndSaveAsyncStorage(newTask)
  }



  function addTask() {
    setModalVisible(!modalVisible);
    let id = 0;
    if (tasks.length > 0) {
      id = tasks[tasks.length - 1].id + 1;
    }

    let task = { id: id, task: currentTask };

    setTasksAndSaveAsyncStorage([...tasks, task])
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <StatusBar hidden />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal foi fechado.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              onChangeText={(text) => setCurrentTask(text)}
              autoFocus={true}
            ></TextInput>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => addTask()}
            >
              <Text style={styles.textStyle}>Adicionar Tarefa</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <ImageBackground source={image} style={styles.image}>
        <View style={styles.coverView}>
          <Text style={styles.textHeader}>Lista de Tarefas</Text>
        </View>
      </ImageBackground>

      {tasks.map(function (listItem) {
        return (
          <View style={styles.singleTask}>
            <View style={{ flex: 1, width: "100%", padding: 10 }}>
              <Text>{listItem.task}</Text>
            </View>
            <View style={{ alignItems: "flex-end", flex: 1, padding: 10 }}>
              <TouchableOpacity onPress={() => deleteTask(listItem.id)}>
                <AntDesign name="minuscircleo" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.btnAddTarefa}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          Adicionar Tarefa!
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btnAddTarefa: {
    width: 200,
    padding: 8,
    backgroundColor: "gray",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
  },
  coverView: {
    width: "100%",
    height: 80,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  textHeader: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    marginTop: 20,
  },
  singleTask: {
    marginTop: 30,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    flexDirection: "row",
    paddingBottom: 10,
  },
  //Estilos para nossa modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
