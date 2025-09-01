#include <unordered_set>
#include <string>
#include <cstdlib>
#include <utility>
#include <iostream>
#include "cell.h"

#ifndef FUNCS_H
#define FUNCS_H

using namespace std;
//all the void functions
void arrCounter(int& arrY, int& arrX, char ch, string regionFile);
void readConfig(string configFile, string& regionFile, int& timeLimit, int& refreshRate);
void populateCity(Cell city[][MAX_X], const string& regionFile, int arrY, int arrX);
void printInitialRegion(Cell city[][MAX_X], int arrY, int arrX, int scale);
void printNewRegion(Cell city[][MAX_X], int arrY, int arrX, int scale);

void runResidential(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX, int& workers, int& goods, int t);
void runIndustrial(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX, int& workers, int& goods, int t);
void runCommercial(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX, int& workers, int& goods, int t);
void runPollution(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX);
void runEntertain(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX, int& workers, int t);

void Simulate(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX, int scale, int refreshRate, int timeLimit, int& workers, int& goods);

void Analyze(Cell city[][MAX_X], int arrY, int arrX);

#endif
