import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/auth';
import { API_ENDPOINT } from '../config/constants';
import { useDirectUpload } from 'react-native-activestorage';
import { photoUploader } from '../services/upload_file_service';
import api_client from '../config/api_client';
import ReturnButton from '../components/shared/return_button';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';

export default function UserPage() {
  const { user, signOut, setUser } = useAuth();
  const [first_name, setFirstName] = useState(user?.first_name || '');
  const [last_name, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [image, setImage] = useState(null);
  const [addedImage, setAddedImage] = useState(null);

  const handleSubmit = () => {
    if (email.trim() !== '' || first_name.trim() !== '' || last_name.trim() !== '' ) {
      addedImage ? uploadAvatar() : updateUser()
    }
    else {
      Alert.alert('Your e-mail address cannot be empty')
    }
  }

  const onSuccess = ({ signedIds }) => {
    updateUser(signedIds[0])
  }

  const { upload } = useDirectUpload({ onSuccess });

  const onUploadButtonClick = async () => {
    const { files, images } = await photoUploader();
    setImage(files.assets[0].uri)
    setAddedImage(images)
  }

  const uploadAvatar = async () => {
    await upload(addedImage);
  }


  const updateUser = async (signedId) => {
    let newUser = {
      email,
      avatar: signedId,
      first_name,
      last_name
    }

     api_client.put(`/user`, { user: signedId ? newUser : { email, first_name, last_name } })
      .then(response => {
        Toast.show({
          text1: "Profile updated successfully.",
          type: "success",
        })
        setUser(response.data.user)
        setAddedImage(null)
        setImage(null)
      }).catch(error => {
        console.log(error);
        Toast.show({
          text1: "Something went wrong.",
          type: "error",
        })
      })
  }

  const logoutUser = async () => {
    await signOut();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ backgroundColor: '#4286f4', borderBottomRightRadius: 24, borderBottomLeftRadius: 24 }}>
          <ReturnButton color="#fff" />

          <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
            <TouchableOpacity
              onPress={onUploadButtonClick}
              activeOpacity={0.8}
            >
              {image || user.avatar ? (
                <Image style={{ width: 150, height: 150, borderRadius: 112, borderWidth: 5, borderColor: '#fff' }} source={{ uri: image ? image : `${API_ENDPOINT}/${user.avatar}` }} />
                ) : (
                  <View style={{ padding: 45 }}>
                    <Icon style={{paddingVertical: 20}} name='camera-outline' size={30} color='#fff' />
                  </View>
                )}
             </TouchableOpacity>
            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <Text style={{ color: '#fff' }}>{[first_name, last_name].join(' ')}</Text>
              <Text style={{ color: '#fff' }}>{email}</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={styles.inputIcon}>
            <Icon name="mail" size={20} />
          </View>
          <TextInput style={styles.input} autoCapitalize="none" value={email} onChangeText={(text) => setEmail(text)} />
          <TextInput style={styles.input} autoCapitalize="none" value={first_name} onChangeText={(text) => setFirstName(text)} />
          <TextInput style={styles.input} autoCapitalize="none" value={last_name} onChangeText={(text) => setLastName(text)} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 50 }}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={logoutUser}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  button: {
    marginTop: 30,
    borderRadius: 4,
    width: 80,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4286f4',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
  input: {
    marginTop: 20,
    borderRadius: 20,
    width: '90%',
    height: 40,
    borderColor: '#bbb',
    paddingVertical: 10,
    paddingLeft: 40,
    borderWidth: 1,
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 30,
    left: 35,
  },
})