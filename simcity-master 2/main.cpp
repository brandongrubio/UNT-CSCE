#include <iostream>
#include <fstream>
#include <unordered_set>
#include "Simulate.h"
#include "cell.h"

using namespace std;

int main() {

    ifstream fin;

    string regionFile;
    string configFile;

    int timeLimit;
    int refreshRate;
    int arrX = 0;
    int arrY = 0;
    int scale = 1;
    int workers = 0;
    int goods = 0;
    char ch = '\0';

    cout << "\nEnter the configuration file you'd like to open:";
    cin >> configFile;
    //configFile = "configuration.txt";

    readConfig(configFile, regionFile, timeLimit, refreshRate); //reads configuration file and stores items
    arrCounter(arrY, arrX, ch, regionFile); //sets the dimensitons of the regions x and y values

    Cell city[MAX_Y][MAX_X];    //initializes the city
    Cell tempCity[MAX_Y][MAX_X];    //used to update city

    populateCity(city, regionFile, arrY, arrX); //populates the city according to the character in that cell
    Simulate(city, tempCity, arrY, arrX, scale, refreshRate, timeLimit, workers, goods);   //heart of the code, runs the simulation from 0 to timestep
    Analyze(city, arrY, arrX);  //analyzes a closer portion of the city and outputs totals for residential, indsutrial, commercial, and total population

    return 0;
}
