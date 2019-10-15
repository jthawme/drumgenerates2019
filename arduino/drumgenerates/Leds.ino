#include <Adafruit_NeoPixel.h>

#define LED_PIN 6
#define LED_COUNT 12
#define LED_ON_TIME 100
#define ALIVE_NUM 99

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];

boolean newData = false;

// Set an array for catching all the times
unsigned long times[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };

// Set a color for each LED
uint32_t colors[] = {
  strip.Color(255,0,0),
  strip.Color(0,255,0),
  strip.Color(0,0,255),
  strip.Color(255,0,0),
  strip.Color(0,255,0),
  strip.Color(0,0,255),
  strip.Color(255,0,0),
  strip.Color(0,255,0),
  strip.Color(0,0,255),
  strip.Color(255,0,0),
  strip.Color(0,255,0),
  strip.Color(0,0,255),
};



void ledSetup() {
  strip.begin();
  strip.show();
  strip.setBrightness(50);
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
      int val = atoi(strtokIndx);
      strtokIndx = strtok(NULL,",");

      if (val < LED_COUNT) {
        times[val] = millis();
      } else if (val == ALIVE_NUM) {
        Serial.println("Alive");
      }
    }
}



void updateLeds() {
    recvWithStartEndMarkers();
//    
    if (newData == true) {
        strcpy(tempChars, receivedChars);
        parseData();
        newData = false;
    }
//
    unsigned long now = millis();

    // Clears all LEDs first
    strip.clear();
//
    // Spins through all LEDs to check if there time is less than the interval
    // and turns them on if so
    for (int i = 0; i < LED_COUNT; i++) {

      // If the time (plus the interval) is still greater than the current time
      // turn the pixel on
      if (times[i] + LED_ON_TIME > now) {
        strip.setPixelColor(i, colors[i]);
      }
    }
//
    strip.show();
}
