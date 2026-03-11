#include <Arduino.h>
#include <Wire.h>
#include <HardwareSerial.h>
#include <Adafruit_TCS34725.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

/* ================= OLED ================= */
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define OLED_ADDR 0x3C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

/* ================= ELACARE WiFi CONFIG ================= */
const char* ssid = "neo";
const char* password = "123456789";
const char* serverUrl = "http://10.238.154.50:5000/api/esp32/data";
const char* esp32ApiKey = "eGbdY0is1guIS6hxT7WPcyC5lHBjRfZ4";
const char* farmId = "JX7O6poLC5QPZ5zY0fMCVZqUC003";

/* ================= RELAYS ================= */
#define RELAY_PUMP    2
#define RELAY_GEAR    3
#define RELAY_FILTER  4
#define RELAY_REAG1   5
#define RELAY_REAG2   8

/* ================= BUTTONS ================= */
#define START_BTN 9
#define PLAY_BTN  10

/* ================= I2C ================= */
#define SDA_PIN 6
#define SCL_PIN 7

/* ================= NPK RS485 ================= */
#define NPK_RX_PIN   20
#define NPK_TX_PIN   21
#define NPK_DE_RE    1

HardwareSerial RS485Serial(1);

uint8_t npkRequest[8] = {0x01,0x03,0x00,0x00,0x00,0x07,0x04,0x08};
uint8_t npkResponse[19];

struct {
  float humidity, temperature, ph;
  uint16_t ec, n, p, k;
} npk;

bool npkValid = false;
unsigned long lastNPKRead = 0;
const unsigned long NPK_INTERVAL = 5000;

/* ================= COLOR SENSOR ================= */
Adafruit_TCS34725 tcs(
  TCS34725_INTEGRATIONTIME_50MS,
  TCS34725_GAIN_4X
);

/* ================= STATE ================= */
bool running = false;
bool paused = false;
bool colorSensorReady = false;

unsigned long lastTick = 0;
unsigned long lastButtonPress = 0;

int remainingTime = 0;
int currentStep = -1;

const unsigned long DEBOUNCE_MS = 300;
const unsigned long BOOT_DELAY = 1500;

float finalBoron = 0;

/* ================= STEPS ================= */
struct Step {
  const char* name;
  int* pins;
  int pinCount;
  int duration;
};

int step0[] = { RELAY_PUMP };
int step1[] = { RELAY_GEAR };
int step2[] = {};
int step3[] = { RELAY_FILTER };
int step4[] = { RELAY_REAG1, RELAY_REAG2 };
int step5[] = {};

Step steps[] = {
  {"Adding Water", step0, 1, 5},
  {"Mixing", step1, 1, 6},
  {"Dissolving", step2, 0, 6},
  {"Filtering", step3, 1, 5},
  {"Adding Reagents", step4, 2, 4},
  {"Reaction", step5, 0, 6}
};

const int TOTAL_STEPS = sizeof(steps) / sizeof(steps[0]);

int relays[] = {
  RELAY_PUMP,
  RELAY_GEAR,
  RELAY_FILTER,
  RELAY_REAG1,
  RELAY_REAG2
};

/* ================= RELAY CONTROL ================= */
void relayOn(int pin) { digitalWrite(pin, LOW); }
void relayOff(int pin) { digitalWrite(pin, HIGH); }

void allRelaysOff() {
  for (int i = 0; i < 5; i++)
    relayOff(relays[i]);
}

/* ================= OLED ================= */
void oledHeader(const char* title) {
  display.clearDisplay();
  display.setCursor(0,0);
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.println("ELACARE");
  display.println(title);
  display.println("----------------");
}

/* ================= BORON CALC ================= */
float calculateBoron(uint16_t r, uint16_t g, uint16_t b) {
  float absorbance = (float)r / (g + b + 1);
  return absorbance * 2.5;
}

/* ================= NPK READ ================= */
bool readNPK() {

  uint8_t idx = 0;
  unsigned long start = millis();

  while (RS485Serial.available()) RS485Serial.read();

  digitalWrite(NPK_DE_RE, HIGH);
  delay(2);

  RS485Serial.write(npkRequest, sizeof(npkRequest));
  RS485Serial.flush();

  delay(2);
  digitalWrite(NPK_DE_RE, LOW);

  while (millis() - start < 500) {

    while (RS485Serial.available()) {

      uint8_t b = RS485Serial.read();

      if (idx == 0 && b != 0x01) continue;
      if (idx == 1 && b != 0x03) { idx = 0; continue; }

      npkResponse[idx++] = b;

      if (idx >= 19) {

        npk.humidity    = ((npkResponse[3]<<8)|npkResponse[4]) / 10.0;
        npk.temperature = ((npkResponse[5]<<8)|npkResponse[6]) / 10.0;
        npk.ec          = (npkResponse[7]<<8)|npkResponse[8];
        npk.ph          = ((npkResponse[9]<<8)|npkResponse[10]) / 10.0;
        npk.n           = (npkResponse[11]<<8)|npkResponse[12];
        npk.p           = (npkResponse[13]<<8)|npkResponse[14];
        npk.k           = (npkResponse[15]<<8)|npkResponse[16];

        return true;
      }
    }
  }
  return false;
}

/* ================= WiFi CONNECTION ================= */
void connectToWiFi() {
  Serial.print("[WiFi] Connecting to SSID: ");
  Serial.println(ssid);
  
  oledHeader("WiFi");
  display.println("Connecting...");
  display.display();
  
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
    Serial.print("[WiFi] IP: ");
    Serial.println(WiFi.localIP());
    
    oledHeader("WiFi OK");
    display.println(WiFi.localIP());
    display.display();
    delay(2000);
  } else {
    Serial.println("\n[ERROR] WiFi connection failed!");
    oledHeader("WiFi ERROR");
    display.println("Connection Failed");
    display.display();
    delay(2000);
  }
}

/* ================= SEND DATA TO ELACARE ================= */
void sendDataToElacare() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[ERROR] WiFi not connected!");
    oledHeader("ERROR");
    display.println("WiFi Disconnected");
    display.display();
    delay(2000);
    return;
  }
  
  Serial.println("[HTTP] Sending data to Elacare...");
  oledHeader("UPLOADING");
  display.println("Sending to Elacare...");
  display.display();
  
  HTTPClient http;
  http.setConnectTimeout(5000);
  http.begin(serverUrl);
  
  // Set headers
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", esp32ApiKey);
  
  // Create JSON payload with all measured values
  StaticJsonDocument<512> doc;
  doc["farmId"] = farmId;
  doc["nitrogen"] = npk.n;
  doc["phosphorus"] = npk.p;
  doc["potassium"] = npk.k;
  doc["ph"] = npk.ph;
  doc["boron"] = finalBoron;
  doc["temperature"] = npk.temperature;
  doc["humidity"] = npk.humidity;
  doc["ec"] = npk.ec;
  
  String json;
  serializeJson(doc, json);
  
  Serial.println("[HTTP] Payload: " + json);
  
  // Send POST request
  int httpCode = http.POST(json);
  
  if (httpCode > 0) {
    String response = http.getString();
    Serial.print("[HTTP] Response Code: ");
    Serial.println(httpCode);
    Serial.print("[HTTP] Response: ");
    Serial.println(response);
    
    if (httpCode == 200) {
      Serial.println("[SUCCESS] Data sent to Elacare!");
      oledHeader("SUCCESS");
      display.println("Data Sent!");
      display.display();
      delay(2000);
    } else {
      Serial.println("[ERROR] Server returned error");
      oledHeader("ERROR");
      display.print("Code: ");
      display.println(httpCode);
      display.display();
      delay(2000);
    }
  } else {
    Serial.print("[ERROR] HTTP request failed: ");
    Serial.println(http.errorToString(httpCode).c_str());
    oledHeader("ERROR");
    display.println("Request Failed");
    display.display();
    delay(2000);
  }
  
  http.end();
}

/* ================= START PROCESS ================= */
void startProcess() {

  running = true;
  paused = false;
  colorSensorReady = false;

  currentStep = 0;
  remainingTime = steps[0].duration;
  lastTick = millis();

  allRelaysOff();

  for (int i = 0; i < steps[0].pinCount; i++)
    relayOn(steps[0].pins[i]);

  npkValid = readNPK();
  lastNPKRead = millis();
}

/* ================= SETUP ================= */
void setup() {

  Serial.begin(115200);

  for (int i = 0; i < 5; i++)
    pinMode(relays[i], OUTPUT);

  allRelaysOff();

  pinMode(START_BTN, INPUT_PULLUP);
  pinMode(PLAY_BTN, INPUT_PULLUP);

  pinMode(NPK_DE_RE, OUTPUT);
  digitalWrite(NPK_DE_RE, LOW);

  Wire.begin(SDA_PIN, SCL_PIN);
  RS485Serial.begin(4800, SERIAL_8N1, NPK_RX_PIN, NPK_TX_PIN);

  display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR);

  // Connect to WiFi
  connectToWiFi();

  oledHeader("READY");
  display.println("Press START");
  display.display();
}

/* ================= LOOP ================= */
void loop() {

  if (!running &&
      millis() > BOOT_DELAY &&
      digitalRead(START_BTN) == LOW &&
      millis() - lastButtonPress > DEBOUNCE_MS) {

    lastButtonPress = millis();
    startProcess();
    return;
  }

  if (running &&
      digitalRead(PLAY_BTN) == LOW &&
      millis() - lastButtonPress > DEBOUNCE_MS) {

    lastButtonPress = millis();

    if (!paused) {
      paused = true;
      allRelaysOff();
      oledHeader("PAUSED");
      display.println("Process Paused");
      display.display();
      return;
    } else {
      paused = false;
      for (int i = 0; i < steps[currentStep].pinCount; i++)
        relayOn(steps[currentStep].pins[i]);

      oledHeader("RESUMED");
      display.println(steps[currentStep].name);
      display.display();
      lastTick = millis();
      return;
    }
  }

  if (!running || paused) return;

  if (millis() - lastTick >= 1000) {

    lastTick = millis();
    remainingTime--;

    if (millis() - lastNPKRead > NPK_INTERVAL) {
      lastNPKRead = millis();
      npkValid = readNPK();
    }

    oledHeader("RUNNING");
    display.println(steps[currentStep].name);
    display.print("Time: ");
    display.print(remainingTime);
    display.println(" s");
    display.display();

    if (remainingTime <= 0) {

      allRelaysOff();
      currentStep++;

      if (currentStep >= TOTAL_STEPS) {

        if (tcs.begin()) {
          uint16_t r,g,b,c;
          tcs.getRawData(&r,&g,&b,&c);
          finalBoron = calculateBoron(r,g,b);
        }

        oledHeader("DONE");

        display.print("B:");
        display.print(finalBoron,2);
        display.println(" mg/kg");

        display.print("N:");
        display.print(npk.n);
        display.print(" P:");
        display.print(npk.p);
        display.print(" K:");
        display.println(npk.k);

        display.print("pH:");
        display.println(npk.ph,1);

        display.display();

        running = false;
        paused = false;
        
        // Send data to Elacare backend
        delay(1000);
        sendDataToElacare();
      }
      else {

        remainingTime = steps[currentStep].duration;

        for (int i = 0; i < steps[currentStep].pinCount; i++)
          relayOn(steps[currentStep].pins[i]);
      }
    }
  }
}
