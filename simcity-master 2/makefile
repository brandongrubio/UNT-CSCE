CC = g++										#compiler
CFLAGS = -Wall -std=c++11						#compiler flags
SRCS = testing.cpp functions.cpp cell.cpp		#source files
OBJS = $(SRCS:.cpp=.o)							#object files
TARGET = SimCity.exe							#naming the executable

#building executable
$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o $(TARGET)

#compile source files to object files
testing.o: testing.cpp functions.h cell.h
	$(CC) $(CFLAGS) -c testing.cpp -o testing.o

functions.o: functions.cpp functions.h cell.h
	$(CC) $(CFLAGS) -c functions.cpp -o functions.o

cell.o: cell.cpp cell.h
	$(CC) $(CFLAGS) -c cell.cpp -o cell.o

#clean up object files and executable
clean:
	rm -f $(OBJS) $(TARGET)
