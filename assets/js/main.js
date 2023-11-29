const taskInput = document.querySelector('.input-text'); 
const addForm = document.querySelector('.add-form'); 
const tasksContainer = document.querySelector('.tasks-list'); 
const deleteAllBtn = document.querySelector('.deleteAll-btn');
const errorMessage = document.getElementById('form__error');

let taskList = JSON.parse(localStorage.getItem('tasks')) || [];

const showError = (msg) => {
    errorMessage.textContent = msg;
}

const saveLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

const renderTaskList = () => {
    tasksContainer.innerHTML = taskList.map((task) => createTask(task)).join('');
    addTaskListeners(); // Agregar listeners para los elementos generados
}

const createTask = (task) => {
    const { name, id, checked } = task;
    const isChecked = checked ? 'checked' : '';

    return `
        <li>  
            <p>${name}</p>
            <input type="checkbox" class="check-list" ${isChecked}>
            <span class="custom-checkbox"></span>
            <img class="delete-btn" src="./assets/img/delete.svg" alt="boton de borrar" data-id="${id}">
        </li>
    `;
}

const updateTaskList = (taskId, checked) => {
    taskList = taskList.map(task => {
        if (task.id === taskId) {
            return { ...task, checked };
        }
        return task;
    });
    saveLocalStorage();
}

const handleCheckboxChange = (e) => {
    const checkbox = e.target;
    const taskId = parseInt(checkbox.parentNode.querySelector('.delete-btn').getAttribute('data-id'), 10);
    const checked = checkbox.checked;
    updateTaskList(taskId, checked);
}

const addTaskListeners = () => {
    const checkboxes = document.querySelectorAll('.check-list');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}

const isValidTask = (taskName) => {
    if (!taskName.length){
        showError('Por favor, ingrese una tarea.'); 
        addForm.reset();
        return false;
    }if(taskList.some((task) => task.name.toLowerCase() === taskName.toLowerCase())) {
        showError('Ya existe una tarea con ese nombre.');
        addForm.reset();
        return false;
    }
    else{
        errorMessage.textContent = '';
        return true;
    } 

}

const addTask = (e) => {
    e.preventDefault();
    const taskName = taskInput.value.trim();

    if(!isValidTask(taskName)){
        return;
    } 

    taskList = [...taskList, { name: taskName,  id: Date.now(), checked: false }];
    addForm.reset();
    renderTaskList();
    saveLocalStorage();
    toggleDeleteAllButton();
}



const removeTask = (e) =>{
    if (!e.target.classList.contains('delete-btn')) return;
    const filterId = Number(e.target.dataset.id);

    taskList = taskList.filter((task) => task.id !== filterId);
    renderTaskList();
    saveLocalStorage();
    toggleDeleteAllButton();
    
}


const removeAll = () => {
    taskList = [];
    renderTaskList();
    saveLocalStorage();
    toggleDeleteAllButton();
}

const toggleDeleteAllButton = () => {
    if(!taskList.length){
        deleteAllBtn.classList.add('hidden');
        return;
    }
    deleteAllBtn.classList.remove('hidden');


}



const init = () => {
    document.addEventListener('DOMContentLoaded', () => {
        renderTaskList();
        addTaskListeners(); // Agregar listeners iniciales
        toggleDeleteAllButton()
    });
    addForm.addEventListener('submit', addTask);
    tasksContainer.addEventListener('click', removeTask);
    deleteAllBtn.addEventListener('click', removeAll);
    
}

init();
