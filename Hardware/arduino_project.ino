#include "DHT.h"          // Temp and humidity
#include <SoftwareSerial.h>
#include <Servo.h>

SoftwareSerial se_read(12, 13); // write only
SoftwareSerial se_write(10, 11); // read only

Servo top_great_servo;
Servo back_great_servo;
Servo leg_great_servo;

///////////////////////// USER DEFINE ////////////////////////////

#define accelero_x  14
#define accelero_y  15
#define accelero_z  16
#define ZX_PHOTO 6

#define SLEEP_DETECT_RATIO_MIN        300
#define SLEEP_DETECT_RATIO_MAX        375
#define SLEEP_ON_BACK                 0 
#define SLEEP_ON_LEFT_SIDE            1
#define SLEEP_ON_RIGHT_SIDE           2
#define SLEEP_ON_PRONE                3

#define TOP_BED_SERVO 7
#define LEG_BED_SERVO 8
#define BACK_BED_SERVO 9

#define LED_AUTO 3
#define LED_MANUAL 4

const int SW_pin = 2; // digital pin  switch output
const int X_pin = 3;  // analog pin  X output
const int Y_pin = 4;  // analog pin  Y output

///////////////////////// USER GLOBAL VARIABLE ////////////////////////////
//accelero
int sleep_position_count;
int last_sleep_position;
int last_time_get_position;
int last_position;
// ZX_photo
int infra_last_state;
int infra_current_state;
// servo
int max_servo_degree = 180;
int min_servo_degree = 0;
int back_servo_angle;
int angle_back;
int angle_leg;
int angle_top;
int old_angle_back;
int old_angle_leg;
// joystick
int joystick_x;
int joystick_y;
int joystick_sw;
int mode_is_change;


struct ServerData {
  int32_t bed_mode;                // auto = 1
  int32_t controller_select;       // joy = 1
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
const char GET_SERVER_DATA_RESULT = 2;
const char UPDATE_PROJECT_DATA = 3;

uint32_t last_sent_time = 0;
uint32_t last_req_time = 1500;
boolean is_data_header = false;
char expected_data_size = 0;
char cur_data_header = 0;
char buffer[256];
int8_t cur_buffer_length = -1;
long duration;
long centimetes;
long floor_length;


void move_bed_linear() {
  while(angle_back != 0) {
    angle_back --;
    change_angle_of_back_servo();
    delay(20);
  }

  while(angle_leg != 0) {
    angle_leg--;
    change_angle_of_leg_servo();
    delay(20);
  }

  while (angle_top != 0) {
    angle_top--;
    change_angle_of_top_servo();
    delay(20);
  }
}

void setup_great_servo() {
  top_great_servo.attach(TOP_BED_SERVO);
  top_great_servo.write(90);
  delay(100);
  back_great_servo.attach(BACK_BED_SERVO);
  back_great_servo.write(min_servo_degree);
  delay(100);
  leg_great_servo.attach(LEG_BED_SERVO);
  leg_great_servo.write(min_servo_degree); 
  delay(100);
}

void setup_joystick() {
  pinMode(SW_pin, INPUT);
  digitalWrite(SW_pin, HIGH);
}

void setup_initial_angle() {
  angle_back = 0;
  angle_leg = 0;
  angle_top = 0;
  change_angle_of_top_servo();
  
}

void get_joystick() {
  joystick_x = analogRead(X_pin) - 520;
  joystick_y = analogRead(Y_pin) - 519;
  joystick_sw = digitalRead(SW_pin);

  delay(20);
}

void is_joystick_move_over_bound() {
  get_joystick();
  if (angle_back > max_servo_degree) angle_back = max_servo_degree;
  else if ( angle_back < min_servo_degree) angle_back = min_servo_degree;

  if (angle_leg > max_servo_degree) angle_leg = max_servo_degree;
  else if ( angle_leg < min_servo_degree) angle_leg = min_servo_degree;
}

void joystick_controll() {
    if (joystick_x > 450) {
    angle_back += 2;
  } else if (joystick_x < -450) {
    angle_back -= 2;
  }

  if (joystick_y > 450) {
    angle_leg += 2;
  } else if (joystick_y < -450) {
    angle_leg -= 2;
  }
}


//void light_led_by_position() {
//  if (project_data.sleep_position == SLEEP_ON_BACK) {
//    
//  } else if (project_data.sleep_position == SLEEP_ON_LEFT_SIDE) {
//    
//  } else if (project_data.sleep_position == SLEEP_ON_RIGHT_SIDE) {
//    
//  } else if (project_data.sleep_position == SLEEP_ON_PRONE) {
//    
//  }
//}

void joy_servo_controll() {
    if (angle_back > max_servo_degree) angle_back = max_servo_degree;
  else if ( angle_back < min_servo_degree) angle_back = min_servo_degree;
  else {
    if (angle_back != old_angle_back) {
      if (joystick_x > 450) {
        change_angle_of_back_servo();
        old_angle_back = angle_back;
      } else if (joystick_x < -450) {
        change_angle_of_back_servo();
        old_angle_back = angle_back;
      }
    }
  }

  if (angle_leg > max_servo_degree) angle_leg = max_servo_degree;
  else if ( angle_leg < min_servo_degree) angle_leg = min_servo_degree;
  else {
    if (angle_leg != old_angle_leg) {
      if (joystick_y > 450) {
        change_angle_of_leg_servo();
        old_angle_leg = angle_leg;
      } else if (joystick_y < -450) {
        change_angle_of_leg_servo();
        old_angle_leg = angle_leg;
      }
    }
  }
}

//####################### COMMUNICATION FUNCTION ######################

void send_to_nodemcu(char code, void *data, char data_size) {
  char *b = (char*)data; 
  char sent_size = 0;
  while (se_write.write(code) == 0) {
    delay(1);
  }
  while (sent_size < data_size) {
    sent_size += se_write.write(b, data_size);
    delay(1);
  }
}

////////////////////////// PRIVATE FUNCTION  ////////////////////////////

void get_infra_sensor(){
  infra_current_state = digitalRead(ZX_PHOTO);

  if (infra_current_state == LOW && infra_last_state == HIGH) {
     delay(100);
     project_data.bed_mode = !project_data.bed_mode;
     server_data.controller_select = 1;
     mode_is_change = 1;
     }
  infra_last_state = infra_current_state;
}

void light_led_follow_mode() {
    if (project_data.bed_mode){;
    Serial.println("on");
    digitalWrite(LED_AUTO, HIGH);
    digitalWrite(LED_MANUAL, LOW);
  } else {
    //Serial.println("off");
    digitalWrite(LED_MANUAL, HIGH);    
    digitalWrite(LED_AUTO, LOW);
  }
}

void change_angle_of_top_servo() {
  top_great_servo.write(angle_top);
  project_data.servo_top = angle_top;
  delay(20);

}

void change_angle_of_back_servo() {
  back_great_servo.write(angle_back);
  project_data.servo_back = angle_back;
  delay(20);

}

void change_angle_of_leg_servo() {
  leg_great_servo.write(angle_leg);
  project_data.servo_leg = angle_leg;
  delay(20);
  
}

uint32_t get_Sleep_Position(){
  int x, y, z;
  x = analogRead(accelero_x);
  y = analogRead(accelero_y);
  z = analogRead(accelero_z);
  if(z >= SLEEP_DETECT_RATIO_MAX){
    if(last_sleep_position == SLEEP_ON_BACK){
      sleep_position_count++;
    }
    else{
      last_sleep_position = SLEEP_ON_BACK;
      sleep_position_count = 0;
    }
  }
  else if(x >= SLEEP_DETECT_RATIO_MAX){
    if(last_sleep_position == SLEEP_ON_LEFT_SIDE){
      sleep_position_count++;
    }
    else{
      last_sleep_position = SLEEP_ON_LEFT_SIDE;
      sleep_position_count = 0;
    }
  }
  else if(x <= SLEEP_DETECT_RATIO_MIN){
    if(last_sleep_position == SLEEP_ON_RIGHT_SIDE){
      sleep_position_count++;
    }
    else{
      last_sleep_position = SLEEP_ON_RIGHT_SIDE;
      sleep_position_count = 0;
    }
  }
  else if(z <= SLEEP_DETECT_RATIO_MIN){
    if(last_sleep_position == SLEEP_ON_PRONE){
      sleep_position_count++;
    }
    else{
      last_sleep_position = SLEEP_ON_PRONE;
      sleep_position_count = 0;
    }
  }

  if(sleep_position_count >= 5){
    project_data.sleep_position = last_sleep_position;
    Serial.print("sleep_position : ");
    Serial.println(project_data.sleep_position);
  }
}

//////////////////////////////// MAIN ////////////////////////////

void setup() {
  Serial.begin(115200);
  se_read.begin(38400);
  se_write.begin(38400);
  
  pinMode(LED_BUILTIN, OUTPUT);
  while (!se_read.isListening()) {
    se_read.listen();
  }
  Serial.println((int)sizeof(ServerData));
  Serial.println("ARDUINO READY!");
  // ZX_photo
  infra_last_state == HIGH;
  // Accelerometer
  project_data.sleep_position = 4;
  last_time_get_position = 0;
  // put your setup code here, to run once:
  setup_great_servo();
  setup_joystick();
  setup_initial_angle();
  pinMode(LED_AUTO, OUTPUT);
  pinMode(LED_MANUAL, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
//  Serial.println(project_data.bed_mode);
  if(project_data.bed_mode && project_data.sleep_position != last_position) {
    if (project_data.sleep_position == SLEEP_ON_BACK) {
      move_bed_linear();
      while (angle_leg > 40) {
              angle_leg -= 1;
       change_angle_of_leg_servo();
      }
      while (angle_leg < 40) {
              angle_leg += 1;
       change_angle_of_leg_servo();
      }
      Serial.println("set leg");
    } else if (project_data.sleep_position == SLEEP_ON_PRONE || project_data.sleep_position == SLEEP_ON_LEFT_SIDE || project_data.sleep_position == SLEEP_ON_RIGHT_SIDE) {
      move_bed_linear();
      while (angle_back > 40) {
              angle_back -= 1;
       change_angle_of_back_servo();
      }
      while (angle_back < 40) {
              angle_back += 1;
       change_angle_of_back_servo();
      }
      while (angle_top> 40) {
              angle_top -= 1;
       change_angle_of_top_servo();
      }
      while (angle_top < 40) {
              angle_top += 1;
       change_angle_of_top_servo();
      }
    }
  }
  else{
    if(server_data.controller_select){
      if (!digitalRead(SW_pin)) move_bed_linear();
    
      is_joystick_move_over_bound();
    
      delay(50);
    
      joystick_controll();
    
      joy_servo_controll();
    } else {
      Serial.println("set form server");
      while (angle_leg > server_data.servo_leg_cm) {
              angle_leg -= 1;
       change_angle_of_leg_servo();
      }
      while (angle_top > server_data.servo_top_cm) {
              angle_top -= 1;
       change_angle_of_top_servo();
      }
      while (angle_back > server_data.servo_back_cm) {
              angle_back -= 1;
       change_angle_of_back_servo();
      }
      while (angle_leg < server_data.servo_leg_cm) {
              angle_leg += 1;
       change_angle_of_leg_servo();
      }
      while (angle_top < server_data.servo_top_cm) {
              angle_top += 1;
       change_angle_of_top_servo();
      }
      while (angle_back < server_data.servo_back_cm) {
              angle_back += 1;
       change_angle_of_back_servo();
      }
    }
  }

  last_position = project_data.sleep_position;
  get_infra_sensor();

  uint32_t current_time_get_position = millis();
  if(current_time_get_position - last_time_get_position > 1000){
    get_Sleep_Position();
    last_time_get_position = current_time_get_position;
  }

  
  uint32_t cur_time = millis();
  //send to nodemcu
  if (cur_time - last_sent_time > 1000) {//always update
    send_to_nodemcu(UPDATE_PROJECT_DATA, &project_data, sizeof(ProjectData));
    last_sent_time = cur_time;
    Serial.println("sent to server");
  }
  if (cur_time - last_req_time > 2000) {//always update
    send_to_nodemcu(GET_SERVER_DATA, &server_data, sizeof(ServerData));
    last_req_time = cur_time;
    Serial.println("get form server");
  }

  //read from sensor....
  //send to nodemcu
  
  //read data from server pass by nodemcu
  while (se_read.available()) {
    char ch = se_read.read();
    //Serial.print("RECV: ");
    //Serial.println((byte)ch);
    if (cur_buffer_length == -1) {
      cur_data_header = ch;
      switch (cur_data_header) {
        case GET_SERVER_DATA_RESULT:
        //unknown header
          expected_data_size = sizeof(ServerData);
          cur_buffer_length = 0;
          break;
      }
    } else if (cur_buffer_length < expected_data_size) {
      buffer[cur_buffer_length++] = ch;
      if (cur_buffer_length == expected_data_size) {
        switch (cur_data_header) {
          case GET_SERVER_DATA_RESULT: {
            ServerData *data = (ServerData*)buffer;
            //use data to control sensor
            if(data->bed_mode <= 100 && data->bed_mode >= 0){
              server_data.bed_mode = data->bed_mode;
              if(mode_is_change){
                if(project_data.bed_mode == server_data.bed_mode){
                  mode_is_change = 0;
                  delay(2000);
                }
              } else {
                project_data.bed_mode = server_data.bed_mode;
              }
            }
            if(data->controller_select <= 100 && data->controller_select >= 0){
              server_data.controller_select = data->controller_select;
            }
            if(data->servo_top_cm <= 100 && data->servo_top_cm >= 0){
              server_data.servo_top_cm = data->servo_top_cm;
            }
            if(data->servo_back_cm <= 100 && data->servo_back_cm >= 0){
              server_data.servo_back_cm = data->servo_back_cm;
            }
            if(data->servo_leg_cm <= 100 && data->servo_leg_cm >= 0){
              server_data.servo_leg_cm = data->servo_leg_cm;
            }
            Serial.print("bed_mode :");
            Serial.println(server_data.bed_mode);
            Serial.print("controller_select :");
            Serial.println(server_data.controller_select);
            Serial.print("servo_top_cm :");
            Serial.println(server_data.servo_top_cm);
            Serial.print("servo_back_cm :");
            Serial.println(server_data.servo_back_cm);
            Serial.print("servo_leg_cm :");
            Serial.println(server_data.servo_leg_cm);
            Serial.println("get data form server");
          } break;
        }
        cur_buffer_length = -1;
      }
    }
  }
  light_led_follow_mode();
//  light_led_by_position();
}
