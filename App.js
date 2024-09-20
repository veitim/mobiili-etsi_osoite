import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function App() {

  const apikey = process.env.EXPO_PUBLIC_API_KEY;

  useEffect(() => { getMylocation() }, []);

  const [address, setAddress] = useState('');
  const [mylocation, setMylocation] = useState(null);
  const [location, setLocation] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
  });

  const getMylocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to get location')
      return;
    }
    const mylocation = await Location.getCurrentPositionAsync({});
    setLocation({...location, latitude: mylocation.coords.latitude, longitude: mylocation.coords.longitude})
    console.log(mylocation);
  }

  const getLocation = () => {
    fetch(`https://geocode.maps.co/search?q=${address}&api_key=${apikey}`)
    .then(response => {
      if (!response.ok)
        throw new Error("Error in fetch:" + response.statusText);
      return response.json()
    })
    .then(data => {
      setLocation({...location, latitude: Number(data[0].lat), longitude: Number(data[0].lon)})
      //console.log(location)
    })
    .catch(err => console.error(err));
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map} 
        region={location}
      >
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude
        }}
        title={address} 
        />
      </MapView>
      <TextInput
        underlineColorAndroid={'gray'}
        style={styles.input} 
        placeholder='Place address' 
        value={address}
        onChangeText={text => setAddress(text)} 
      />
      <View style={styles.button}>
        <Button title="Show" onPress={getLocation}/>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%', 
    height: '100%',
    paddingBottom: 30,
  },
  container: {
    paddingTop: 70,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 100,
    width: '100%',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray', 
    borderBottomWidthborderWidth: 1,
  },
});
