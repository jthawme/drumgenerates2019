#include <Adafruit_NeoPixel.h>

#define LED_PIN 6
#define LED_COUNT 8

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];

boolean newData = false;

// Set an array for catching all the times
unsigned long times[] = { 0, 0, 0, 0, 0, 0, 0, 0 };

// Set a color for each LED
uint32_t colors[][3] = {
  {255,0,0},
  {0,255,0},
  {0,0,255},
  {255,0,0},
  {0,255,0},
  {0,0,255},
  {255,0,0},
  {0,255,0},
};

int interval = 150;

void setup() {
  Serial.begin(9600);
//  
  strip.begin();
  strip.show();
  strip.setBrightness(50);
  
  Serial.println("Ready");
}

//============

void loop() {
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
      if (times[i] + interval > now) {
        strip.setPixelColor(i, colors[i][0], colors[i][1], colors[i][2]);
      }
    }

    strip.show();
    delay(50);
}

//============

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
      
      times[val] = millis();
    }
    strip.show();
}
