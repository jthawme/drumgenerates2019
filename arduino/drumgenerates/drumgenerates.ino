#include <Button.h>
#include <Servo.h>

#define PLAY_BTN 4
#define DIR_BTN 5

Button btn = Button(4, true);
Button btn2 = Button(5, true);

Servo myservo;

boolean moving = false;
boolean forward = true;

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
    myservo.write(forward ? 95 : 85);
  }
    
  updateLeds();
}

//============

void onButtonStatechange(int pin, int eventType) {
  Serial.print(pin);
  Serial.print(", ");
  Serial.println(eventType);
  
  switch (eventType) {
    case Button::TAP:
      if (pin == DIR_BTN) {
        forward = !forward;
      }
      if (pin == PLAY_BTN) {
        moving = !moving;

        if (!moving) {
          myservo.write(90);
        }
      }
      break;
  }
}
