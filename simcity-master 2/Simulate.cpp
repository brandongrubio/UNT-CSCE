#include "cell.h"
#include "Simulate.h"
#include <algorithm>
#include <time.h>
#include <fstream>
#include <random>
#include <vector>
#include <string>
#include <unordered_set>

using namespace std;


//opens the file given by user
void arrCounter(int& arrY, int& arrX, char ch, string regionFile) {
	ifstream fin;
	fin.open(regionFile);
	if (fin.fail()) {			
		cout << "Could not open region file." << endl;
		exit(1);
	}

	fin.get(ch);
	while(ch != '\n') {
		if(ch != ',') {
			arrX++;		//gets the regions x value
		}
		fin.get(ch);
	}
	fin.close();
	fin.open(regionFile);

	while(!fin.eof()) {
		fin.get(ch);
		if(ch == '\n') {	//gets the regions y value
			arrY++;
		}
	}
	arrY++;
	fin.close();
}
//reads the configuration file 
void readConfig(string configFile, string& regionFile, int& timeLimit, int& refreshRate) {
	ifstream fin;
	fin.open(configFile);

	if(fin.fail()) {
		cout << "Couldn't open config file." << endl;
		exit(1);
	}
	fin.ignore(20, ':');
	fin >> regionFile;
	fin.ignore(20, ':');
	fin >> timeLimit;
	fin.ignore(20, ':');
	fin >> refreshRate;
}
//function for grabbing the region file
void populateCity(Cell city[][MAX_X], const string& regionFile, int arrY, int arrX) {
	ifstream fin;
	fin.open(regionFile);
	if(fin.fail()) {
		cout << "Couldn't open region file" << endl;
		exit(1);
	}

	char ch;
	
	for(int i = 0; i < arrY; i++) {
		for(int j = 0; j < arrX; j++) {	//iterates through region and stores the type and character in that coordinate of city
			Cell cell;
			cell.setType(' ');
			cell.setPollution(0);
			cell.setPop(0);	//defaults are set for type, pollution, and population
			fin.get(ch);

			switch(ch) {
				//all cases for all the types of cells for the output of the initial map
				case ' ':
					cell.setType(ch);
					city[i][j] = cell;
				break;

				case 'C':
					cell.setType(ch);
					city[i][j] = cell;
				break;

				case 'R':
					cell.setType(ch);
					city[i][j] = cell;
				break;

				case 'T':
					cell.setType(ch);
					city[i][j] = cell;
				break;

				case 'P':
					cell.setType(ch);
					city[i][j] = cell;
				break;

				case '#':
					cell.setType(ch);
					city[i][j] = cell;
				break;

				case '-':
					cell.setType(ch);
					city[i][j] = cell;
				break;

				case 'I':
					cell.setType(ch);
					city[i][j] = cell;
				break;

				case ',':
					j--;
				break;

				default:
				break;
			}
		}
		fin.ignore();
	}
	cout << '\n';
}
void sortIndustrialMoney(Cell city[][MAX_X], int arrY, int arrX) {
    int moneyMatrix[MAX_X * MAX_X];	//array to store money values
    int count = 0;	//counter for array of money

    for (int i = 0; i < arrY; i++) {
        for (int j = 0; j < arrX; j++) {
            if (city[i][j].getType() == 'I') {	//adds money value to array for sorting later
                moneyMatrix[count++] = city[i][j].getMoney();
            }
        }
    }

    for (int i = 0; i < count - 1; i++) {
        for (int j = 0; j < count - i - 1; j++) {
            if (moneyMatrix[j] > moneyMatrix[j + 1]) {
                int temp = moneyMatrix[j];	//sort the money values using the new moneyMatrix array
                moneyMatrix[j] = moneyMatrix[j + 1];	//use bubble sort
                moneyMatrix[j + 1] = temp;
            }
        }
    }

    for (int i = 0; i < count; i++) {
        cout << moneyMatrix[i] << " ";	//print the final sorted array
    }
}

void printInitialRegion(Cell city[][MAX_X], int arrY, int arrX, int scale) {
	for(int i = 0; i < arrY; i++) {
		for(int j = 0; j < arrX; j++) {		//prints initial region before any changes/updates have been made
			if(city[i][j].getPop() == 0) {
				cout << city[i][j].getType() << " ";
			} else if(city[i][j].getType() == 'I') {
				cout << city[i][j].getPop() << "(" << city[i][j].getMoney() << ")";
			} else if(city[i][j].getType() == 'C' || city[i][j].getType() == 'S'|| city[i][j].getType() == 'M' || city[i][j].getType() == 'L') {
				if(scale == 1){
					cout << city[i][j].getPop() << "(" << 'S' << ")";
				}
				if(scale == 2){
					cout << city[i][j].getPop() << "(" << 'M' << ")";
				}
				if(scale == 3){
					cout << city[i][j].getPop() << "(" << 'L' << ")";
				}
			} else {
				cout << city[i][j].getPop() << " ";
			}
		}
		cout << endl;
	}
	cout << endl;
}

void printNewRegion(Cell city[][MAX_X], int arrY, int arrX, int scale) {
	for(int i = 0; i < arrY; i++) {
		for(int j = 0; j < arrX; j++) {		//prints the new region updated from tempCity[i][j]
			if(city[i][j].getPop() == 0) {
				cout << city[i][j].getType() << " ";
			} else if(city[i][j].getType() == 'I') {
				cout << city[i][j].getPop() << "(" << city[i][j].getMoney() << ")";
			} else if(city[i][j].getType() == 'C' || city[i][j].getType() == 'S'|| city[i][j].getType() == 'M' || city[i][j].getType() == 'L') {
				if(scale == 1){
					cout << city[i][j].getPop() << "(" << 'S' << ")";
				}
				if(scale == 2){
					cout << city[i][j].getPop() << "(" << 'M' << ")";
				}
				if(scale == 3){
					cout << city[i][j].getPop() << "(" << 'L' << ")";
				}
			} else {
				cout << city[i][j].getPop() << " ";
			}
		}
		cout << endl;
	}
	cout << endl;
}

void printPollution(Cell city[][MAX_X], int arrY, int arrX) {
	cout << "Pollution:\n" << endl;

	for(int i = 0; i < arrY; i++) {		//outputs the pollution for the region
		for (int j = 0; j < arrX; j++) {
			if(city[i][j].getType() == ' ') {
				cout << " " << " ";
			} else {
				cout << city[i][j].getPollution() << " ";
			}
		}
		cout << endl;
	}
	cout << endl;
}
//void func to run residential 
void runResidential(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX, int& workers, int& goods, int t) {
	for(int i = 0; i < arrY; i++) {
		for(int j = 0; j < arrX; j++) {//itirates through the region
			if(t == 1) {
				if (tempCity[i][j].getPop() == 0 && tempCity[i][j].hasPower(j, i, city) && tempCity[i][j].getType() == 'R') {
					tempCity[i][j].setPop(1);
					workers++;
				}
			} else {
				tempCity[i][j].updateResidential(city, tempCity, j, i, arrX, arrY, workers, goods);
			}
		}
	}
}

void runIndustrial(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX, int& workers, int& goods, int t) {
        for(int i = 0; i < arrY; i++) {
                for(int j = 0; j < arrX; j++) {	//iterates through region
                        if(t == 2) {	//indsutrial does not change in the second time step so this has been isolated from the rest
                                if (tempCity[i][j].getPop() == 0 && tempCity[i][j].hasPower(j, i, city) && tempCity[i][j].getType() == 'R' && workers >= 2) {
                                        tempCity[i][j].setPop(1);
					tempCity[i][j].setPollution(1);
                                        workers -= 2;
					goods++;
					return;
                                }
                        } else {
                                tempCity[i][j].updateIndustrial(city, tempCity, j, i, arrX, arrY, workers, goods);	//updates industrial 
								runCommercial(city, tempCity, arrY, arrX, workers, goods, t); //reevaluates commercial after industrial
                        }
                }
        }
}

void runCommercial(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX, int& workers, int& goods, int t) {
        for (int i = 0; i < arrY; ++i) { // iterate and parse through region
        	for (int j = 0; j < arrX; ++j) {
                	if(t == 3) { // until third time step
                		if (tempCity[i][j].getPop() == 0 && tempCity[i][j].hasPower(j, i, city) && tempCity[i][j].getType() == 'C' && workers >= 1 && goods >= 1) {
                        		tempCity[i][j].setPop(1);
					workers--;
                        		goods--;
                                	return;
                   	 	 }
							 if (tempCity[i][j].getPop() == 0 && tempCity[i][j].hasPower(j, i, city) && tempCity[i][j].getType() == 'S' && workers >= 1 && goods >= 1) {
                        		tempCity[i][j].setPop(1);
					workers--;
                        		goods--;
                                	return;
                   	 	 }
							 if (tempCity[i][j].getPop() == 0 && tempCity[i][j].hasPower(j, i, city) && tempCity[i][j].getType() == 'M' && workers >= 1 && goods >= 1) {
                        		tempCity[i][j].setPop(1);
					workers--;
                        		goods--;
                                	return;
                   	 	 }
							 if (tempCity[i][j].getPop() == 0 && tempCity[i][j].hasPower(j, i, city) && tempCity[i][j].getType() == 'L' && workers >= 1 && goods >= 1) {
                        		tempCity[i][j].setPop(1);
					workers--;
                        		goods--;
                                	return;
                   	 	 }
                	 } else {
                    		 tempCity[i][j].updateCommercial(city, tempCity, j, i, arrX, arrY, workers, goods);
               		 }
                }
        }
}

void runPollution(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX) {
	for(int i = 0; i < arrY; i++) {
		for(int j = 0; j < arrX; j++) {
			tempCity[i][j].updatePollution(city, tempCity, j, i, arrX, arrY);
		}
	}
}

void Simulate(Cell city[][MAX_X], Cell tempCity[][MAX_X], int arrY, int arrX, int scale, int refreshRate, int timeLimit, int& workers, int& goods) {
	int noChangeCount = 0; //counts sequential frames of no change

	for(int t = 0; t < timeLimit; t++) {
		system("clear");
		bool noChange = true;

		for (int i = 0; i < arrY; i++) {	//updates tempCity for it to be changed in the runResiential, runIndustrial, and runCommercial functions
			for (int j = 0; j < arrX; j++) {
				tempCity[i][j].setType(city[i][j].getType());
				if (city[i][j].getType() == 'I') {
					tempCity[i][j].setMoney(city[i][j].getMoney());
				}
				tempCity[i][j].setPop(city[i][j].getPop());
			}
		}

		cout << "\nInitial Region:\n" << endl;
		printInitialRegion(city, arrY, arrX, scale);

		cout << "Timestep: " << t << '\n' << endl;

		runResidential(city, tempCity, arrY, arrX, workers, goods, t);
		runIndustrial(city, tempCity, arrY, arrX, workers, goods, t);
		runCommercial(city, tempCity, arrY, arrX, workers, goods, t);

		for (int i = 0; i < arrY; i++) {
			for (int j = 0; j < arrX; j++) {		//checks if changes have been made
				if(city[i][j].getPop() != tempCity[i][j].getPop()) {
					noChange = false;
				} else if(city[i][j].getMoney() != tempCity[i][j].getMoney()) {
					noChange = false;
				}
			}
		}

		for (int i = 0; i < arrY; i++) {
			for (int j = 0; j < arrX; j++) {		//updates city[i][j] from the changes made in tempCity
				city[i][j].setPop(tempCity[i][j].getPop());
				if (city[i][j].getType() == 'I') {
					city[i][j].setMoney(tempCity[i][j].getMoney());
				}
				city[i][j].setPollution(tempCity[i][j].getPollution());
			}
		}

		printNewRegion(city, arrY, arrX, scale);	//newreigon
		printPollution(city, arrY, arrX);	//pollution region

		if (t != 0) {
			cout << "\nAvailable workers: " << workers << endl;
			cout << "Available goods: " << goods << endl;		//prints available workers and goods
		}

		if (noChange && t > 0) {
			noChangeCount++;
		}
		if (noChangeCount == 2) {
			cout << "\nSimulation complete. No further changes detected.\n" << endl;
			return;
		}

		runPollution(city, tempCity, arrY, arrX);	//runs polllution to be updated in the next time step

		this_thread::sleep_for(chrono::seconds(refreshRate)); //controls delay between frames
	}
}

void Analyze(Cell city[][MAX_X], int arrY, int arrX) {
	cout << "Total region analysis:\n";

	int totalResidentPop = 0;
	int totalIndustryPop = 0;
	int totalCommercePop = 0;	//sets all to 0
	int totalPop = 0;
	int totalPollution = 0;
	int industrialMoney = 0;
	char choice;

	int minX = 0;
	int maxX = 0;
	int minY = 0;	//sets all to 0
	int maxY = 0;

	for (int i = 0; i < arrY; i++) {
		for (int j = 0; j < arrX; j++) {
			totalPop += city[i][j].getPop();
			totalPollution += city[i][j].getPollution();	//iterates through the region to get each pollution count

			if (city[i][j].getType() == 'R') {
				totalResidentPop += city[i][j].getPop();
			}
			if (city[i][j].getType() == 'C' || city[i][j].getType() == 'S'|| city[i][j].getType() == 'M' || city[i][j].getType() == 'L') {
				totalCommercePop += city[i][j].getPop();
			}
			if (city[i][j].getType() == 'I') {
				totalIndustryPop += city[i][j].getPop();
				industrialMoney += city[i][j].getMoney();
			}
		}
	}

	cout << "\nTotal Population: " << totalPop << endl;
	cout << "Total Residential Population: " << totalResidentPop << endl;
	cout << "Total Industrial Population: " << totalIndustryPop << endl;
	cout << "Total Commercial Population: " << totalCommercePop << endl;	//outputs all pollution 
	cout << "Industrial Money: "<< industrialMoney << endl;
	cout << "Total Pollution: " << totalPollution << '\n' << endl;

	totalPop = 0;
	totalResidentPop = 0;
	totalIndustryPop = 0;
	totalCommercePop = 0;	//resets pollution to 0
	totalPollution = 0;
	industrialMoney = 0;

	cout << "Would you like to analyze more specific portion of the total region? (y/n): "; //prompts user to analyze a specific portion of region
	cin >> choice;

	if (choice == 'n' || choice == 'N') {
		cout << "\nProgram complete!\n" << endl;		
		return;
	} else if (choice == 'y' || choice == 'Y') {
		cout << "\nEnter range of X coordinates to analyze. (minimum number first) " << endl;	//gets x coordinates

		do {
			if (minX < 0 || maxX > arrX) {
				cout << "Please enter valid X coordinates. Try again." << endl;		
			}
			cout << "Minimum: ";
			cin >> minX;
			cout << "Maximum: ";
			cin >> maxX;		//gets max and min of the grid to calculate populations
		} while (minX < 0 || minX > arrX || maxX < 0 || maxX > arrX || minX > maxX);

		cout << "\nNow enter in valid Y coordinates in the same manner. " << endl;

		do {
			if (minY < 0 || maxY > arrY) {
				cout << "Please enter valid Y coordinates. Try again." << endl;
			}
			cout << "Minimum: ";
			cin >> minY;
			cout << "Minimum: ";
			cin >> maxY;		//gets max and min of the grid to calculate populations
		} while (minY < 0 || minY > arrY || maxY < 0 || maxY > arrY || minY > maxY);
	}
	cout << "\nSpecified region analysis:\n";

	for (int i = minY; i < maxY; i++) {
		for (int j = minX; j < maxX; j++) {
			totalPop += city[i][j].getPop();
			totalPollution += city[i][j].getPollution();	//calculates total populations for each sector

			if (city[i][j].getType() == 'R') {
				totalResidentPop += city[i][j].getPop();
			}
			if (city[i][j].getType() == 'C' || city[i][j].getType() == 'S'|| city[i][j].getType() == 'M' || city[i][j].getType() == 'L') {
				totalCommercePop += city[i][j].getPop();
			}
			if (city[i][j].getType() == 'I') {
				totalIndustryPop += city[i][j].getPop();
				industrialMoney += city[i][j].getMoney();
			}
		}
	}

	cout << "\nSpecified Region Population: " << totalPop << endl;
	cout << "Residential Population: " << totalResidentPop << endl;	//outputs total populations for each sector and terminates
	cout << "Industrial Population: " << totalIndustryPop << endl;
	cout << "Commercial Population: " << totalCommercePop << endl;
	cout << "Industiral Money: " << industrialMoney << endl;
	cout << "Specified Region Total Pollution: " << totalPollution  << '\n' << endl;
	cout << "Program complete.\n" << endl;
	return;
}
