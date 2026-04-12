// app/(main)/profile.tsx
import * as ImagePicker from 'expo-image-picker';
import {
  Bell,
  Camera,
  ChevronRight,
  LogOut,
  Moon,
  User
} from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// AJUSTA LA RUTA SEGÚN TU PROYECTO
import { Card } from "@/components/Card";
import ModalCamera from "@/components/ModalCamera";
import { AuthContext } from "@/contexts/AuthContext";
import { router } from 'expo-router';

const Profile = () => {
  const { user, updateImage, updateData, logout } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(user?.avatar_url);

  const [cameraVisible, setCameraVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!avatar) return;

    const sendImage = async () => {
      try {
        await updateImage(avatar);
      } catch (error) {
        console.error("Error actualizando imagen:", error);
      }
    };

    sendImage();
  }, [avatar]);
  
  const settings = [
    {
      id: 1,
      icon: User,
      title: "Editar perfil",
      subtitle: "Datos personales",
      color: "#00C48C",
      action: () => setEditModalVisible(true),
    }
  ];

  const selectImage = () => {
    Alert.alert(
      'Cambiar foto de perfil',
      'Selecciona una opción',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cámara', onPress: () => setCameraVisible(true) },
        { text: 'Galería', onPress: () => pickImage()},
      ]
    );
  };

  const handleCapture = (uri: string) => {
    setAvatar(uri);
  }; 

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login")
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
       

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Tarjeta de perfil */}
          <View style={{ marginBottom: 18 }}>
            <Card delay={100}>
              <View style={styles.profileCardInner}>
                {/* Avatar */}
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarCircle}>
                    <Image
                      source={{uri: avatar}}
                      style={styles.avatarImage}
                    />
                  </View>

                  <Pressable
                    style={styles.avatarCameraButton}
                    onPress={() => {
                      selectImage();
                    }}
                  >
                    <Camera size={16} color="#FFFFFF" />
                  </Pressable>
                </View>

                {/* Nombre + correo */}
                <Text style={styles.profileName}>{user?.name} {user?.last_name}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>

                {/* Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: "#00C48C" }]}>
                      128
                    </Text>
                    <Text style={styles.statLabel}>Días activo</Text>
                  </View>

                  <View style={[styles.statItem, styles.statItemMiddle]}>
                    <Text style={[styles.statValue, { color: "#FBBF24" }]}>
                      1,280
                    </Text>
                    <Text style={styles.statLabel}>Puntos</Text>
                  </View>

                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: "#1F2937" }]}>
                      85%
                    </Text>
                    <Text style={styles.statLabel}>Meta alcanzada</Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* Lista de ajustes */}
          <View style={{ marginBottom: 18 }}>
            {settings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <View key={setting.id} style={{ marginBottom: 10 }}>
                  <Card delay={200 + index * 80} hover>
                    <Pressable
                      onPress={setting.action}
                      style={styles.settingRow}
                    >
                      <View
                        style={[
                          styles.settingIconCircle,
                          { backgroundColor: setting.color + "20" },
                        ]}
                      >
                        <Icon size={22} color={setting.color} />
                      </View>

                      <View style={styles.settingTextBlock}>
                        <Text style={styles.settingTitle}>{setting.title}</Text>
                        <Text style={styles.settingSubtitle}>
                          {setting.subtitle}
                        </Text>
                      </View>

                      <ChevronRight
                        size={20}
                        color="#9CA3AF"
                      />
                    </Pressable>
                  </Card>
                </View>
              );
            })}
          </View>

          {/* Toggles */}
          <View style={{ marginBottom: 18, gap: 10 }}>
            {/* Notificaciones */}
            <Card delay={450}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <View style={[styles.toggleIconCircle, { backgroundColor: "#DBEAFE" }]}>
                    <Bell size={22} color="#2563EB" />
                  </View>
                  <View>
                    <Text style={styles.toggleTitle}>Notificaciones</Text>
                    <Text style={styles.toggleSubtitle}>
                      Alertas y recordatorios
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => setNotificationsEnabled((prev) => !prev)}
                  style={[
                    styles.switchTrack,
                    notificationsEnabled
                      ? styles.switchTrackOn
                      : styles.switchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      {
                        marginLeft: notificationsEnabled ? 24 : 2,
                      },
                    ]}
                  />
                </Pressable>
              </View>
            </Card>

            {/* Modo oscuro */}
            <Card delay={520}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <View style={[styles.toggleIconCircle, { backgroundColor: "#E0E7FF" }]}>
                    <Moon size={22} color="#4F46E5" />
                  </View>
                  <View>
                    <Text style={styles.toggleTitle}>Modo oscuro</Text>
                    <Text style={styles.toggleSubtitle}>
                      Tema de la aplicación
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => setDarkMode((prev) => !prev)}
                  style={[
                    styles.switchTrack,
                    darkMode ? styles.switchTrackDark : styles.switchTrackOff,
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      {
                        marginLeft: darkMode ? 24 : 2,
                      },
                    ]}
                  />
                </Pressable>
              </View>
            </Card>
          </View>

          {/* Cerrar sesión */}
          <View style={{ marginBottom: 10 }}>
            <Card delay={600} hover>
              <Pressable
                onPress={handleLogout}
                style={styles.logoutRow}
              >
                <View style={styles.logoutIconCircle}>
                  <LogOut size={22} color="#EF4444" />
                </View>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
              </Pressable>
            </Card>
          </View>

          {/* Versión */}
          <Text style={styles.versionText}>Koins v1.0.0</Text>

          <View style={{ height: 30 }} />
        </ScrollView>
        {cameraVisible && (
          <ModalCamera 
          onClose={() => setCameraVisible(false)}
          onCapture={handleCapture}/>
        )}

        {editModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar perfil</Text>

              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nombre"
              />

              <Text style={styles.inputLabel}>Apellido</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Apellido"
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#D1D5DB" }]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#00C48C" }]}
                  onPress={async () => {
                    try {
                      await updateData({ name, last_name: lastName });
                      setEditModalVisible(false);
                    } catch (error) {
                      console.error("Error actualizando perfil:", error);
                    }
                  }}
                >
                  <Text style={{ color: "#fff" }}>Guardar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  /** HEADER OSCURO */
  header: {
    backgroundColor: "#020617",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#9CA3AF",
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },

  /** TARJETA DE PERFIL */
  profileCardInner: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 9999,
    backgroundColor: "#00C48C",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: "700",
    color: "#ECFEFF",
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarCameraButton: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRadius: 9999,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    paddingTop: 14,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statItemMiddle: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
  },

  /** LISTA DE AJUSTES */
  settingRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  /** TOGGLES */
  toggleRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  toggleSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  switchTrack: {
    width: 50,
    height: 28,
    borderRadius: 9999,
    justifyContent: "center",
  },
  switchTrackOn: {
    backgroundColor: "#00C48C",
  },
  switchTrackDark: {
    backgroundColor: "#111827",
  },
  switchTrackOff: {
    backgroundColor: "#D1D5DB",
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    backgroundColor: "#FFFFFF",
  },

  /** LOGOUT */
  logoutRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },

  versionText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    marginTop: 12,
    marginBottom: 4,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
