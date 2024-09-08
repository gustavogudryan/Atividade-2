// função para gerar um ID único
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// função para salvar usuários no localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// função para obter usuários do localStorage
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// função para verificar se um email já está cadastrado
function isEmailRegistered(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}

// função para criar um novo usuário
function createUser(name, email, password) {
    return {
        id: generateUniqueId(),
        name,
        email,
        password,
        pets: [],
        appointments: []
    };
}

// função para adicionar um novo usuário
function addUser(user) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
}

// função para fazer login
function login(email, password) {
    const users = getUsers();
    return users.find(user => user.email === email && user.password === password);
}

// função para definir o usuário como logado
function setLoggedIn(user) {
    localStorage.setItem('isLogged', 'true');
    localStorage.setItem('loggedUser', JSON.stringify(user));
}

// função para verificar se o usuário está logado
function isLoggedIn() {
    return localStorage.getItem('isLogged') === 'true';
}

// função para obter o usuário logado
function getLoggedUser() {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
}

// função para fazer logout
function logout() {
    localStorage.removeItem('isLogged');
    localStorage.removeItem('loggedUser');
    alert("Deslogado");
    updateNavbar();
}

// função para atualizar a navbar
function updateNavbar() {
    const loginButton = document.querySelector('.navbar .btn-primary');
    const petsButton = document.querySelector('.navbar .btn-pets');
    const agendamentosButton = document.querySelector('.navbar .btn-agendamentos');

    if (loginButton) {
        if (isLoggedIn()) {
            loginButton.textContent = 'Logout';
            loginButton.onclick = logout;

            if (petsButton) {
                petsButton.style.display = 'block';
                petsButton.onclick = () => {
                    const petsModal = new bootstrap.Modal(document.getElementById('petsModal'));
                    petsModal.show();
                    updatePetsList();
                };
            }

            if (agendamentosButton) {
                agendamentosButton.style.display = 'block';
                agendamentosButton.onclick = () => {
                    const agendamentosModal = new bootstrap.Modal(document.getElementById('agendamentoModalLista'));
                    agendamentosModal.show();
                    updateAgendamentosList();
                };
            }

        } else {
            loginButton.textContent = 'Login';
            loginButton.onclick = () => window.location.href = './login.html';

            if (petsButton) {
                petsButton.style.display = 'none';
            }

            if (agendamentosButton) {
                agendamentosButton.style.display = 'none';
            }
        }
    }
}

// função para adicionar um novo pet ao usuário
function addPetToUser(userId, pet) {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex].pets.push(pet);
        saveUsers(users);
    }

    if (isLoggedIn()) {
        setLoggedIn(users[userIndex]);
    }
}

// função para adicionar um novo agendamento ao usuário
function addAppointToUser(userId, agendamento) {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex].appointments.push(agendamento);
        saveUsers(users);
    }

    if (isLoggedIn()) {
        setLoggedIn(users[userIndex]);
    }
}

// Função para criar um novo pet
function createPet(name, type, breed, temperament) {
    return {
        id: generateUniqueId(),
        name,
        type,
        breed,
        temperament
    };
}

// função para excluir um pet
function deletePet(petId) {
    let users = getUsers();
    const user = getLoggedUser();

    if (user) {
        user.pets = user.pets.filter(pet => pet.id !== petId);

        users = users.map(u => u.id === user.id ? user : u);
        saveUsers(users);
        setLoggedIn(user);
        updatePetsList();
    }
}

// função para exibir o modal de edição de pet
function editPet(petId) {
    const user = getLoggedUser();
    if (user) {
        const pet = user.pets.find(pet => pet.id === petId);
        if (pet) {
            document.getElementById('petName').value = pet.name;
            document.getElementById('petType').value = pet.type;
            document.getElementById('petBreed').value = pet.breed;
            document.getElementById('petTemperament').value = pet.temperament;

            const addPetForm = document.getElementById('addPetForm');
            addPetForm.setAttribute('data-edit-id', petId);
        }
    }
}

// função para exibir a lista de pets do usuário
function updatePetsList() {
    const user = getLoggedUser();
    const petsList = document.getElementById('petsList');
    petsList.innerHTML = '';

    if (user && user.pets.length > 0) {
        user.pets.forEach(pet => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Nome: ${pet.name}, Tipo: ${pet.type}, Raça: ${pet.breed}, Temperamento: ${pet.temperament}`;

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.className = 'btn btn-warning btn-sm ms-2';
            editButton.onclick = () => editPet(pet.id);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'btn btn-danger btn-sm ms-2';
            deleteButton.onclick = () => {
                if (confirm('Tem certeza de que deseja excluir este pet?')) {
                    deletePet(pet.id);
                }
            };

            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            petsList.appendChild(listItem);
        });
    } else {
        petsList.innerHTML = '<li class="list-group-item">Você ainda não tem pets cadastrados.</li>';
    }
}

// função para exibir a lista de agendamentos do usuário
function updateAgendamentosList() {
    const user = getLoggedUser();
    const agendamentosList = document.getElementById('agendamentosList');
    agendamentosList.innerHTML = '';

    if (user && user.appointments.length > 0) {
        user.appointments.forEach(agendamento => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Serviço: ${agendamento.servico}, Data: ${agendamento.data}, Tele-Busca: ${agendamento.teleBusca}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'btn btn-danger btn-sm ms-2';
            deleteButton.onclick = () => {
                if (confirm('Tem certeza de que deseja excluir este agendamento?')) {
                    deleteAgendamento(agendamento.id);
                }
            };

            listItem.appendChild(deleteButton);
            agendamentosList.appendChild(listItem);
        });
    } else {
        agendamentosList.innerHTML = '<li class="list-group-item">Você ainda não tem agendamentos cadastrados.</li>';
    }
}

// função para excluir um agendamento
function deleteAgendamento(agendamentoId) {
    let users = getUsers();
    const user = getLoggedUser();

    if (user) {
        user.appointments = user.appointments.filter(agendamento => agendamento.id !== agendamentoId);

        users = users.map(u => u.id === user.id ? user : u);
        saveUsers(users);
        setLoggedIn(user);
        updateAgendamentosList();
    }
}

// quando o dom estiver carregando, vai executar esses comandos
document.addEventListener('DOMContentLoaded', function () {
    updateNavbar();

    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const nome = document.getElementById('cadastroNome').value;
            const email = document.getElementById('cadastroEmail').value;
            const senha = document.getElementById('cadastroSenha').value;
            const confirmarSenha = document.getElementById('cadastroConfirmarSenha').value;

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem');
                return;
            }

            if (isEmailRegistered(email)) {
                alert('Este email já está cadastrado');
                return;
            }

            const newUser = createUser(nome, email, senha);
            addUser(newUser);

            alert('Cadastro realizado com sucesso!');
            this.reset();
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;

            const user = login(email, senha);
            if (user) {
                setLoggedIn(user);
                alert(`Bem-vindo, ${user.name}!`);
                window.location.href = 'index.html';
            } else {
                alert('Email ou senha incorretos');
            }
        });
    }

    const addPetForm = document.getElementById('addPetForm');
    if (addPetForm) {
        addPetForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const petName = document.getElementById('petName').value;
            const petType = document.getElementById('petType').value;
            const petBreed = document.getElementById('petBreed').value;
            const petTemperament = document.getElementById('petTemperament').value;

            const user = getLoggedUser();
            if (user) {
                const editPetId = addPetForm.getAttribute('data-edit-id');

                if (editPetId) {
                    const petIndex = user.pets.findIndex(pet => pet.id === editPetId);
                    if (petIndex > -1) {
                        user.pets[petIndex] = {
                            id: editPetId,
                            name: petName,
                            type: petType,
                            breed: petBreed,
                            temperament: petTemperament
                        };
                        saveUsers(getUsers());
                        setLoggedIn(user);
                        updatePetsList();
                        addPetForm.removeAttribute('data-edit-id');
                    }
                } else {
                    const newPet = createPet(petName, petType, petBreed, petTemperament);
                    addPetToUser(user.id, newPet);
                    alert('Pet adicionado com sucesso!');
                    updatePetsList();
                }

                addPetForm.reset();
                updatePetsList();
            } else {
                alert('Você precisa estar logado para adicionar um pet.');
            }
        });
    }

    const agendamentoModal = document.getElementById('agendamentoModal');
    const agendamentoForm = document.getElementById('agendamentoForm');

    agendamentoModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const servico = button.getAttribute('data-servico');
        const servicoSelect = document.getElementById('servico');

        servicoSelect.value = servico;
    });

    agendamentoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const servico = document.getElementById('servico').value;
        const data = document.getElementById('data').value;
        const teleBusca = document.getElementById('teleBusca').checked;

        const user = getLoggedUser();
        if (user) {
            const novoAgendamento = {
                id: generateUniqueId(),
                servico: servico,
                data: data,
                teleBusca: teleBusca
            };

            if (!user.appointments) {
                user.appointments = [];
            }
            addAppointToUser(user.id, novoAgendamento);
            alert('Agendamento realizado com sucesso!');

            const modal = bootstrap.Modal.getInstance(agendamentoModal);
            modal.hide();

            updateAppointmentsList();
        } else {
            alert('Você precisa estar logado para agendar um serviço.');
        }
    });

    if (isLoggedIn()) {
        updatePetsList();
    }

});
