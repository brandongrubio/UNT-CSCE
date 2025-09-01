#include <iostream>
#include <thread>
#include <string>
#include <chrono>
#include <cmath>
using namespace std;

#ifndef CELLCLASS_H
#define CELLCLASS_H

const int MAX_X = 20; //Defining maximum X dimension
const int MAX_Y = 20; //Defining maximum Y dimension

class Cell {

	public:

		Cell();
		int getMoney() const;
		void setMoney(int newMoney);
		int getBusinessScale() const;
		void updateBusinessScale(int newScale);
		char getType() const;
		void setType(char newType);
		int getPollution() const;
		void setPollution(int newPollution);
		int getPop() const;
		void setPop(int newPop);
		bool getRate() const;
		void setRate(bool rate);
		char getResidentialStatus() const; // Declaration of getResidentialStatus
        void setResidentialStatus(char status); // Declaration of setResidentialStatus
		char ResidentialStatus;

		bool hasPower(int arrX, int arrY, Cell city[][MAX_X]); //determines if next to power for initial growth

		int checkMinNeighborPopulation(Cell city[][MAX_X], int currX, int currY, int arrX, int arrY); //determines if neighbors have population requirements
		int checkMinNeighborPollution(Cell city[][MAX_X], int currX, int currY, int arrX, int arrY); //determines if neighbors have pollution requirements


		bool updateResidential(Cell city[][MAX_X], Cell tempCity[][MAX_X], int currX, int currY, int arrX, int arrY, int& workers, int& goods);
		bool updateIndustrial(Cell city[][MAX_X], Cell tempCity[][MAX_X], int currX, int currY, int arrX, int arrY, int& workers, int& goods);
		bool updateCommercial(Cell city[][MAX_X], Cell tempCity[][MAX_X], int currX, int currY, int arrX, int arrY, int& workers, int& goods);
		bool updateEntertain(Cell city[][MAX_X], Cell tempCity[][MAX_X], int currX, int currY, int arrX, int arrY, int& workers);
		//updates population once requirements are met

		bool updatePollution(Cell city[][MAX_X], Cell tempCity[][MAX_X], int currX, int currY, int arrX, int arrY);

	private:

		char type;
		int pollution;
		int population;
		int money;
		int scale;
		bool rate;
};
#endif

