#include <Chrono.h>
#include <LightChrono.h>

#include <Button.h>
#include <Servo.h>

#define PLAY_BTN 4
#define DIR_BTN 5

Button btn = Button(4, true);
Button btn2 = Button(5, true);

Servo myservo;

Chrono timer;

boolean moving = false;
boolean forward = true;

int speed = 4;

const int TOTAL_TIME = 2800;
const int TOTAL_BACK_TIME = 2500;

void setup() {
  Serial.begin(9600);

  myservo.attach(9);
  ledSetup();
  
  Serial.println("Ready");
  myservo.write(90);
}

//============

void loop() {
  btn.update(onButtonStatechange);
  btn2.update(onButtonStatechange);

  if (moving) {
    myservo.write(forward ? (90 + speed) : (90 - speed));
  }
    
  updateLeds();

  if ((forward && timer.hasPassed(TOTAL_TIME)) || (!forward && timer.hasPassed(TOTAL_BACK_TIME))) {
    stopMoving();
  }
}

//============

void onButtonStatechange(int pin, int eventType) {
//  Serial.print(pin);
//  Serial.print(", ");
//  Serial.println(eventType);
  
  switch (eventType) {
    case Button::TAP:
      if (pin == DIR_BTN) {
        forward = !forward;
      }
      if (pin == PLAY_BTN) {
        if (!moving) {
          startMoving();
        } else {
          stopMoving();
        }
      }
      break;
  }
}

void startMoving() {
  moving = true;

  timer.restart();
}

void stopMoving() {
  myservo.write(90);
  timer.stop();
  moving = false;
}
