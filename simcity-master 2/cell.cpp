#include <iostream>
#include "cell.h"
using namespace std;

Cell::Cell() {
	type = ' ';
	pollution = 0;//set to 0        
	population = 0;//set to 0
        money = 0;//set to 0
        scale = 0;//set to 0
        rate = false;
}

int Cell::getMoney() const {
        return money;
}

void Cell::setMoney(int newMoney) {
        money = newMoney;
}

char Cell::getType() const {
	return type;
}

void Cell::setType(char newType) {
	type = newType;
}

int Cell::getPollution() const {
	return pollution;
}

void Cell::setPollution(int newPollution) {
	pollution = newPollution;
}

int Cell::getPop() const {
	return population;
}

void Cell::setPop(int newPop) {
	population = newPop;
}

bool Cell::getRate() const {
        return rate;
}

void Cell::setRate(bool newRate) {
        rate = newRate;
}

bool Cell::hasPower(int arrX, int arrY, Cell city[][MAX_X]) {
	const int dx[] = {-1, -1, -1, 0, 1, 1, 1, 0};
	const int dy[] = {-1, 0, 1, 1, 1, 0, -1, -1};

	for(int i = 0; i < 8; i++) {
		int newX = arrX+dx[i];
		int newY = arrY+dy[i];

		if(newX >=0 && newX < MAX_X && newY >= 0 && newY < MAX_Y) {

			if((city[newY][newX].type == 'T' || city[newY][newX].type == '#') && city[arrY][arrX].type != ' ') {
				return true;
			}
		}
	}

	return false;
}
//checking for nearby cell population
int Cell::checkMinNeighborPopulation(Cell city[][MAX_X], int currX, int currY, int arrX, int arrY) {

	int count = 0;
	int MIN_POP_REQ = 0;

	if(population == 0) {MIN_POP_REQ=1;}
	if(population == 1) {MIN_POP_REQ=1;}
	if(population == 2) {MIN_POP_REQ=2;}
	if(population == 3) {MIN_POP_REQ=3;}
	if(population == 4) {MIN_POP_REQ=4;}

	int dx[] = {-1, -1, -1, 0, 0, 1, 1, 1};
	int dy[] = {-1, 0, 1, -1, 1, -1, 0, 1};

	for(int i = 0; i < 8; i++) {
		int newX = currX+dx[i];
		int newY = currY+dy[i];

		if(newX >= 0 && newX < arrX && newY >= 0 && newY < arrY && city[newY][newX].population >= MIN_POP_REQ) {
			count++;
		}
	}
	return count;
}


int Cell::checkMinNeighborPollution(Cell city[][MAX_X], int currX, int currY, int arrX, int arrY) {

        int count = 0;
        int MIN_POLL_REQ = 0;

        if(pollution == 0) {MIN_POLL_REQ=1;}
        if(pollution == 1) {MIN_POLL_REQ=1;}
        if(pollution == 2) {MIN_POLL_REQ=2;}
        if(pollution == 3) {MIN_POLL_REQ=3;}
        if(pollution == 4) {MIN_POLL_REQ=4;}

        int dx[] = {-1, -1, -1, 0, 0, 1, 1, 1};
        int dy[] = {-1, 0, 1, -1, 1, -1, 0, 1};

        for(int i = 0; i < 8; i++) {
                int newX = currX+dx[i];
                int newY = currY+dy[i];

                if(newX >= 0 && newX < arrX && newY >= 0 && newY < arrY && city[newY][newX].pollution >= MIN_POLL_REQ) {
                        count++;
                }
        }
        return count;
}

bool Cell::updateResidential(Cell city[][MAX_X], Cell tempCity[][MAX_X], int currX, int currY, int arrX, int arrY, int& workers, int& goods) {
	int adjacentCellCount = checkMinNeighborPopulation(city, currX, currY, arrX, arrY);

	 //int pollution = getPop();
            //int population = getPop();
        if(rate = true) {
             if (population == 0 && hasPower(currX, currY, city) && getType() == 'R') {
                    population += 2; //add population by one
		    workers += 2;
            } else if (population == 0 && adjacentCellCount >= 1 && getType() == 'R') {
                    population += 2;
		    workers += 2;
            }
            // Check if the current cell's population is 1 and it's adjacent to at least two cells with a population of at least 1
            if (population == 1 && adjacentCellCount >= 2 && getType() == 'R') {
                population += 2;
		workers += 2;
            }
            if (population == 2 && adjacentCellCount >= 4 && getType() == 'R') {
                    population += 2;
		    workers += 2;
            }   
        } else {
            if (population == 0 && hasPower(currX, currY, city) && getType() == 'R') {
                    population += 1; //add population by one
		    workers += 1;
            } else if (population == 0 && adjacentCellCount >= 1 && getType() == 'R') {
                    population += 1;
		    workers += 1;
            }
            // Check if the current cell's population is 1 and it's adjacent to at least two cells with a population of at least 1
            if (population == 1 && adjacentCellCount >= 2 && getType() == 'R') {
                population += 1;
		workers += 1;
            }
            if (population == 2 && adjacentCellCount >= 4 && getType() == 'R') {
                    population += 1;
		    workers += 1;
            }
        }
            return true;

}

bool Cell::updateIndustrial(Cell city[][MAX_X], Cell tempCity[][MAX_X], int currX, int currY, int arrX, int arrY, int& workers, int& goods) {
        int adjacentCellCount = checkMinNeighborPopulation(city, currX, currY, arrX, arrY);

	//int pollution = getPop();
            //int population = getPop();
        if(rate == true) {
             if (population == 0 && hasPower(currX, currY, city) && getType() == 'I') {
                    if (workers >= 2) {     // Check if there are at least 2 available workers
                    workers -= 2;       // Assign workers to the job
                    population += 2;
                    goods += 2; // Increase goods produced
                    }
            } else if (population == 0 && adjacentCellCount >= 1 && workers >= 2 && getType() == 'I') {
                    workers-= 2;
                    population += 2;
                    goods += 2; // Increase goods produced
            }
            // Check if the current cell's population is 1 and it's adjacent to at least two cells with a population of at least 1
            if (population == 1 && adjacentCellCount >= 2 && workers >= 2 && getType() == 'I') {
                workers -= 2;
                population += 2;
                goods += 2;
            }
            if (population == 2 && adjacentCellCount >= 4 && workers >= 2 && getType() == 'I') {
                    population += 2;
                    workers -= 2;
                    goods += 2;
            }
            // Get the count of neighboring cells meeting the minimum pollution requirement
            int power = 4;
                if (population == 0 && hasPower(currX, currY, city) && getType() == 'I') {
                        money = money + pow(2,power);
                        population += 2;
                        ++power;
                        if (money >= 10) {
                                workers += 2;
                                money -= 10; 
                        } 
                } else if (population == 0 && workers >= 0 && getType() == 'I') {
                        money = money + pow(2,power);
                        ++power;
                        if (money >= 10) {
                                workers += 2;
                                money -= 10; 
                        }
                }
                if (population == 1 && workers >= 1 && getType() == 'I') {
                        money = money + pow(2, power);
                        ++power;
                        if (money >= 10) {
                                workers += 2;
                                money -= 10; 
                        }
                }
                if (population == 2 && adjacentCellCount >= 2 && workers >= 1 && getType() == 'I') {
                        money = money + pow(2, power);
                        ++power;
                        if (money >= 10) {
                                workers += 2;
                                money -= 10; 
                        }
                }
                if (population == 3 && workers >= 2 && getType() == 'I') {
                        money = money + pow(2, power);
                        ++power;
                        if (money >= 10) {
                                workers += 2;
                                money -= 10; 
                        }
                }
                if (population == 4 && workers >= 2 && getType() == 'I') {
                        money = money + pow(2, power);
                        ++power;
                        if (money >= 10) {
                                workers += 2;
                                money -= 10; 
                        }
                }
                if (population == 5 && workers >= 2 && getType() == 'I') {
                        money = money + pow(2, power);
                        ++power;
                        if (money >= 10) {
                                workers += 2;
                                money -= 10; 
                        }
                }   
        } else {
            if (population == 0 && hasPower(currX, currY, city) && getType() == 'I') {
                    if (workers >= 2) {     // Check if there are at least 2 available workers
                    workers -= 2;       // Assign workers to the job
                    population += 1;
                    goods++; // Increase goods produced
                    }
            } else if (population == 0 && adjacentCellCount >= 1 && workers >= 2 && getType() == 'I') {
                    workers-= 2;
                    population += 1;
                    goods++; // Increase goods produced
            }
            // Check if the current cell's population is 1 and it's adjacent to at least two cells with a population of at least 1
            if (population == 1 && adjacentCellCount >= 2 && workers >= 2 && getType() == 'I') {
                workers -= 2;
                population += 1;
                goods++;
            }
            if (population == 2 && adjacentCellCount >= 4 && workers >= 2 && getType() == 'I') {
                    population += 1;
                    workers -= 2;
                    goods++;
            }
            // Get the count of neighboring cells meeting the minimum pollution requirement
            int power = 4;
                if (population == 0 && hasPower(currX, currY, city) && getType() == 'I') {
                        money = money + pow(2,power);
                        population += 1;
                        ++power;
                        if (money >= 10) {
                                workers += 1;
                                money -= 10; 
                        } 
                } else if (population == 0 && workers >= 0 && getType() == 'I') {
                        money = money + pow(2,power);
                        ++power;
                        if (money >= 10) {
                                workers += 1;
                                money -= 10; 
                        }
                }
                if (population == 1 && workers >= 1 && getType() == 'I') {
                        money = money + pow(2, power);
                        ++power;
                        if (money >= 10) {
                                workers += 1;
                                money -= 10; 
                        }
                }
                if (population == 2 && adjacentCellCount >= 2 && workers >= 1 && getType() == 'I') {
                        money = money + pow(2, power);
                        ++power;
                        if (money >= 10) {
                                workers += 1;
                                money -= 10; 
                        }
                }
                if (population == 3 && workers >= 2 && getType() == 'I') {
                        money = money + pow(2, power);
                        ++power;
                        if (money >= 10) {
                                workers += 1;
                                money -= 10; 
                        }
                }
                if (population == 4 && workers >= 2 && getType() == 'I') {
                        money = money + pow(2, power);
                        ++power;
                        if (money >= 10) {
                                workers += 1;
                                money -= 10; 
                        }
                }
                if (population == 5 && workers >= 2 && getType() == 'I') {
                        money = money + pow(2, power);
                        ++power;
                        if (money >= 10) {
                                workers += 1;
                                money -= 10; 
                        }
                }
        }
            return true;
}

bool Cell::updateCommercial(Cell city[][MAX_X], Cell tempCity[][MAX_X], int currX, int currY, int arrX, int arrY, int& workers, int& goods) {
        int adjacentCellCount = checkMinNeighborPopulation(city, currX, currY, arrX, arrY);

	//check if cell population is 0, if there are workers and goods, and if adjacent to power
        if (rate == true) {
            if (population == 0 && workers >= 1 && goods >= 1 && hasPower(currX, currY, city) && getType() == 'C') {
                workers -= 1; //assign workers to the job
                goods -= 1; // assign goods to the job
                population += 2;
	}
	//check if cell pop is 0, if there are workers and goods, and if adjacent to a cell with a pop of 1
	else if (population == 0 && workers >= 1 && goods >= 1 && adjacentCellCount >= 1 && getType() == 'C') {
                workers -= 1; //assign workers to the job
                goods -= 1; // assign goods to the job
                population += 2;
	}
	//check if cell pop is 1, if there are workers and goods, and if adjacent to two or more cells with population of 2
	if (population == 1 && workers >= 1 && goods >= 1 && adjacentCellCount >= 2 && getType() == 'C') {
                workers -= 1; //assign workers to the job
                goods -= 1; // assign goods to the job
                population += 2;
	}
        if(population > 1 && workers >= 1 && goods >= 1 &&adjacentCellCount >= 2 && getType() == 'C'){
                if(population == 3 || population == 6){
                        if(population == 3){
                                if(money >= 5){
                                        updateBusinessScale(2);
                                }
                        }
                        if(population == 6){
                                if(money >= 10){
                                        updateBusinessScale(3);
                                }
                        }
                }
                if(scale == 1){
                        if(population < 3 && workers >= 1 && goods >= 1 &&adjacentCellCount >= 2 && getType() == 'C'){
                                workers -= 1; //assign workers to the job
                                goods -= 1; // assign goods to the job
                                population += 2;
                        }
                }
                if(scale == 2){
                        if(population < 6 && workers >= 1 && goods >= 1 &&adjacentCellCount >= 2 && getType() == 'C'){
                                workers -= 2; //assign workers to the job
                                goods -= 2; // assign goods to the job
                                population += 2;
                        }
                }
                if(scale == 3){
                        if(population > 6 && workers >= 1 && goods >= 1 &&adjacentCellCount >= 2 && getType() == 'C'){
                                workers -= 3; //assign workers to the job
                                goods -= 3; // assign goods to the job
                                if(population < 10){
                                        population += 2;
                                }
                        }
                
                }
                
        }    
        } else {
	if (population == 0 && workers >= 1 && goods >= 1 && hasPower(currX, currY, city) && getType() == 'C') {
                workers -= 1; //assign workers to the job
                goods -= 1; // assign goods to the job
                population += 1;
	}
	//check if cell pop is 0, if there are workers and goods, and if adjacent to a cell with a pop of 1
	else if (population == 0 && workers >= 1 && goods >= 1 && adjacentCellCount >= 1 && getType() == 'C') {
                workers -= 1; //assign workers to the job
                goods -= 1; // assign goods to the job
                population += 1;
	}
	//check if cell pop is 1, if there are workers and goods, and if adjacent to two or more cells with population of 2
	if (population == 1 && workers >= 1 && goods >= 1 && adjacentCellCount >= 2 && getType() == 'C') {
                workers -= 1; //assign workers to the job
                goods -= 1; // assign goods to the job
                population += 1;
	}
        if(population > 1 && workers >= 1 && goods >= 1 &&adjacentCellCount >= 2 && getType() == 'C'){
                if(population == 3 || population == 6){
                        if(population == 3){
                                if(money >= 5){
                                        updateBusinessScale(2);
                                }
                        }
                        if(population == 6){
                                if(money >= 10){
                                        updateBusinessScale(3);
                                }
                        }
                }
                if(scale == 1){
                        if(population < 3 && workers >= 1 && goods >= 1 &&adjacentCellCount >= 2 && getType() == 'C'){
                                workers -= 1; //assign workers to the job
                                goods -= 1; // assign goods to the job
                                population += 1;
                        }
                }
                if(scale == 2){
                        if(population < 6 && workers >= 1 && goods >= 1 &&adjacentCellCount >= 2 && getType() == 'C'){
                                workers -= 2; //assign workers to the job
                                goods -= 2; // assign goods to the job
                                population += 1;
                        }
                }
                if(scale == 3){
                        if(population > 6 && workers >= 1 && goods >= 1 &&adjacentCellCount >= 2 && getType() == 'C'){
                                workers -= 3; //assign workers to the job
                                goods -= 3; // assign goods to the job
                                if(population < 10){
                                        population += 1;
                                }
                        }
                
                }
                
        }
        }
return true;
}
bool Cell::updatePollution(Cell city[][MAX_X], Cell tempCity[][MAX_X], int currX, int currY, int arrX, int arrY) {
        int adjacentCellCount = checkMinNeighborPollution(city, currX, currY, arrX, arrY);
    // setting the population equal to the pollution
            if (population >= 1 && getType() == 'I'){
                    pollution = population;
            }
            //checking the pollution in other cells to have pollution spread
            if(population == 0 && adjacentCellCount > 0 && getType() == 'I'){
                    pollution = (adjacentCellCount - 1);
            }

	    if(population == 0 && adjacentCellCount > 0 && getType() == '-'){
                    pollution = (adjacentCellCount - 1);
	    }
        /*
        double resedentialPollution = population / pollution;
        double industrialPollution = workers / pollution;
        double commercialPollution = goods / pollution;
        
        int resedentialHospitals = resedentialPollution / 2;
        int industrialHospitals = industrialHospitals / 2;
        int commercialPollution = commercialPollution / 2;
        
        int resedentialIndex = 0;
        int industrialIndex = 0;
        int commercialIndex = 0;
        
        if (resedentialIndex > population && getType() == 'R'){
                resedentialIndex = population;
        }
        
        if (indusrialIndex > pollution && getType() == 'I'){
                indusrialIndex = pollution;
        }
        
        if (commercialIndex > population && getType() == 'C'){
                commercialIndex = population;
        }
        
        if (resedentialIndex = population && getType() == 'R'){
                ;
        }
        if (indusrialIndex = pollution && getType() == 'I'){
                ;
        }
        
        if (commercialIndex = population && getType() == 'C'){
                ;
        }*/
    return true;
}

bool Cell::updateEntertain(Cell city[][MAX_X], Cell tempCity[][MAX_X], int currX, int currY,>

        if(population == 0 && workers >= 4 && hasPower(currX, currY, city) && getType() == '>
                workers = workers - 4;
                population += 1;
                rate = true;
        }

return true;
}
