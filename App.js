import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "./color";

export default function App() {
  const [working, setWorking] = useState(true); //work, travel 구분하기 위한 boolean 변수
  const [text, setText] = useState(""); //입력받은 내용 (할 일 또는 여행지)
  const [toDos, setToDos] = useState([]);
  const work = () => setWorking(true);
  const travel = () => setWorking(false);
  const onChangeText = (payload) => setText(payload);
  const addTodo = async () => {
    if (text === "") return; //입력 내용이 없을 경우 종료
    const newTodo = {
      id: Date.now(),
      text: text,
      working: working, //할 일 인지 여행인지 구분
    };
    const newTodos = [...toDos, newTodo];
    setToDos(newTodos);
    setText("");
    await saveToDos(newTodos);
  };

  //처음 시작시 핸드폰에 저장된 문자열(할 일) 가져옴
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem("my-todos");
      setToDos(s != null ? JSON.parse(s) : []);
    } catch (e) {
      console.log(e);
    }
  };
  //핸드폰에 저장하기
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem("my-todos", JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    loadToDos();
  }, []);
  //삭제하기
  const deleteTodo = (id) => {
    const newTodos = toDos.filter((todo) => todo.id !== id);
    setToDos(newTodos);
    saveToDos(newTodos);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addTodo}
          returnKeyLabel="완료"
          onChangeText={onChangeText}
          value={text}
          placeholder={working ? "할 일 추가" : "어디로 여행 갈까요?"}
          style={styles.input}
        />
        <ScrollView>
          {toDos.map((todo) =>
            todo.working === working ? (
              <View style={styles.toDo} key={todo.id}>
                <Text style={styles.toDoText}>{todo.text}</Text>
                <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                  <Text>❌</Text>
                </TouchableOpacity>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
