
        // Utility Functions
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Cookie Management
        function setCookie(name, value, days) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        }

        function getCookie(name) {
            const cookies = document.cookie.split(';');
            for(let cookie of cookies) {
                const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
                if(cookieName === name) return cookieValue;
            }
            return null;
        }

        // Preferences Management
        function savePreferences() {
            const theme = document.getElementById('themeSelect').value;
            setCookie('theme', theme, 30);
            applyTheme(theme);
        }

        function loadPreferences() {
            const theme = getCookie('theme') || 'light';
            document.getElementById('themeSelect').value = theme;
            applyTheme(theme);
        }

        function applyTheme(theme) {
            if(theme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }

        // Persistent Tasks (Local Storage)
        function addPersistentTask() {
            const title = document.getElementById('persistentTaskTitle').value;
            const desc = document.getElementById('persistentTaskDesc').value;
            
            if(!title || !desc) return alert('Please fill in all fields');

            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const newTask = {
                id: generateId(),
                title,
                desc,
                timestamp: new Date().toISOString()
            };

            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            document.getElementById('persistentTaskTitle').value = '';
            document.getElementById('persistentTaskDesc').value = '';
            
            loadPersistentTasks();
        }

        function loadPersistentTasks() {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const container = document.getElementById('persistentTaskList');
            container.innerHTML = '';

            tasks.forEach(task => {
                const taskElement = createTaskElement(task, 'persistent');
                container.appendChild(taskElement);
            });
        }

        function deletePersistentTask(id) {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const updatedTasks = tasks.filter(task => task.id !== id);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            loadPersistentTasks();
        }

        // Session Tasks (Session Storage)
        function addSessionTask() {
            const title = document.getElementById('sessionTaskTitle').value;
            const desc = document.getElementById('sessionTaskDesc').value;
            
            if(!title || !desc) return alert('Please fill in all fields');

            const tasks = JSON.parse(sessionStorage.getItem('tasks') || '[]');
            const newTask = {
                id: generateId(),
                title,
                desc,
                timestamp: new Date().toISOString()
            };

            tasks.push(newTask);
            sessionStorage.setItem('tasks', JSON.stringify(tasks));
            
            document.getElementById('sessionTaskTitle').value = '';
            document.getElementById('sessionTaskDesc').value = '';
            
            loadSessionTasks();
        }

        function loadSessionTasks() {
            const tasks = JSON.parse(sessionStorage.getItem('tasks') || '[]');
            const container = document.getElementById('sessionTaskList');
            container.innerHTML = '';

            tasks.forEach(task => {
                const taskElement = createTaskElement(task, 'session');
                container.appendChild(taskElement);
            });
        }

        function deleteSessionTask(id) {
            const tasks = JSON.parse(sessionStorage.getItem('tasks') || '[]');
            const updatedTasks = tasks.filter(task => task.id !== id);
            sessionStorage.setItem('tasks', JSON.stringify(updatedTasks));
            loadSessionTasks();
        }

        // Task Element Creation
        function createTaskElement(task, type) {
            const div = document.createElement('div');
            div.className = 'task-item';
            
            const title = document.createElement('h3');
            title.textContent = task.title;
            
            const desc = document.createElement('p');
            desc.textContent = task.desc;
            
            const timestamp = document.createElement('small');
            timestamp.textContent = new Date(task.timestamp).toLocaleString();
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
                if(type === 'persistent') {
                    deletePersistentTask(task.id);
                } else {
                    deleteSessionTask(task.id);
                }
            };

            div.appendChild(title);
            div.appendChild(desc);
            div.appendChild(timestamp);
            div.appendChild(deleteBtn);

            return div;
        }

        // Initialize
        window.onload = function() {
            loadPreferences();
            loadPersistentTasks();
            loadSessionTasks();
        };
