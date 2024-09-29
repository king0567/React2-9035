import { Button, SafeAreaView, StyleSheet, Text, View, FlatList } from "react-native";
import { useEffect, useState } from "react";

let fetchedUsers = []







export default function HomePage() {

    const [users, setUsers] = useState(fetchedUsers)

    useEffect(() => {
        getUserData('https://random-data-api.com/api/users/random_user?size=10')
            .then(data => {
                const trimmedData = data.map(user => {
                    return {
                        uid: user.uid,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        avatar: user.avatar
                    }
                })
                setUsers(trimmedData)

            })
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Welcome to the 96/97 Chicago Bulls App!</Text>
            <FlatList data={users} renderItem={({ item }) => (
                <View>
                    <Text>{item.first_name}</Text>
                    <Text>{item.last_name}</Text>
                </View>
            )} />
        </SafeAreaView>
    );
}

async function getUserData(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 30
    },
    text: {
        fontSize: 60
    },
    buttons: {
        flexDirection: "column",
        gap: 10,

    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        margin: 10,
        gap: 10,
        backgroundColor: "red"

    },
});
