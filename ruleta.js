document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const titleInput = document.getElementById('title');
    const gameTypeSelect = document.getElementById('game-type');
    const specificNumberContainer = document.getElementById('specific-number-container');
    const specificNumberInput = document.getElementById('specific-number');
    const multipleWinnersContainer = document.getElementById('multiple-winners-container');
    const winnersPositionsInput = document.getElementById('winners-positions');
    const participantNameInput = document.getElementById('participant-name');
    const addParticipantBtn = document.getElementById('add-participant');
    const participantsList = document.getElementById('participants-list');
    const ruletaElement = document.getElementById('ruleta');
    const spinBtn = document.getElementById('spin-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDisplay = document.getElementById('result-display');
    const resultHistory = document.getElementById('result-history');
    const sorteoTitle = document.getElementById('sorteo-title');
    const loading = document.getElementById('loading');
    const confettiContainer = document.getElementById('confetti-container');
    
    // Variables globales
    let participants = [];
    let results = [];
    let isSpinning = false;
    let eliminatedParticipants = [];
    let currentRound = 0;
    let winnerPositions = [];
    let nextAutoNumber = 1;
    
    // Esquemas de colores para la ruleta
    const colorSchemes = {
        default: function(index, total) {
            // Alternancia de colores morados (original)
            return index % 2 === 0 ? 
                'rgba(74, 30, 158, 0.8)' : 
                'rgba(123, 82, 199, 0.8)';
        },
        user: function(index, total) {
            // Usar color de cada participante
            return participants[index].color;
        },
        two: function(index, total) {
            // Azul y verde alternados
            return index % 2 === 0 ? 
                'rgba(21, 101, 192, 0.8)' : // Azul
                'rgba(46, 139, 87, 0.8)';   // Verde
        },
        rainbow: function(index, total) {
            // Colores del arcoíris en secuencia
            const rainbowColors = [
                'rgba(255, 0, 0, 0.8)',     // Rojo
                'rgba(255, 127, 0, 0.8)',   // Naranja
                'rgba(255, 255, 0, 0.8)',   // Amarillo
                'rgba(0, 255, 0, 0.8)',     // Verde
                'rgba(0, 0, 255, 0.8)',     // Azul
                'rgba(75, 0, 130, 0.8)',    // Índigo
                'rgba(148, 0, 211, 0.8)'    // Violeta
            ];
            return rainbowColors[index % 7];
        }
    };
    
    // Inicializar la interfaz
    document.querySelectorAll('input[name="display"], input[name="color-scheme"]').forEach(radio => {
        radio.addEventListener('change', createRuleta);
    });
    
    // Crear ruleta inicial
    createRuleta();
    
    // Eventos para validación
    titleInput.addEventListener('input', updateControlsState);
    participantNameInput.addEventListener('input', updateControlsState);
    
    // Actualizar título del sorteo
    titleInput.addEventListener('input', function() {
        sorteoTitle.textContent = this.value || 'Ruleta de Sorteo';
    });
    
    // Agregar participantes
    addParticipantBtn.addEventListener('click', function() {
        addParticipant();
    });
    
    participantNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addParticipant();
        }
    });
    
    function addParticipant() {
        const name = participantNameInput.value.trim();
        if (name) {
            const manualNumbersEnabled = manualNumbersCheckbox.checked;
            let participantNumber;
            
            if (manualNumbersEnabled) {
                const numberInput = document.getElementById('participant-number');
                const manualNumber = parseInt(numberInput.value);
                
                // Verificar si el número ya existe
                if (manualNumber && !isNaN(manualNumber)) {
                    const numberExists = participants.some(p => p.number === manualNumber);
                    if (numberExists) {
                        alert(`El número ${manualNumber} ya está asignado a otro participante.`);
                        return;
                    }
                    participantNumber = manualNumber;
                    nextAutoNumber = Math.max(nextAutoNumber, manualNumber + 1);
                } else {
                    alert("Por favor, introduce un número válido para el participante.");
                    return;
                }
                
                // Limpiar campo de número
                numberInput.value = '';
            } else {
                participantNumber = nextAutoNumber++;
            }
            
            const participant = {
                id: Date.now(),
                name: name,
                number: participantNumber,
                color: getRandomColor() // Asignar un color aleatorio
            };
            
            participants.push(participant);
            participantNameInput.value = '';
            
            // Ordenar participantes por número
            participants.sort((a, b) => a.number - b.number);
            
            updateParticipantsList();
            createRuleta();
            updateControlsState();
        }
    }
    
    // Generar un color aleatorio para cada participante
    function getRandomColor() {
        const colors = [
            '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', 
            '#FF5722', '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
            '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688',
            '#795548', '#607D8B', '#D32F2F', '#C2185B', '#7B1FA2',
            '#512DA8', '#303F9F', '#1976D2', '#0288D1', '#0097A7',
            '#00796B', '#388E3C', '#689F38', '#AFB42B', '#FBC02D',
            '#FFA000', '#F57C00', '#E64A19', '#5D4037', '#455A64'
        ];
        
        // Si ya hay más de 35 participantes, generar colores aleatorios
        if (participants.length >= colors.length) {
            return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        }
        
        // Intentar encontrar un color que no haya sido usado todavía
        const usedColors = participants.map(p => p.color);
        const availableColors = colors.filter(color => !usedColors.includes(color));
        
        if (availableColors.length > 0) {
            return availableColors[Math.floor(Math.random() * availableColors.length)];
        } else {
            return colors[Math.floor(Math.random() * colors.length)];
        }
    }
    
    function updateParticipantsList() {
        participantsList.innerHTML = '';
        
        participants.forEach(participant => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'participant-item';
            
            const infoSpan = document.createElement('span');
            const colorPreview = document.createElement('span');
            colorPreview.className = 'participant-color-preview';
            colorPreview.style.backgroundColor = participant.color;
            
            infoSpan.appendChild(colorPreview);
            infoSpan.appendChild(document.createTextNode(`${participant.number}. ${participant.name}`));
            
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'participant-controls';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = 'Edit';
            editBtn.title = 'Editar participante';
            editBtn.addEventListener('click', function() {
                editParticipant(participant.id);
            });
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.title = 'Eliminar participante';
            removeBtn.addEventListener('click', function() {
                removeParticipant(participant.id);
            });
            
            controlsDiv.appendChild(editBtn);
            controlsDiv.appendChild(removeBtn);
            
            itemDiv.appendChild(infoSpan);
            itemDiv.appendChild(controlsDiv);
            participantsList.appendChild(itemDiv);
        });
    }
    
    function editParticipant(id) {
        const participant = participants.find(p => p.id === id);
        if (!participant) return;
        
        const newName = prompt('Editar nombre del participante:', participant.name);
        if (newName !== null && newName.trim() !== '') {
            participant.name = newName.trim();
            updateParticipantsList();
            createRuleta();
        }
    }
    
    function removeParticipant(id) {
        participants = participants.filter(p => p.id !== id);
        
        // Si no se usan números manuales, actualizar la secuencia automática
        if (!manualNumbersCheckbox.checked) {
            participants.forEach((participant, index) => {
                participant.number = index + 1;
            });
            nextAutoNumber = participants.length + 1;
        }
        
        updateParticipantsList();
        createRuleta();
        updateControlsState();
    }
    
    // Crear la ruleta
    function createRuleta() {
        if (participants.length === 0) {
            ruletaElement.innerHTML = '<div style="text-align: center; padding: 30px;">Agrega participantes para crear la ruleta</div>';
            return;
        }
        
        ruletaElement.innerHTML = '';
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        const spinnerArrow = document.createElement('div');
        spinnerArrow.className = 'spinner-arrow';
        spinner.appendChild(spinnerArrow);
        ruletaElement.appendChild(spinner);
        
        const totalParticipants = participants.length;
        const anglePerSlice = 360 / totalParticipants;
        
        // Obtener el esquema de color seleccionado
        const selectedColorScheme = document.querySelector('input[name="color-scheme"]:checked').value;
        const getSliceColor = colorSchemes[selectedColorScheme];
        
        // Crear canvas para la ruleta
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        ruletaElement.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const center = canvas.width / 2;
        const radius = center - 10;
        
        // Dibujar segmentos de la ruleta
        for (let i = 0; i < totalParticipants; i++) {
            const startAngle = (i * anglePerSlice) * Math.PI / 180;
            const endAngle = ((i + 1) * anglePerSlice) * Math.PI / 180;
            
            // Obtener color del segmento según el esquema seleccionado
            const sliceColor = getSliceColor(i, totalParticipants);
            
            // Dibujar segmento
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = sliceColor;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            
            // Dibujar texto
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + anglePerSlice / 2);
            
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            
            // Mostrar número, nombre o ambos según la opción seleccionada
            let displayText = '';
            const displayOption = document.querySelector('input[name="display"]:checked').value;
            
            if (displayOption === 'numbers') {
                displayText = participants[i].number.toString();
            } else if (displayOption === 'names') {
                displayText = participants[i].name;
            } else {
                displayText = `${participants[i].number}. ${participants[i].name}`;
            }
            
            // Truncar texto largo
            if (displayText.length > 15) {
                displayText = displayText.substring(0, 13) + '...';
            }
            
            ctx.fillText(displayText, radius - 20, 5);
            ctx.restore();
        }
        
        // Dibujar círculo central
        ctx.beginPath();
        ctx.arc(center, center, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#f3c623';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
    }
    
    // Girar la ruleta
    spinBtn.addEventListener('click', function() {
        if (isSpinning || participants.length === 0) return;
        
        // Validar configuración
        const gameType = gameTypeSelect.value;
        let isConfigValid = true;
        
        if (gameType === 'specific') {
            const specificNumber = parseInt(specificNumberInput.value);
            if (isNaN(specificNumber) || specificNumber <= 0) {
                alert('Por favor, introduce un número válido para el ganador.');
                isConfigValid = false;
            }
        } else if (gameType === 'multiple') {
            const positions = winnersPositionsInput.value.trim();
            if (positions === '' || !/^(\d+)(,\s*\d+)*$/.test(positions)) {
                alert('Por favor, introduce posiciones válidas para los ganadores (números separados por comas).');
                isConfigValid = false;
            }
        }
        
        if (!isConfigValid) return;
        
        // Si todos los participantes han sido eliminados, reiniciar
        const remainingParticipants = participants.filter(
            p => !eliminatedParticipants.includes(p.id)
        );
        
        if (remainingParticipants.length === 0) {
            alert('Todos los participantes han sido eliminados. Reinicia el sorteo.');
            return;
        }
        
        isSpinning = true;
        spinBtn.disabled = true;
        loading.style.display = 'block';
        
        currentRound++;
        
        // Determinar participante seleccionado
        const availableParticipants = participants.filter(
            p => !eliminatedParticipants.includes(p.id)
        );
        
        const randomIndex = Math.floor(Math.random() * availableParticipants.length);
        const selectedParticipant = availableParticipants[randomIndex];
        
        // Calcular ángulo para que apunte al participante seleccionado
        const totalActive = availableParticipants.length;
        const activeIndex = availableParticipants.findIndex(p => p.id === selectedParticipant.id);
        const anglePerSlice = 360 / totalActive;
        const targetAngle = (activeIndex * anglePerSlice) + anglePerSlice / 2;
        
        // Calcular grados adicionales para dar varias vueltas
        const spins = 5; // Número de vueltas completas
        const extraDegrees = Math.floor(Math.random() * 360); // Grados aleatorios adicionales
        const totalRotation = (360 * spins) + (360 - targetAngle) + extraDegrees;
        
        // Animar ruleta
        ruletaElement.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
        ruletaElement.style.transform = `rotate(${totalRotation}deg)`;
        
        // Animar la flecha
        const spinnerArrow = document.querySelector('.spinner-arrow');
        if (spinnerArrow) {
            spinnerArrow.style.transform = 'translateX(-50%) scale(1.2)';
            setTimeout(() => {
                spinnerArrow.style.transform = 'translateX(-50%)';
            }, 500);
        }
        
        // Procesar resultado después de que termine la animación
        setTimeout(() => {
            isSpinning = false;
            spinBtn.disabled = false;
            loading.style.display = 'none';
            
            processResult(selectedParticipant);
            updateControlsState();
        }, 5000);
    });
    
    // Procesar resultado de la ruleta
    function processResult(participant) {
        const gameType = gameTypeSelect.value;
        
        // Agregar al historial
        addToHistory(participant);
        
        // Determinar si es ganador según el tipo de juego
        let isWinner = false;
        
        if (gameType === 'last') {
            // El último en quedar es el ganador
            const remainingCount = participants.filter(p => !eliminatedParticipants.includes(p.id)).length;
            
            if (remainingCount === 1) {
                isWinner = true;
            } else {
                eliminatedParticipants.push(participant.id);
            }
        } 
        else if (gameType === 'specific') {
            // El participante en la posición específica es el ganador
            const position = parseInt(specificNumberInput.value);
            if (currentRound === position) {
                isWinner = true;
            } else if (currentRound < position) {
                eliminatedParticipants.push(participant.id);
            }
        } 
        else if (gameType === 'multiple') {
            // Varios participantes en posiciones específicas son ganadores
            if (winnerPositions.length === 0) {
                // Inicializar posiciones ganadoras si no se ha hecho ya
                const positions = winnersPositionsInput.value.split(',')
                    .map(pos => parseInt(pos.trim()))
                    .filter(pos => !isNaN(pos) && pos > 0);
                
                if (positions.length === 0) {
                    positions.push(1); // Por defecto, el primero es ganador
                }
                
                winnerPositions = positions;
            }
            
            if (winnerPositions.includes(currentRound)) {
                isWinner = true;
            } else {
                eliminatedParticipants.push(participant.id);
            }
        } 
        else if (gameType === 'random') {
            // Cualquier participante puede ser ganador
            isWinner = true;
        }
        
        // Mostrar resultado
        displayResult(participant, isWinner);
        
        // Actualizar la ruleta para reflejar los participantes eliminados
        createRuleta();
    }
    
    // Mostrar resultado en pantalla
    function displayResult(participant, isWinner) {
        const resultElement = document.createElement('div');
        
        if (isWinner) {
            resultElement.className = 'winner';
            resultElement.innerHTML = `
                <h3>¡GANADOR!</h3>
                <p>${participant.number}. ${participant.name}</p>
            `;
            
            // Mostrar confeti
            confettiContainer.style.display = 'block';
            confetti({
                particleCount: 200,
                spread: 160,
                origin: { y: 0.6 },
                colors: ['#ffa500', '#2e8b57', '#3cb371', '#ff6347', '#4169e1', '#9932cc']
            });
            
            setTimeout(() => {
                confettiContainer.style.display = 'none';
            }, 5000);
        } else {
            resultElement.className = 'eliminated';
            resultElement.innerHTML = `
                <p>Eliminado: ${participant.number}. ${participant.name}</p>
            `;
        }
        
        resultDisplay.innerHTML = '';
        resultDisplay.appendChild(resultElement);
    }
    
    // Agregar al historial
    function addToHistory(participant) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.textContent = `Ronda ${currentRound}: ${participant.number}. ${participant.name}`;
        
        // Verificar si es ganador según el tipo de juego
        const gameType = gameTypeSelect.value;
        let isWinner = false;
        
        if (gameType === 'last') {
            // El último en quedar es el ganador
            const remainingCount = participants.filter(p => !eliminatedParticipants.includes(p.id)).length;
            isWinner = remainingCount === 1;
        } 
        else if (gameType === 'specific') {
            // El participante en la posición específica es el ganador
            const position = parseInt(specificNumberInput.value);
            isWinner = currentRound === position;
        } 
        else if (gameType === 'multiple') {
            // Varios participantes en posiciones específicas son ganadores
            if (winnerPositions.length === 0) {
                // Inicializar posiciones ganadoras si no se ha hecho ya
                const positions = winnersPositionsInput.value.split(',')
                    .map(pos => parseInt(pos.trim()))
                    .filter(pos => !isNaN(pos) && pos > 0);
                
                if (positions.length === 0) {
                    positions.push(1); // Por defecto, el primero es ganador
                }
                
                winnerPositions = positions;
            }
            
            isWinner = winnerPositions.includes(currentRound);
        } 
        else if (gameType === 'random') {
            // Cualquier participante puede ser ganador
            isWinner = true;
        }
        
        // Marcar en el historial si es ganador
        if (isWinner) {
            resultItem.classList.add('winner');
            resultItem.innerHTML = `<strong>Ronda ${currentRound}: ${participant.number}. ${participant.name} 🏆</strong>`;
            
            // Agregar a la tabla de ganadores
            addToWinnersTable(participant, currentRound);
        }
        
        // Añadir al principio para que los más recientes estén arriba
        if (resultHistory.children.length > 1) {
            resultHistory.insertBefore(resultItem, resultHistory.children[1]);
        } else {
            resultHistory.appendChild(resultItem);
        }
        
        // Guardar en el historial
        results.push({
            round: currentRound,
            participant: participant,
            isWinner: isWinner
        });
    }
    
    // Agregar a la tabla de ganadores
    function addToWinnersTable(participant, position) {
        const winnersContainer = document.getElementById('winners-container');
        const winnersTable = document.getElementById('winners-table').getElementsByTagName('tbody')[0];
        
        // Mostrar la tabla si está oculta
        winnersContainer.style.display = 'block';
        
        // Crear fila
        const row = document.createElement('tr');
        row.className = 'winner';
        
        // Posición
        const posCell = document.createElement('td');
        posCell.textContent = position;
        
        // Número
        const numCell = document.createElement('td');
        numCell.textContent = participant.number;
        
        // Nombre
        const nameCell = document.createElement('td');
        nameCell.textContent = participant.name;
        
        // Añadir celdas a la fila
        row.appendChild(posCell);
        row.appendChild(numCell);
        row.appendChild(nameCell);
        
        // Añadir fila a la tabla
        winnersTable.appendChild(row);
    }
    
    // Reiniciar el sorteo
    resetBtn.addEventListener('click', function() {
        if (isSpinning) return;
        
        // Confirmar reinicio
        if (participants.length > 0 && currentRound > 0) {
            if (!confirm('¿Estás seguro de que deseas reiniciar el sorteo? Se perderán todos los resultados.')) {
                return;
            }
        }
        
        // Reiniciar variables
        currentRound = 0;
        eliminatedParticipants = [];
        results = [];
        winnerPositions = [];
        
        // Reiniciar UI
        const spinnerArrow = document.querySelector('.spinner-arrow');
        if (spinnerArrow) {
            spinnerArrow.style.transition = 'none';
            spinnerArrow.style.transform = 'translateX(-50%)';
        }
        
        resultDisplay.innerHTML = '';
        resultHistory.innerHTML = '<h3>Historial</h3>';
        
        // Ocultar tabla de ganadores
        const winnersContainer = document.getElementById('winners-container');
        winnersContainer.style.display = 'none';
        const winnersTable = document.getElementById('winners-table').getElementsByTagName('tbody')[0];
        winnersTable.innerHTML = '';
        
        // Refrescar ruleta
        setTimeout(() => {
            createRuleta();
            updateControlsState();
        }, 50);
    });
    
    // Validar formulario y actualizar estado de botones
    function updateControlsState() {
        const gameType = gameTypeSelect.value;
        const hasParticipants = participants.length > 0;
        const hasActiveParticipants = participants.filter(p => !eliminatedParticipants.includes(p.id)).length > 0;
        let isValid = hasParticipants && hasActiveParticipants;
        
        // Verificar campos adicionales según el tipo de juego
        if (isValid && gameType === 'specific') {
            const specificNumber = parseInt(specificNumberInput.value);
            isValid = !isNaN(specificNumber) && specificNumber > 0;
        }
        
        if (isValid && gameType === 'multiple') {
            const positions = winnersPositionsInput.value.trim();
            isValid = positions !== '' && /^(\d+)(,\s*\d+)*$/.test(positions);
        }
        
        // Actualizar estado del botón de girar
        spinBtn.disabled = !isValid || isSpinning;
    }
    
    // Escuchar cambios en los campos de configuración
    gameTypeSelect.addEventListener('change', function() {
        specificNumberContainer.style.display = 
            this.value === 'specific' ? 'block' : 'none';
        
        multipleWinnersContainer.style.display = 
            this.value === 'multiple' ? 'block' : 'none';
            
        updateControlsState();
    });
    
    // Mostrar/ocultar campo de número manual
    const manualNumbersCheckbox = document.getElementById('manual-numbers');
    const participantNumberContainer = document.getElementById('participant-number-container');
    
    manualNumbersCheckbox.addEventListener('change', function() {
        participantNumberContainer.style.display = 
            this.checked ? 'block' : 'none';
    });
    
    // Toggle para mostrar/ocultar panel de configuración
    const togglePanelBtn = document.getElementById('toggle-panel-btn');
    const configPanel = document.getElementById('config-panel');
    const appContainer = document.getElementById('app-container');
    const ruletaContainer = document.getElementById('ruleta-container');
    
    togglePanelBtn.addEventListener('click', function() {
        if (configPanel.style.display === 'none') {
            configPanel.style.display = 'block';
            ruletaContainer.classList.remove('ruleta-expanded');
            togglePanelBtn.textContent = 'Ocultar Configuraciones';
        } else {
            configPanel.style.display = 'none';
            ruletaContainer.classList.add('ruleta-expanded');
            togglePanelBtn.textContent = 'Mostrar Configuraciones';
        }
    });
    
    // Manejo del cambio de temas
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Remover todas las clases de tema del body
            document.body.classList.remove('theme-green', 'theme-red', 'theme-blue', 'theme-pink', 'theme-dark');
            
            // Si se seleccionó un tema diferente del verde (predeterminado), añadir la clase
            if (this.value !== 'theme-green') {
                document.body.classList.add(this.value);
            }
        });
    });
});
