import {
  HomeContainer,
  ButtonContainer,
  Button,
  TaskContainer,
  TaskCard,
  TaskTitle,
  TaskText,
  CheckBox,
  TaskRow
} from '../assets/styles/pages/home.style';
import {
  faPlus,
  faPencil,
  faTrash,
  faCheck,
  faExclamationTriangle,
  faSearch,
  faFilter,
  faSortAmountDown,
  faSortAmountUp,
  faCoffee,
  faChartBar,
  faCalendarAlt,
  faExclamation,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/authContext';
import api from '../hooks/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import TaskForm from '../components/TaskForm';
import DeleteTaskModal from '../components/DeleteTaskModal';

// Error Message Component
const ErrorMessage = styled.div`
  background-color: #ffdddd;
  color: #ff0000;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border-left: 5px solid #ff0000;
  font-weight: bold;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Priority Badge Component - defined outside of render to avoid dynamic styled component warnings
const PriorityBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-left: 0.5rem;
  background-color: ${props => {
    if (props.$priorityLevel === 'high') return 'rgba(163, 93, 106, 0.2)';
    if (props.$priorityLevel === 'medium') return 'rgba(212, 180, 131, 0.2)';
    return 'rgba(115, 158, 130, 0.2)';
  }};
  color: ${props => {
    if (props.$priorityLevel === 'high') return 'var(--danger)';
    if (props.$priorityLevel === 'medium') return 'var(--warning)';
    return 'var(--success)';
  }};
  border: 1px solid ${props => {
    if (props.$priorityLevel === 'high') return 'var(--danger)';
    if (props.$priorityLevel === 'medium') return 'var(--warning)';
    return 'var(--success)';
  }};
`;

const CompletedTaskText = styled(TaskText)`
  text-decoration: line-through;
  color: var(--text-muted);
  opacity: 0.7;
`;

const EditButton = styled(Button)`
  background-color: var(--accent);
  color: var(--bg);
  border: 2px solid var(--accent);

  &:hover:not(:disabled) {
    background-color: transparent;
    color: var(--accent);
    border: 2px solid var(--accent);
  }
`;

const DeleteButton = styled(Button)`
  background-color: var(--danger);
  color: var(--bg);
  border: 2px solid var(--danger);

  &:hover:not(:disabled) {
    background-color: transparent;
    color: var(--danger);
    border: 2px solid var(--danger);
  }
`;

const AddTaskButton = styled(Button)`
  background-color: var(--success);
  color: var(--bg);
  border: 2px solid var(--success);

  &:hover:not(:disabled) {
    background-color: transparent;
    color: var(--success);
    border: 2px solid var(--success);
  }
`;

const TaskDetail = styled(TaskText)`
  font-size: 0.85rem;
  color: var(--text);
  line-height: 1.5;
  max-height: 4.5rem; /* 3 lines of text */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const StatCard = styled.div`
  background-color: var(--card-bg);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px var(--shadow);
  transition: all 0.3s ease;
  flex: 1;
  min-width: 120px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px var(--shadow);
  }

  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--accent);
  }

  .value {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0.3rem 0;
  }

  .label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-align: center;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 95%;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const ErrorContainer = styled.div`
  background-color: rgba(163, 93, 106, 0.2);
  color: var(--text);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  border-left: 4px solid var(--danger);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 2px 8px var(--shadow);
  font-size: 0.9rem;

  svg {
    color: var(--danger);
    font-size: 1.2rem;
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(200, 121, 65, 0.2);
  border-radius: 50%;
  border-top: 4px solid var(--accent);
  border-right: 4px solid transparent;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 3rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 95%;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--bg);
  border: 1px solid var(--bdr);
  border-radius: 30px;
  padding: 0.5rem 1rem;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 2px 5px var(--shadow);

  input {
    background: transparent;
    border: none;
    color: var(--text);
    font-size: 0.9rem;
    width: 100%;
    padding: 0.3rem 0.5rem;
    outline: none;
  }

  svg {
    color: var(--accent);
    margin-right: 0.5rem;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--btnBg);
  color: var(--text);
  border: 1px solid var(--bdr);
  border-radius: 30px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px var(--shadow);

  &:hover {
    background-color: var(--hvr);
    transform: translateY(-2px);
  }

  &.active {
    background-color: var(--accent);
    color: var(--bg);
    border-color: var(--accent);
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);

  svg {
    font-size: 3rem;
    color: var(--accent);
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  p {
    font-size: 0.9rem;
    max-width: 400px;
  }
`;

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'
  const { userId, token } = useAuth();

  // Calculate task statistics
  const getTaskStats = () => ({
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    active: tasks.filter(task => !task.completed).length,
    highPriority: tasks.filter(task => task.priority === 'high').length,
    dueSoon: tasks.filter(task => {
      if (task.completed) return false;
      const taskDate = new Date(task.date + ' ' + task.time);
      const now = new Date();
      const diffTime = taskDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 2 && diffDays >= 0; // Due within 2 days
    }).length
  });

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError('');

      if (userId) {
        try {
          console.log('Fetching tasks for user:', userId);
          console.log('Current token in state:', token);
          console.log('Current token in localStorage:', localStorage.getItem('token'));

          // Make sure token is in localStorage before making the request
          if (!localStorage.getItem('token') && token) {
            console.log('Token found in state but not in localStorage, storing it now');
            localStorage.setItem('token', token);
          }

          // Make API call - token is added by the interceptor
          // Force the use of the real API
          const response = await api.post(`/tasks/${userId}/all`, {}, { forceMode: 'real' });

          if (response.status === 200) {
            // Ensure the API returns an array of tasks
            if (Array.isArray(response.data.tasks)) {
              console.log('Tasks fetched successfully:', response.data.tasks.length);
              setTasks(response.data.tasks);
            } else {
              console.warn('API did not return an array of tasks, using default tasks.');
              setTasks(getDefaultTasks());
            }
          } else {
            console.warn('Unexpected response status:', response.status);
            setTasks(getDefaultTasks());
          }
        } catch (error) {
          console.error('Failed to fetch tasks:', error);

          // Check if it's an authentication error
          if (error.response && error.response.status === 401) {
            setError('Authentication failed. Please try logging in again.');
          } else {
            setError('Failed to load tasks. Please try again later.');
          }

          setTasks(getDefaultTasks());
        }
      } else {
        console.log('No userId available, using default tasks');
        setTasks(getDefaultTasks());
      }

      setLoading(false);
    };

    fetchTasks();
  }, [userId, token]);

  // Filter and sort tasks based on search term, filter status, and sort direction
  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.detail.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filterStatus === 'active') {
      result = result.filter(task => !task.completed);
    } else if (filterStatus === 'completed') {
      result = result.filter(task => task.completed);
    }

    // Apply sorting (by date)
    result.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredTasks(result);
  }, [tasks, searchTerm, filterStatus, sortDirection]);

  const getDefaultTasks = () => {
    return [
      { id: 0, date: "2023-12-25", time: "14:30", detail: "Finish the TrackMasterPro application", title: "Complete Project", completed: false, priority: "medium" },
      { id: 1, date: "2023-12-26", time: "10:00", detail: "Weekly team sync to discuss progress", title: "Team Meeting", completed: false, priority: "high" },
      { id: 2, date: "2023-12-27", time: "18:00", detail: "Get milk, eggs, and bread", title: "Buy Groceries", completed: false, priority: "low" },
      { id: 3, date: "2023-12-28", time: "20:00", detail: "Study React hooks documentation", title: "Read Documentation", completed: false, priority: "medium" },
      { id: 4, date: "2023-12-29", time: "07:00", detail: "30 minutes of cardio", title: "Exercise", completed: false, priority: "high" },
      { id: 5, date: "2023-12-30", time: "12:00", detail: "Review project progress and plan next steps", title: "Project Review", completed: false, priority: "low" },
      { id: 6, date: "2023-12-31", time: "23:59", detail: "Celebrate the new year", title: "New Year's Eve", completed: false, priority: "medium" }
    ];
  };

  const handleItemSelected = useCallback((e) => {
    const taskId = parseInt(e.target.value, 10);
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.includes(taskId)) {
        return prevSelectedTasks.filter((id) => id !== taskId);
      } else {
        return [...prevSelectedTasks, taskId];
      }
    });
  }, []);

  const isTaskSelected = (taskId) => selectedTasks.includes(taskId);

  const toggleComplete = useCallback(async (taskId) => {
    try {
      console.log('Toggling completion for task ID:', taskId);
      // Find the task to toggle
      const taskToToggle = tasks.find(task => task.id === taskId);
      if (!taskToToggle) {
        console.error('Task not found:', taskId);
        return;
      }

      console.log('Found task to toggle:', taskToToggle);

      // Optimistically update the UI
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === taskId) {
            return { ...task, completed: !task.completed };
          } else {
            return task;
          }
        });
      });

      // Convert taskId to string for API call since mock API uses string IDs
      const apiTaskId = taskId.toString();
      console.log('API Task ID:', apiTaskId);

      // Create update payload - only send the completed field
      const updatePayload = {
        completed: !taskToToggle.completed
      };
      console.log('Update payload:', updatePayload);

      // Send the update to the API - token is added by the interceptor
      // Force the use of the real API
      const response = await api.put(`/tasks/${apiTaskId}`, updatePayload, { forceMode: 'real' });
      console.log('Update response:', response);
    } catch (error) {
      console.error('Failed to update task completion status:', error);

      // Check if it's a network error
      if (error.message === 'Network Error') {
        console.log('Network error detected, falling back to mock API...');
        try {
          // Try with mock API directly - get the current task again to be safe
          const currentTask = tasks.find(task => task.id === taskId);
          if (!currentTask) return;

          const response = await api.put(`/tasks/${taskId.toString()}`, { completed: !currentTask.completed }, { forceMode: 'mock' });
          console.log('Mock API response:', response);
          // No need to revert the optimistic update if mock API succeeds
          return;
        } catch (mockError) {
          console.error('Mock API also failed:', mockError);
        }
      }

      // Revert the optimistic update if all API calls fail
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === taskId) {
            return { ...task, completed: !task.completed };
          } else {
            return task;
          }
        });
      });
      setError('Failed to update task. Using local state only.');
    }
  }, [tasks]);

  const handleAddTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === updatedTask.id) {
          return updatedTask;
        } else {
          return task;
        }
      });
    });
  };

  const handleEditClick = () => {
    if (selectedTasks.length === 1) {
      const taskToEdit = tasks.find(task => task.id === selectedTasks[0]);
      if (taskToEdit) {
        setEditingTask(taskToEdit);
        setShowPopup(true);
      }
    }
  };

  const handleCloseForm = () => {
    setShowPopup(false);
    setEditingTask(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilterStatus = (status) => {
    setFilterStatus(prev => prev === status ? 'all' : status);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };



  const displayTasks = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (tasks.length === 0) {
      return (
        <EmptyStateContainer>
          <FontAwesomeIcon icon={faCoffee} />
          <h3>No Tasks Yet</h3>
          <p>Get started by adding your first task with the + button above.</p>
        </EmptyStateContainer>
      );
    }

    if (filteredTasks.length === 0) {
      return (
        <EmptyStateContainer>
          <FontAwesomeIcon icon={faSearch} />
          <h3>No Matching Tasks</h3>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
        </EmptyStateContainer>
      );
    }

    return filteredTasks.map((task) => {
      const isSelected = isTaskSelected(task.id);
      const priority = task.priority || 'medium';

      return (
        <TaskCard
          key={task.id}
          id={task.id}
          style={{
            borderLeftColor: priority === 'high' ? 'var(--danger)' :
                           priority === 'medium' ? 'var(--warning)' :
                           'var(--success)',
            borderLeftWidth: '4px'
          }}
        >
          <TaskRow>
            <CheckBox
              type="checkbox"
              onChange={handleItemSelected}
              checked={isSelected}
              value={task.id}
            />
            <TaskTitle>{task.title}</TaskTitle>
            <FontAwesomeIcon
              icon={faCheck}
              onClick={() => toggleComplete(task.id)}
              style={{ cursor: 'pointer' }}
            />
          </TaskRow>
          <TaskRow style={{ justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TaskText style={{ margin: 0, fontSize: '0.8rem' }}>{task.date}</TaskText>
              <TaskText style={{ margin: '0 0 0 0.5rem', fontSize: '0.8rem' }}>{task.time}</TaskText>
            </div>
            <PriorityBadge $priorityLevel={priority}>{priority}</PriorityBadge>
          </TaskRow>
          <TaskRow style={{ marginTop: '0.5rem' }}>
            {task.completed ? (
              <CompletedTaskText>{task.detail}</CompletedTaskText>
            ) : (
              <TaskDetail>{task.detail}</TaskDetail>
            )}
          </TaskRow>
        </TaskCard>
      );
    });
  };

  const handleDeleteClick = () => {
    if (selectedTasks.length === 0) return;
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('Deleting tasks:', selectedTasks);

      // Use the dedicated tasks.delete method instead of generic delete
      await Promise.all(
        selectedTasks.map(taskId => {
          console.log(`Deleting task ID: ${taskId}`);
          return api.tasks.delete(taskId, { forceMode: 'real' });
        })
      );

      // Optimistically update UI
      setTasks(prevTasks => prevTasks.filter(task => !selectedTasks.includes(task.id)));
      setSelectedTasks([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting tasks:", error);
      setError("Failed to delete tasks. Please try again.");
      setShowDeleteModal(false);
    }
  };



  return (
    <HomeContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ButtonContainer>
        <AddTaskButton
          className="tektur"
          onClick={() => {
            setEditingTask(null);
            setShowPopup(true);
          }}
          title="Add new task"
        >
          <FontAwesomeIcon icon={faPlus} />
        </AddTaskButton>
        <EditButton
          className="tektur"
          disabled={selectedTasks.length !== 1}
          onClick={handleEditClick}
          title="Edit selected task"
        >
          <FontAwesomeIcon icon={faPencil} />
        </EditButton>
        <DeleteButton
          className="tektur"
          disabled={selectedTasks.length === 0}
          onClick={handleDeleteClick}
          title="Delete selected tasks"
        >
          <FontAwesomeIcon icon={faTrash} />
        </DeleteButton>
      </ButtonContainer>

      {!loading && tasks.length > 0 && (() => {
        const stats = getTaskStats();
        return (
          <StatsContainer>
            <StatCard>
              <FontAwesomeIcon icon={faChartBar} className="icon" />
              <div className="value">{stats.total}</div>
              <div className="label">Total Tasks</div>
            </StatCard>

            <StatCard>
              <FontAwesomeIcon icon={faCheckDouble} className="icon" style={{ color: 'var(--success)' }} />
              <div className="value">{stats.completed}</div>
              <div className="label">Completed</div>
            </StatCard>

            <StatCard>
              <FontAwesomeIcon icon={faFilter} className="icon" style={{ color: 'var(--accent)' }} />
              <div className="value">{stats.active}</div>
              <div className="label">Active</div>
            </StatCard>

            <StatCard>
              <FontAwesomeIcon icon={faExclamation} className="icon" style={{ color: 'var(--danger)' }} />
              <div className="value">{stats.highPriority}</div>
              <div className="label">High Priority</div>
            </StatCard>

            <StatCard>
              <FontAwesomeIcon icon={faCalendarAlt} className="icon" style={{ color: 'var(--warning)' }} />
              <div className="value">{stats.dueSoon}</div>
              <div className="label">Due Soon</div>
            </StatCard>
          </StatsContainer>
        );
      })()}

      <SearchContainer>
        <SearchInput>
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchInput>

        <FilterButton
          className={filterStatus === 'active' ? 'active' : ''}
          onClick={() => toggleFilterStatus('active')}
          title="Show active tasks"
        >
          <FontAwesomeIcon icon={faFilter} />
          Active
        </FilterButton>

        <FilterButton
          className={filterStatus === 'completed' ? 'active' : ''}
          onClick={() => toggleFilterStatus('completed')}
          title="Show completed tasks"
        >
          <FontAwesomeIcon icon={faCheck} />
          Completed
        </FilterButton>

        <FilterButton
          onClick={toggleSortDirection}
          title={`Sort by date ${sortDirection === 'asc' ? 'oldest first' : 'newest first'}`}
        >
          <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} />
          {sortDirection === 'asc' ? 'Oldest' : 'Newest'}
        </FilterButton>
      </SearchContainer>

      {error && (
        <ErrorContainer>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {error}
        </ErrorContainer>
      )}

      <TaskContainer>
        {displayTasks()}
      </TaskContainer>

      <TaskForm
        isOpen={showPopup}
        onClose={handleCloseForm}
        task={editingTask}
        onTaskAdded={handleAddTask}
        onTaskUpdated={handleUpdateTask}
      />

      {/* Custom Delete Modal */}
      <DeleteTaskModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDelete}
        taskCount={selectedTasks.length}
      />
    </HomeContainer>
  );
}
