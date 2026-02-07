// Example ESP32 Arduino Sketch for Elacare
// This is a template you can use to flash your ESP32 microcontroller

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Elacare Configuration
const char* serverUrl = "http://YOUR_SERVER_IP:3001/api/esp32/data";
const char* esp32ApiKey = "YOUR_ESP32_API_KEY";
const char* farmId = "YOUR_FIREBASE_FARM_ID";

// Sensor Pins (ADC - Analog to Digital Converter)
const int N_PIN = 32;      // Nitrogen sensor pin
const int P_PIN = 33;      // Phosphorus sensor pin
const int K_PIN = 34;      // Potassium sensor pin
const int PH_PIN = 35;     // pH sensor pin
const int B_PIN = 36;      // Boron sensor pin
const int TEMP_PIN = 37;   // Temperature sensor (DHT22 via GPIO)
const int HUMIDITY_PIN = 38; // Humidity sensor

// Update interval (in milliseconds) - 5 minutes default
const unsigned long UPDATE_INTERVAL = 5 * 60 * 1000;
unsigned long lastUpdateTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n");
  Serial.println("================================");
  Serial.println("Elacare ESP32 Sensor System");
  Serial.println("================================");
  
  // Initialize sensor pins
  pinMode(N_PIN, INPUT);
  pinMode(P_PIN, INPUT);
  pinMode(K_PIN, INPUT);
  pinMode(PH_PIN, INPUT);
  pinMode(B_PIN, INPUT);
  
  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  // Check if it's time to send data
  if (millis() - lastUpdateTime >= UPDATE_INTERVAL) {
    if (WiFi.status() == WL_CONNECTED) {
      sendSensorData();
      lastUpdateTime = millis();
    } else {
      Serial.println("[ERROR] WiFi not connected. Reconnecting...");
      connectToWiFi();
    }
  }
  
  delay(1000);
}

void connectToWiFi() {
  Serial.print("[WiFi] Connecting to SSID: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected!");
    Serial.print("[WiFi] IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[ERROR] Failed to connect to WiFi");
  }
}

void sendSensorData() {
  Serial.println("\n[SENSOR] Reading sensor values...");
  
  // Read analog values and convert to mg/kg or pH
  int nitrogenRaw = analogRead(N_PIN);
  int phosphorusRaw = analogRead(P_PIN);
  int potassiumRaw = analogRead(K_PIN);
  int phRaw = analogRead(PH_PIN);
  int boronRaw = analogRead(B_PIN);
  
  // Calibration example: Convert raw ADC values to sensor readings
  // These calculations depend on your specific sensors
  float nitrogen = map(nitrogenRaw, 0, 4095, 0, 200);      // 0-200 mg/kg
  float phosphorus = map(phosphorusRaw, 0, 4095, 0, 100);  // 0-100 mg/kg
  float potassium = map(potassiumRaw, 0, 4095, 0, 300);    // 0-300 mg/kg
  float ph = 3.5 + (phRaw / 4095.0) * 4.5;                 // pH 3.5-8.0
  float boron = map(boronRaw, 0, 4095, 0, 10);             // 0-10 mg/kg
  
  // Log sensor readings
  Serial.print("[SENSOR] Nitrogen: ");
  Serial.print(nitrogen);
  Serial.println(" mg/kg");
  
  Serial.print("[SENSOR] Phosphorus: ");
  Serial.print(phosphorus);
  Serial.println(" mg/kg");
  
  Serial.print("[SENSOR] Potassium: ");
  Serial.print(potassium);
  Serial.println(" mg/kg");
  
  Serial.print("[SENSOR] pH: ");
  Serial.println(ph);
  
  Serial.print("[SENSOR] Boron: ");
  Serial.print(boron);
  Serial.println(" mg/kg");
  
  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["farmId"] = farmId;
  doc["nitrogen"] = nitrogen;
  doc["phosphorus"] = phosphorus;
  doc["potassium"] = potassium;
  doc["ph"] = ph;
  doc["boron"] = boron;
  
  String json;
  serializeJson(doc, json);
  
  // Send HTTP POST request
  Serial.println("[HTTP] Sending sensor data to server...");
  
  HTTPClient http;
  http.setConnectTimeout(5000);
  http.begin(serverUrl);
  
  // Set headers
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", esp32ApiKey);
  
  // Send POST request
  int httpCode = http.POST(json);
  
  if (httpCode > 0) {
    String response = http.getString();
    Serial.print("[HTTP] Response Code: ");
    Serial.println(httpCode);
    Serial.print("[HTTP] Response: ");
    Serial.println(response);
    
    if (httpCode == 200) {
      Serial.println("[SUCCESS] Data sent successfully!");
    } else {
      Serial.println("[ERROR] Server returned error");
    }
  } else {
    Serial.print("[ERROR] HTTP request failed: ");
    Serial.println(http.errorToString(httpCode).c_str());
  }
  
  http.end();
}

// Optional: Function to read temperature and humidity from DHT22
// void readDHT22() {
//   // Implement DHT22 reading code here
//   // Use: https://github.com/adafruit/DHT-sensor-library
// }

// Optional: Function for deep sleep to save power
// void goToDeepSleep(uint64_t sleepDuration) {
//   Serial.println("[POWER] Going to deep sleep...");
//   esp_deep_sleep(sleepDuration * 1000000); // Convert ms to microseconds
// }
