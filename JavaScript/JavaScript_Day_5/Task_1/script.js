const API_BASE_URL = 'https://dotnet9api.azurewebsites.net/todos';


let todoCount = 0;
const todos = [];


const showToast = (message, type = 'success') => {
  // Get toast container element
  const toastContainer = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  
  // Set toast styling and content
  toast.className = `toast align-items-center text-bg-${type} border-0 show`;
  toast.role = 'alert';
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>`;
  
  // Add toast to container
  toastContainer.appendChild(toast);
  

  setTimeout(() => toast.remove(), 3000);
};


const updateTable = () => {

  const todoTableBody = document.getElementById('todoTableBody');
  
 
  todoTableBody.innerHTML = '';
  
 
  todos.forEach((todo, index) => {
  
    const newRow = `
      <tr>
        <td>${index + 1}</td>
        <td>${todo.title}</td>

        <td>${todo.description}</td>
        <td>
          <button class="btn ${todo.isCompleted ? 'btn-warning' : 'btn-success'}" onclick="toggleTodoStatus(${todo.id}, ${todo.isCompleted})">
            ${todo.isCompleted ? 'Mark as Incomplete' : 'Mark Completed'}
          </button>
        </td>
        <td>
          <button class="btn btn-info text-white" onclick="editTodo(${todo.id})">Edit</button>
          <button class="btn btn-danger" onclick="deleteTodo(${todo.id})">Delete</button>
        </td>
      </tr>`;
 
    todoTableBody.insertAdjacentHTML('beforeend', newRow);
  });
};



const fetchTodos = async () => {
  try {
    // Send GET request to fetch todos
    const response = await fetch(API_BASE_URL);


    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    
    todos.length = 0;
    todos.push(...data);
    
    updateTable();
  } catch (error) {

    console.error('Error fetching todos:', error);
    showToast('An error occurred while fetching todos!', 'danger');
  }
};

document.getElementById('saveTodoButton').addEventListener('click', async function () {

  const todoId = document.getElementById('todoId').value;
  const titleInput = document.getElementById('todoTitle');
  const descriptionInput = document.getElementById('todoDescription');
  const titleError = document.getElementById('titleError');
  const descriptionError = document.getElementById('descriptionError');

 
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

 
  titleError.style.display = 'none';
  descriptionError.style.display = 'none';

 
  if (!title) {
    titleError.style.display = 'block';
    return;
  }


  if (!description) {
    descriptionError.style.display = 'block';
    return;
  }

  // Prepare todo object
  const todo = { title, description };
  try {
    // Determine request type (update or create)
    const response = todoId
      ? await fetch(`${API_BASE_URL}/${todoId}`, {  // PATCH for update
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todo),
        })
      : await fetch(API_BASE_URL, {  // POST for creating a new todo
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todo),
        });

  
    if (response.ok) {
    
      fetchTodos();
      

      showToast(todoId ? 'Todo updated successfully!' : 'Todo added successfully!');
      
  
      const modal = bootstrap.Modal.getInstance(document.getElementById('addTodoModal')); 
      modal.hide();
    } else {
  
      showToast('Failed to save todo!', 'danger');
    }
  } catch (error) {
    // Log and display error to user
    console.error('Error saving todo:', error);
    showToast('An error occurred while saving todo!', 'danger');
  }
});



const toggleTodoStatus = async (id, isCompleted) => {
  try {
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: isCompleted ? false : true }), // Toggle status
    });

 
    if (response.ok) {
    
      fetchTodos();
      
    
      showToast('Todo status updated successfully!');
    } else {
    
      showToast('Failed to update todo status!', 'danger');
    }
  } catch (error) {
    
    console.error('Error updating todo status:', error);
    showToast('An error occurred while updating status!', 'danger');
  }
};


const editTodo = async (id) => {
  try {
   
    const response = await fetch(`${API_BASE_URL}/${id}`);
    

    if (response.ok) {
    
      const todo = await response.json();
      
    
      document.getElementById('todoId').value = todo.id;
      document.getElementById('todoTitle').value = todo.title;
      document.getElementById('todoDescription').value = todo.description;
      
   
      const modal = new bootstrap.Modal(document.getElementById('addTodoModal'));
      modal.show();
    } else {
  
      showToast('Failed to fetch todo!', 'danger');
    }
  } catch (error) {
  
    console.error('Error fetching todo:', error);
    showToast('An error occurred while fetching todo!', 'danger');
  }
};


const deleteTodo = async (id) => {

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
  }).then(async (result) => {
  
    if (result.isConfirmed) {
      try {
        // Send DELETE request
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });  
        
   
        if (response.ok) {
          // Refresh todos list
          fetchTodos();
          
         
          showToast('Todo deleted successfully!', 'success');
        } else {
          
          showToast('Failed to delete todo!', 'danger');
        }
      } catch (error) {
  
        console.error('Error deleting todo:', error);
        showToast('An error occurred while deleting todo!', 'danger');
      }
    }
  });
};


document.addEventListener('DOMContentLoaded', fetchTodos);