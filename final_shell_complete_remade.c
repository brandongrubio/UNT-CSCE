#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <signal.h>

#define MAX_LENGTH 513
#define MAX_HISTORY 20
#define MAX_ARGS 50

// Globals
char PATH[1024] = "/bin";
char prompt[32] = "prompt>";
char *history[MAX_HISTORY];
int history_count = 0;
char *alias[MAX_HISTORY][2];
int alias_count = 0;

// Function Prototypes
void processInteractiveMode();
void processBatchMode(const char *filename);
void executeCommand(char *input);
void handleRedirection(char *input);
void handlePipes(char *input);
void addHistory(char *command);
void manageAlias(char *input);
void executeAlias(char *alias_name);

// Built-In Commands
void builtInCD(char *path);
void builtInExit();
void builtInPath(char *input);
void builtInMyHistory(char *input);

// Signal Handling
void signalHandler(int signo) {
    printf("\nCaught signal %d\n", signo);
    fflush(stdout);
}

int main(int argc, char *argv[]) {
    signal(SIGINT, signalHandler);
    signal(SIGTSTP, signalHandler);

    if (argc > 2) {
        fprintf(stderr, "Error: Too many arguments.\n");
        return EXIT_FAILURE;
    }

    if (argc == 2) {
        processBatchMode(argv[1]);
    } else {
        processInteractiveMode();
    }

    return 0;
}

// Interactive Mode
void processInteractiveMode() {
    char input[MAX_LENGTH];
    printf("** Interactive Mode **\n");
    while (1) {
        printf("%s ", prompt);
        if (!fgets(input, sizeof(input), stdin)) {
            printf("\nExiting shell.\n");
            break;
        }
        input[strcspn(input, "\n")] = 0;
        executeCommand(input);
    }
}

// Batch Mode
void processBatchMode(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        fprintf(stderr, "Error: File cannot be opened.\n");
        exit(EXIT_FAILURE);
    }
    char line[MAX_LENGTH];
    while (fgets(line, sizeof(line), file)) {
        line[strcspn(line, "\n")] = 0;
        printf("Batch> %s\n", line);
        executeCommand(line);
    }
    fclose(file);
}

// Command Execution
void executeCommand(char *input) {
    addHistory(input);
    if (strncmp(input, "cd", 2) == 0) {
        builtInCD(input + 3);
    } else if (strcmp(input, "exit") == 0) {
        builtInExit();
    } else if (strncmp(input, "path", 4) == 0) {
        builtInPath(input + 5);
    } else if (strncmp(input, "myhistory", 9) == 0) {
        builtInMyHistory(input + 10);
    } else if (strncmp(input, "alias", 5) == 0) {
        manageAlias(input);
    } else if (strchr(input, '|')) {
        handlePipes(input);
    } else if (strchr(input, '<') || strchr(input, '>')) {
        handleRedirection(input);
    } else {
        if (fork() == 0) {
            execlp(input, input, NULL);
            perror("Command execution failed");
            exit(EXIT_FAILURE);
        }
        wait(NULL);
    }
}

// Built-In Commands
void builtInCD(char *path) {
    if (chdir(path) != 0) {
        perror("cd failed");
    }
}

void builtInExit() {
    exit(0);
}

void builtInPath(char *input) {
    if (strncmp(input, "+", 1) == 0) {
        strcat(PATH, ":");
        strcat(PATH, input + 2);
    } else if (strncmp(input, "-", 1) == 0) {
        char *remove = input + 2;
        char *pos = strstr(PATH, remove);
        if (pos) {
            memmove(pos, pos + strlen(remove) + 1, strlen(pos + strlen(remove) + 1) + 1);
        }
    } else {
        printf("PATH: %s\n", PATH);
    }
}

void builtInMyHistory(char *input) {
    if (strcmp(input, "-c") == 0) {
        history_count = 0;
    } else if (strncmp(input, "-e", 2) == 0) {
        int index = atoi(input + 3);
        if (index < history_count) {
            executeCommand(history[index]);
        } else {
            fprintf(stderr, "Invalid history index.\n");
        }
    } else {
        for (int i = 0; i < history_count; i++) {
            printf("%d: %s\n", i, history[i]);
        }
    }
}

// History
void addHistory(char *command) {
    if (history_count < MAX_HISTORY) {
        history[history_count++] = strdup(command);
    } else {
        free(history[0]);
        for (int i = 0; i < MAX_HISTORY - 1; i++) {
            history[i] = history[i + 1];
        }
        history[MAX_HISTORY - 1] = strdup(command);
    }
}

// Alias Management
void manageAlias(char *input) {
    if (strncmp(input, "-c", 2) == 0) {
        alias_count = 0;
    } else if (strncmp(input, "-r", 2) == 0) {
        char *alias_name = input + 3;
        for (int i = 0; i < alias_count; i++) {
            if (strcmp(alias[i][0], alias_name) == 0) {
                for (int j = i; j < alias_count - 1; j++) {
                    alias[j][0] = alias[j + 1][0];
                    alias[j][1] = alias[j + 1][1];
                }
                alias_count--;
                return;
            }
        }
    } else {
        char *name = strtok(input + 6, "=");
        char *command = strtok(NULL, "'");
        alias[alias_count][0] = strdup(name);
        alias[alias_count][1] = strdup(command);
        alias_count++;
    }
}

void executeAlias(char *alias_name) {
    for (int i = 0; i < alias_count; i++) {
        if (strcmp(alias[i][0], alias_name) == 0) {
            executeCommand(alias[i][1]);
            return;
        }
    }
    fprintf(stderr, "Alias not found: %s\n", alias_name);
}

// Redirection
void handleRedirection(char *input) {
    char *cmd, *file;
    int fd;

    if (strchr(input, '>')) {
        cmd = strtok(input, ">");
        file = strtok(NULL, ">");
        file = strtok(file, " ");
        if (!file) {
            fprintf(stderr, "Error: No output file specified.\n");
            return;
        }
        fd = open(file, O_CREAT | O_WRONLY | O_TRUNC, 0644);
        if (fd == -1) {
            perror("Error opening file");
            return;
        }
        if (fork() == 0) {
            dup2(fd, STDOUT_FILENO);
            close(fd);
            execlp(cmd, cmd, NULL);
            perror("Error executing command");
            exit(EXIT_FAILURE);
        }
        close(fd);
        wait(NULL);
    } else if (strchr(input, '<')) {
        cmd = strtok(input, "<");
        file = strtok(NULL, "<");
        file = strtok(file, " ");
        if (!file) {
            fprintf(stderr, "Error: No input file specified.\n");
            return;
        }
        fd = open(file, O_RDONLY);
        if (fd == -1) {
            perror("Error opening file");
            return;
        }
        if (fork() == 0) {
            dup2(fd, STDIN_FILENO);
            close(fd);
            execlp(cmd, cmd, NULL);
            perror("Error executing command");
            exit(EXIT_FAILURE);
        }
        close(fd);
        wait(NULL);
    }
}