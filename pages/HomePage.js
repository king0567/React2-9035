import { SafeAreaView, StyleSheet, Text, View, FlatList, Platform, Pressable, RefreshControl } from "react-native";
import { useCallback, useEffect, useState } from "react";
import UserAvatar from 'react-native-user-avatar'

let fetchedUsers = []

export default function HomePage() {

    const [users, setUsers] = useState(fetchedUsers)
    const [refreshing, setRefreshing] = useState(false)

    const layout = () => {
        if (Platform.OS == "android") {
            return {
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: 10,
            }
        } else {
            return {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: 10,
            }
        }
    }

    useEffect(() => {
        displayUsers()
    }, []);

    const displayUsers = async () => {
        try {
            const data = await fetchCall('https://random-data-api.com/api/users/random_user?size=10');
            if (!data) throw new Error("Failed to fetch data at refresh");
            const trimmedData = data.map(user => ({
                uid: user.uid,
                first_name: user.first_name,
                last_name: user.last_name,
                avatar: user.avatar
            }));
            setUsers(trimmedData)
        } catch (err) {
            console.log(err)
        }

    }

    const displayOneMoreUser = async () => {
        try {
            const newUser = await fetchCall('https://random-data-api.com/api/users/random_user?size=1');
            if (!newUser) throw new Error("Failed to fetch data at button");

            const trimmedData = newUser.map(user => ({
                uid: user.uid,
                first_name: user.first_name,
                last_name: user.last_name,
                avatar: user.avatar
            }));

            setUsers([trimmedData[0], ...users])

        } catch (err) {
            console.log(err)
        }
    }

    const onRefresh = useCallback(async () => {
        if (!refreshing) {
            setRefreshing(true)
            await displayUsers()
            setRefreshing(false)
        }
    }, [refreshing])

    async function fetchCall(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(res.statusText);
            const data = await res.json();
            return data
        } catch (err) {
            console.log("error at fetch call")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} data={users} renderItem={({ item }) => (
                <View style={layout()}>
                    <View>
                        <Text>{item.first_name}</Text>
                        <Text>{item.last_name}</Text>
                    </View>
                    <UserAvatar size={100} name={item.first_name + " " + item.last_name} src={item.avatar} bgColor="#000" textColor="#FFFF00" />
                </View>
            )} />
            <Pressable style={styles.FAB} onPress={() => {
                displayOneMoreUser()
            }}>
                <Text style={styles.FABText}>+</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        gap: 60,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginHorizontal: 20,
    },
    text: {
        fontSize: 60
    },
    FAB: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 300,
        position: 'absolute',
        bottom: 70,
        right: 40,
        backgroundColor: '#1d6ff2',
        elevation: 8
    },

    FABText: {
        fontSize: 50,
        color: "#fff"
    }
});
