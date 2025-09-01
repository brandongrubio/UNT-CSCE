import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Calendar } from './calendar';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { MockedProvider } from '@apollo/client/testing';
import { Button, Modal } from 'react-bootstrap';

// Mock Firebase services
jest.mock('./firebase', () => ({
  db: {
    collection: jest.fn(),
    onSnapshot: jest.fn(),
  },
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: 'testUser',
    },
  })),
}));

// Mocking Firebase Firestore
const mockTasks = [
  { id: '1', title: 'Task 1', description: 'Test Task 1', dueDate: '2024-12-06', dueTime: '2:00 PM' },
  { id: '2', title: 'Task 2', description: 'Test Task 2', dueDate: '2024-12-06', dueTime: '4:00 PM' },
];

describe('Calendar Component', () => {
  beforeEach(() => {
    // Mock Firebase onSnapshot to simulate fetching data
    db.collection.mockReturnValue({
      onSnapshot: (callback) => callback({
        docs: mockTasks.map((task) => ({
          id: task.id,
          data: () => task,
        })),
      }),
    });
  });

  test('renders calendar correctly', () => {
    render(<Calendar />);
    // Check if the current month is displayed
    expect(screen.getByText(/December/)).toBeInTheDocument();
    // Check if the days of the week are displayed
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    // Check if calendar days are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('clicking on a day opens modal with tasks', async () => {
    render(<Calendar />);

    // Click on the day with tasks (e.g., 6th December)
    fireEvent.click(screen.getByText('6'));

    // Wait for modal to appear and check if tasks are listed
    await waitFor(() => {
      expect(screen.getByText('Tasks for Thu Dec 6 2024')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  test('clicking on close button closes the modal', async () => {
    render(<Calendar />);

    // Open the modal
    fireEvent.click(screen.getByText('6'));
    await waitFor(() => {
      expect(screen.getByText('Tasks for Thu Dec 6 2024')).toBeInTheDocument();
    });

    // Close the modal
    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByText('Tasks for Thu Dec 6 2024')).not.toBeInTheDocument();
    });
  });

  test('previous and next buttons change the month', () => {
    render(<Calendar />);

    // Get the current month label
    const currentMonth = screen.getByText(/December/);

    // Click "Next" button
    fireEvent.click(screen.getByText('Next'));

    // Ensure the month changed to January
    expect(screen.getByText(/January/)).toBeInTheDocument();

    // Click "Previous" button
    fireEvent.click(screen.getByText('Previous'));

    // Ensure the month is back to December
    expect(currentMonth).toBeInTheDocument();
  });

  test('tasks are fetched correctly from Firebase', async () => {
    render(<Calendar />);

    // Wait for tasks to be rendered
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });
});
