#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <EspSoftwareSerial.h>
#include <math.h>

struct ServerData {
  int32_t bed_mode;                // auto = 1
  int32_t controller_select;
  int32_t servo_top_cm;
  int32_t servo_back_cm;
  int32_t servo_leg_cm;
} server_data = { 1, 1, 0, 0, 0};

struct ProjectData {
  int32_t bed_mode;               // auto = 1
  int32_t servo_top;
  int32_t servo_back;
  int32_t servo_leg;
  int32_t sleep_position; 
} project_data;

const char GET_SERVER_DATA = 1;

SoftwareSerial se_read(D5, D6); // write only
SoftwareSerial se_write(D0, D1); // read only
String const url = "http://ecourse.cpe.ku.ac.th/exceed/api/";

const char GET_SERVER_DATA_RESULT = 2;
const char UPDATE_PROJECT_DATA = 3;

// wifi configuration
const char SSID[] = "EXCEED_LEFT_2_2.4GHz";
const char PASSWORD[] = "1234567890";

// for nodemcu communication
uint32_t last_sent_time = 0;
char expected_data_size = 0;
char cur_data_header = 0;
char buffer[256];
int8_t cur_buffer_length = -1;

void send_to_arduino(char code, void *data, char data_size) {
  char *b = (char*)data;
  int sent_size = 0;
  while (se_write.write(code) == 0) {
    delay(1);
  }
  while (sent_size < data_size) {
    sent_size += se_write.write(b, data_size);
    delay(1);
  }
}

void wifi_initialization() {
  Serial.println("WIFI INITIALIZING.");

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    yield();
    delay(10);
  }

  Serial.println("WIFI INITIALIZED.");
}

void serial_initialization() {
  Serial.begin(115200);
  se_read.begin(38400);
  se_write.begin(38400);

  while (!se_read.isListening()) {
    se_read.listen();
  }

  Serial.println();
  Serial.println("SERIAL INITIALIZED.");
}

String set_builder(const char *key, int32_t value) {
  String str = url;
  str = str + key;
  str = str + "/set?value=";
  str = str + value;
  Serial.println(str);
  return str;
}

String get_builder(const char *key) {
  String str = url;
  str = str + key;
  str = str + "/view/";
  Serial.println(str);
  return str;
}

void update_data_to_server_callback(String const &str) {
  Serial.println("update_data_to_server_callback FINISHED!");
}

bool GET(const char *url, void (*callback)(String const &str,int32_t &value), int32_t &value) {
  HTTPClient main_client;
  main_client.begin(url);
  if (main_client.GET() == HTTP_CODE_OK) {
    Serial.println("GET REQUEST RESPONSE BEGIN");
    if (callback != 0) {
      callback(main_client.getString(),value);
    }
    delay(100);
    return true;
  }
  Serial.println("GET REQUEST RESPONSE BEGIN");
  return false;
}
bool GET(const char *url, void (*callback)(String const &str,float &value), float &value) {
  HTTPClient main_client;
  main_client.begin(url);
  if (main_client.GET() == HTTP_CODE_OK) {
    Serial.println("GET REQUEST RESPONSE BEGIN");
    if (callback != 0) {
      callback(main_client.getString(),value);
    }
    delay(100);
    return true;
  }
  Serial.println("GET REQUEST RESPONSE BEGIN");
  return false;
}

bool POST(const char *url, void (*callback)(String const &str)) {
  HTTPClient main_client;
  main_client.begin(url);
  if (main_client.GET() == HTTP_CODE_OK) {
    Serial.println("POST REQUEST RESPONSE BEGIN");
    if (callback != 0) {
      callback(main_client.getString());
    }
    delay(100);
    return true;
  }
  Serial.println("POST REQUEST RESPONSE FAIL");
  return false;
}

int get_request_int(String const &str) {
  int32_t tmp = str.toInt();
  return tmp;
}

float get_request_float(String const &str) {
  float tmp = str.toFloat();
  return tmp;
}
void get_request(String const &str, int32_t &value){
  value = get_request_int(str);
}
void get_request(String const &str, float &value){
  value = get_request_float(str);  
}

void get_request_raw_callback(String const &str) {
  Serial.println("GET REQUEST RESPONSE BEGIN");
  Serial.println("========================");
  Serial.println(str.c_str());
  Serial.println("========================");
  Serial.println("GET REQUEST RESPONSE END");
}

void get_data_form_server(){
    GET(get_builder("tonpalm-bed_mode").c_str(), get_request,server_data.bed_mode); 
    Serial.print("bed_mode : ");
    Serial.println(server_data.bed_mode);
    GET(get_builder("tonpalm-controller_select").c_str(), get_request,server_data.controller_select); 
    Serial.print("controller_select : ");
    Serial.println(server_data.bed_mode);
    GET(get_builder("tonpalm-servo_top_cm").c_str(), get_request,server_data.servo_top_cm); 
    Serial.print("servo_top_cm : ");
    Serial.println(server_data.servo_top_cm);
    GET(get_builder("tonpalm-servo_back_cm").c_str(), get_request,server_data.servo_back_cm); 
    Serial.print("servo_back_cm : ");
    Serial.println(server_data.servo_back_cm);
    GET(get_builder("tonpalm-servo_leg_cm").c_str(),  get_request,server_data.servo_leg_cm); 
    Serial.print("servo_leg_cm : ");
    Serial.println(server_data.servo_leg_cm);
}

void sent_data_to_server(ProjectData *projectData){
      if(projectData->bed_mode <= 100 && projectData->bed_mode >= 0){
        POST(set_builder("tonpalm-bed_mode", projectData->bed_mode).c_str(), update_data_to_server_callback);
      }
      if(projectData->servo_top <= 100 && projectData->servo_top >= 0){
        POST(set_builder("tonpalm-servo_top", projectData->servo_top).c_str(), update_data_to_server_callback);
      }
      if(projectData->servo_back <= 100 && projectData->servo_back >= 0){
        POST(set_builder("tonpalm-servo_back", projectData->servo_back).c_str(), update_data_to_server_callback);
      }
      if(projectData->servo_leg <= 100 && projectData->servo_leg >= 0){
        POST(set_builder("tonpalm-servo_leg", projectData->servo_leg).c_str(), update_data_to_server_callback);
      }
      if(projectData->sleep_position <= 100 && projectData->sleep_position >= 0){
        POST(set_builder("tonpalm-sleep_position", projectData->sleep_position).c_str(), update_data_to_server_callback);
      }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void setup() {
  serial_initialization();
  wifi_initialization();

  Serial.print("sizeof(ServerData): ");
  Serial.println((int)sizeof(ServerData));
  Serial.print("ESP READY!");
}
void loop() {
  /* 1) Server polling data from server every 1500 ms
     2) Arduino always get local data
  */

  uint32_t cur_time = millis();
  if (cur_time - last_sent_time > 2000) {
    get_data_form_server();
    last_sent_time = cur_time;
  }

  while (se_read.available()) {
    char ch = se_read.read();
    //Serial.print("RECV: ");0
    //Serial.println((byte)ch);
    if (cur_buffer_length == -1) {
      cur_data_header = ch;
      switch (cur_data_header) {
        case UPDATE_PROJECT_DATA:
          expected_data_size = sizeof(ProjectData);
          cur_buffer_length = 0;
          break;
        case GET_SERVER_DATA:
          expected_data_size = sizeof(ServerData);
          cur_buffer_length = 0;
          break;
      }
    } else if (cur_buffer_length < expected_data_size) {
      buffer[cur_buffer_length++] = ch;
      if (cur_buffer_length == expected_data_size) {
        switch (cur_data_header) {
          case UPDATE_PROJECT_DATA: {
              ProjectData *project_data = (ProjectData*)buffer;
              Serial.print("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS ARDUINO SENT TO SERVER  SSSSSSSSSSSSSSSSSSSSSSSSSSSS");
              sent_data_to_server(project_data);
              Serial.print("mode :");
              Serial.print(project_data->bed_mode);
              Serial.println("Send data to Server");
          }
              break;
          case GET_SERVER_DATA:
            Serial.println("Send data to arduino");
            Serial.println("%%%%%%%%%%%%%%%%%%%%%%%%%% ARDUINO REQ SERVER DATA%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            send_to_arduino(GET_SERVER_DATA_RESULT, &server_data, sizeof(ServerData));
            break;
        }
        cur_buffer_length = -1;
      }
    }
  }
}
