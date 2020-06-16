#include <Adafruit_NeoPixel.h>

#define LED_PIN 6
#define LED_COUNT 6
#define ALIVE_NUM 99
#define START_NUM 98
#define DIR_NUM 97

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];

boolean newData = false;

// Set an array for catching all the times
bool lights[] = { false, false, false, false, false, false };

// Set a color for each LED
uint32_t colors[] = {
  strip.Color(77,61,154),
  strip.Color(247,105,117),
  strip.Color(255,255,255),
  strip.Color(239,240,221),
  strip.Color(232,91,48),
  strip.Color(239,158,40),
  strip.Color(39,44,63),
  strip.Color(89,111,126),
  strip.Color(234,230,199),
  strip.Color(70,60,33),
  strip.Color(244,203,76),
  strip.Color(104,127,114)
};



void ledSetup() {
  strip.begin();
  strip.show();
  strip.setBrightness(30);
}



void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    char startMarker = '<';
    char endMarker = '>';
    char rc;

    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                receivedChars[ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            }
            else {
                receivedChars[ndx] = '\0'; // terminate the string
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}




//============

void parseData() {
    char * strtokIndx;

    strtokIndx = strtok(tempChars,",");

    while (strtokIndx != NULL) {
      int val = (int) strtokIndx[0] - 48;
      int on = (int) strtokIndx[1] - 48;
      Serial.println(val);
      Serial.println(on);
      strtokIndx = strtok(NULL,",");

      if (val < LED_COUNT) {
        if (on == 0){
          lights[val] = false;
        } else {
          lights[val] = true;
        }
      } else if (val == START_NUM) {
        startMoving();
      } else if (val == ALIVE_NUM) {
        Serial.println("Alive");
      } else if (val == DIR_NUM) {
        forward = !forward;
      }
    }
}



void updateLeds() {
    recvWithStartEndMarkers();

    if (newData == true) {
        strcpy(tempChars, receivedChars);
        parseData();
        newData = false;
    }

    unsigned long now = millis();

    // Clears all LEDs first
    strip.clear();

    // Spins through all LEDs to check if there time is less than the interval
    // and turns them on if so
    for (int i = 0; i < LED_COUNT; i++) {

      // If the time (plus the interval) is still greater than the current time
      // turn the pixel on
      if (lights[i]) {
        strip.setPixelColor(i, colors[i]);
      }
    }

    strip.show();
}
