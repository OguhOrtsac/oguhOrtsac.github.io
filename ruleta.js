document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const titleInput        = document.getElementById('title');
    const gameTypeSelect    = document.getElementById('game-type');
    const specificNumberContainer = document.getElementById('specific-number-container');
    const specificNumberInput     = document.getElementById('specific-number');
    const multipleWinnersContainer = document.getElementById('multiple-winners-container');
    const winnersPositionsInput    = document.getElementById('winners-positions');
    const participantNameInput     = document.getElementById('participant-name');
    const addParticipantBtn        = document.getElementById('add-participant');
    const participantsList         = document.getElementById('participants-list');
    const ruletaElement            = document.getElementById('ruleta');
    const spinBtn                  = document.getElementById('spin-btn');
    const resetBtn                 = document.getElementById('reset-btn');
    const resultDisplay            = document.getElementById('result-display');
    const resultHistory            = document.getElementById('result-history');
    const sorteoTitle              = document.getElementById('sorteo-title');
    const loading                  = document.getElementById('loading');
    const confettiContainer        = document.getElementById('confetti-container');

    // Nuevas referencias para audio
    const spinSound = document.getElementById('spin-sound');
    const winSound  = document.getElementById('win-sound');

    // Variables globales
    let participants = [];
    let results = [];
    let isSpinning = false;
    let eliminatedParticipants = [];
    let currentRound = 0;
    let winnerPositions = [];
    let nextAutoNumber = 1;

    // Esquemas de colores (igual que antes)…
    const colorSchemes = {
        default: (i, total) => i % 2 === 0
            ? 'rgba(74,30,158,0.8)'
            : 'rgba(123,82,199,0.8)',
        user:    (i, total) => participants[i].color,
        two:     (i, total) => i % 2 === 0
            ? 'rgba(21,101,192,0.8)'
            : 'rgba(46,139,87,0.8)',
        rainbow: (i, total) => [
            'rgba(255,0,0,0.8)',
            'rgba(255,127,0,0.8)',
            'rgba(255,255,0,0.8)',
            'rgba(0,255,0,0.8)',
            'rgba(0,0,255,0.8)',
            'rgba(75,0,130,0.8)',
            'rgba(148,0,211,0.8)'
        ][i % 7]
    };

    // Inicializar
    document.querySelectorAll('input[name="display"], input[name="color-scheme"]')
      .forEach(r => r.addEventListener('change', createRuleta));

    createRuleta();
    titleInput.addEventListener('input', () => {
        sorteoTitle.textContent = titleInput.value || 'Ruleta de Sorteo';
        updateControlsState();
    });
    participantNameInput.addEventListener('input', updateControlsState);
    addParticipantBtn.addEventListener('click', addParticipant);
    participantNameInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') addParticipant();
    });

    function addParticipant() {
        const name = participantNameInput.value.trim();
        if (!name) return;
        const manual = manualNumbersCheckbox.checked;
        let number;
        if (manual) {
            const numInput = document.getElementById('participant-number');
            const val = parseInt(numInput.value, 10);
            if (!val || participants.some(p => p.number === val)) {
                alert('Número inválido o duplicado');
                return;
            }
            number = val;
            nextAutoNumber = Math.max(nextAutoNumber, val + 1);
            numInput.value = '';
        } else {
            number = nextAutoNumber++;
        }
        const p = { id: Date.now(), name, number, color: getRandomColor() };
        participants.push(p);
        participants.sort((a,b) => a.number - b.number);
        participantNameInput.value = '';
        updateParticipantsList();
        createRuleta();
        updateControlsState();
    }

    function getRandomColor() {
        const palette = [
            '#4CAF50','#8BC34A','#CDDC39','#FFC107','#FF9800',
            '#FF5722','#F44336','#E91E63','#9C27B0','#673AB7',
            '#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688',
            '#795548','#607D8B','#D32F2F','#C2185B','#7B1FA2',
            '#512DA8','#303F9F','#1976D2','#0288D1','#0097A7',
            '#00796B','#388E3C','#689F38','#AFB42B','#FBC02D',
            '#FFA000','#F57C00','#E64A19','#5D4037','#455A64'
        ];
        if (participants.length >= palette.length) {
            return `rgb(${Math.random()*255|0},${Math.random()*255|0},${Math.random()*255|0})`;
        }
        const used = participants.map(p => p.color);
        const avail = palette.filter(c => !used.includes(c));
        return avail[Math.random()*avail.length|0];
    }

    function updateParticipantsList() {
        participantsList.innerHTML = '';
        participants.forEach(p => {
            const item = document.createElement('div');
            item.className = 'participant-item';
            const info = document.createElement('span');
            const preview = document.createElement('span');
            preview.className = 'participant-color-preview';
            preview.style.backgroundColor = p.color;
            info.append(preview, document.createTextNode(`${p.number}. ${p.name}`));
            const ctrls = document.createElement('div');
            ctrls.className = 'participant-controls';
            const edit = document.createElement('button');
            edit.className = 'edit-btn'; edit.textContent = 'Edit';
            edit.onclick = () => editParticipant(p.id);
            const del = document.createElement('button');
            del.className = 'remove-btn'; del.textContent = '×';
            del.onclick = () => removeParticipant(p.id);
            ctrls.append(edit, del);
            item.append(info, ctrls);
            participantsList.append(item);
        });
    }

    function editParticipant(id) {
        const p = participants.find(x => x.id === id);
        const name = prompt('Nuevo nombre:', p.name);
        if (name) { p.name = name.trim(); updateParticipantsList(); createRuleta(); }
    }

    function removeParticipant(id) {
        participants = participants.filter(p => p.id !== id);
        if (!manualNumbersCheckbox.checked) {
            participants.forEach((p,i) => p.number = i+1);
            nextAutoNumber = participants.length+1;
        }
        updateParticipantsList(); createRuleta(); updateControlsState();
    }

    // Crear la ruleta en canvas
    function createRuleta() {
        ruletaElement.innerHTML = '';
        if (!participants.length) {
            ruletaElement.innerHTML = '<div style="text-align:center;padding:30px;">Añade participantes</div>';
            return;
        }
        const canvas  = document.createElement('canvas');
        const size    = 400;
        canvas.width  = size; canvas.height = size;
        ruletaElement.append(canvas);
        const ctx     = canvas.getContext('2d');
        const center  = size/2, radius = center - 10;
        const total   = participants.length;
        const angle   = 360/total;
        const scheme  = document.querySelector('input[name="color-scheme"]:checked').value;
        const getColor= colorSchemes[scheme];

        for (let i=0; i<total; i++){
            const start = (i*angle)*Math.PI/180, end = ((i+1)*angle)*Math.PI/180;
            ctx.beginPath();
            ctx.moveTo(center,center);
            ctx.arc(center,center,radius,start,end);
            ctx.closePath();
            ctx.fillStyle = getColor(i,total);
            ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth=1; ctx.stroke();

            ctx.save();
            ctx.translate(center,center);
            ctx.rotate(start + angle/2 * Math.PI/180);
            ctx.fillStyle = '#fff'; ctx.font = '14px Arial';
            let txt = document.querySelector('input[name="display"]:checked').value;
            if (txt==='numbers')      txt = participants[i].number;
            else if (txt==='names')   txt = participants[i].name;
            else                       txt = `${participants[i].number}. ${participants[i].name}`;
            if (txt.length>15) txt = txt.substr(0,13)+'…';
            ctx.textAlign='right';
            ctx.fillText(txt, radius - 20, 5);
            ctx.restore();
        }
        // círculo central
        ctx.beginPath();
        ctx.arc(center, center, 30, 0, 2*Math.PI);
        ctx.fillStyle = '#f3c623'; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth=2; ctx.stroke();
    }

    // Evento de girar con GSAP
    spinBtn.addEventListener('click', function() {
        if (isSpinning || !participants.length) return;
        isSpinning = true;
        spinBtn.disabled = true;
        spinSound.currentTime = 0;
        spinSound.play();

        const available = participants.filter(p => !eliminatedParticipants.includes(p.id));
        const randomIndex = Math.floor(Math.random()*available.length);
        const selected    = available[randomIndex];
        const totalActive = available.length;
        const angleSlice  = 360/totalActive;
        const idxActive   = available.findIndex(p=>p.id===selected.id);
        const baseAngle   = idxActive*angleSlice + angleSlice/2;
        const spins       = 8;
        const extra       = Math.random()*360;
        const target      = spins*360 + (360 - baseAngle) + extra;

        gsap.to(ruletaElement, {
            rotation: target,
            duration: 4,
            ease: "power4.out",
            onComplete: () => {
                isSpinning = false;
                spinBtn.disabled = false;
                processResult(selected);
            }
        });
    });

    function processResult(participant) {
        currentRound++;
        // historial
        addToHistory(participant);
        // determinar ganador según tipo
        const type = gameTypeSelect.value;
        let isWinner = false;
        if (type==='last') {
            if (participants.filter(p=>!eliminatedParticipants.includes(p.id)).length===1) {
                isWinner = true;
            } else eliminatedParticipants.push(participant.id);
        }
        else if (type==='specific') {
            if (currentRound===parseInt(specificNumberInput.value,10)) isWinner=true;
            else eliminatedParticipants.push(participant.id);
        }
        else if (type==='multiple') {
            if (!winnerPositions.length) {
                winnerPositions = winnersPositionsInput.value.split(',')
                  .map(n=>parseInt(n,10)).filter(n=>n>0);
                if (!winnerPositions.length) winnerPositions=[1];
            }
            if (winnerPositions.includes(currentRound)) isWinner=true;
            else eliminatedParticipants.push(participant.id);
        }
        else if (type==='random') {
            isWinner = true;
        }
        displayResult(participant, isWinner);
        createRuleta();
        updateControlsState();
    }

    function displayResult(participant, isWinner) {
        resultDisplay.innerHTML = '';
        const el = document.createElement('div');
        if (isWinner) {
            el.className = 'winner';
            el.innerHTML = `<h3>¡GANADOR!</h3><p>${participant.number}. ${participant.name}</p>`;
            // confetti
            confettiContainer.style.display = 'block';
            confetti({ particleCount:200, spread:160, origin:{y:0.6} });
            setTimeout(()=>confettiContainer.style.display='none',3000);
            // sonido
            winSound.currentTime = 0;
            winSound.play();
            // efecto glow general
            ruletaElement.classList.add('winner');
            setTimeout(()=>ruletaElement.classList.remove('winner'),3000);
            // sparkles
            const c = document.createElement('canvas');
            c.width = ruletaElement.clientWidth;
            c.height= ruletaElement.clientHeight;
            Object.assign(c.style,{position:'absolute',top:0,left:0});
            ruletaElement.appendChild(c);
            const sctx= c.getContext('2d');
            const parts = [];
            for (let i=0;i<100;i++){
                parts.push({
                    x:c.width/2, y:c.height/2,
                    vx:(Math.random()-0.5)*8,
                    vy:(Math.random()-0.5)*8,
                    life:60
                });
            }
            (function draw() {
                sctx.clearRect(0,0,c.width,c.height);
                parts.forEach(p=>{
                    p.x+=p.vx; p.y+=p.vy; p.life--;
                    sctx.fillStyle = `rgba(255,215,0,${p.life/60})`;
                    sctx.beginPath();
                    sctx.arc(p.x,p.y,3,0,2*Math.PI);
                    sctx.fill();
                });
                if (parts.some(p=>p.life>0)) requestAnimationFrame(draw);
                else ruletaElement.removeChild(c);
            })();
        } else {
            el.className = 'eliminated';
            el.textContent = `Eliminado: ${participant.number}. ${participant.name}`;
        }
        resultDisplay.appendChild(el);
    }

    function addToHistory(participant) {
        const item = document.createElement('div');
        item.className = 'result-item';
        item.textContent = `Ronda ${currentRound}: ${participant.number}. ${participant.name}`;
        const type = gameTypeSelect.value;
        let win=false;
        if (type==='last')    win=participants.filter(p=>!eliminatedParticipants.includes(p.id)).length===1;
        else if (type==='specific') win=currentRound===parseInt(specificNumberInput.value,10);
        else if (type==='multiple') win=winnerPositions.includes(currentRound);
        else if (type==='random') win=true;
        if (win) {
            item.classList.add('winner');
            item.innerHTML = `<strong>Ronda ${currentRound}: ${participant.number}. ${participant.name} 🏆</strong>`;
            addToWinnersTable(participant, currentRound);
        }
        if (resultHistory.children.length>1)
            resultHistory.insertBefore(item, resultHistory.children[1]);
        else
            resultHistory.append(item);
    }

    function addToWinnersTable(participant, pos) {
        const tbody = document.getElementById('winners-table').querySelector('tbody');
        document.getElementById('winners-container').style.display='block';
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${pos}</td><td>${participant.number}</td><td>${participant.name}</td>`;
        tbody.append(tr);
    }

    resetBtn.addEventListener('click', function() {
        if (isSpinning) return;
        if (participants.length && currentRound>0 &&
            !confirm('¿Reiniciar sorteo? Se perderán resultados.')) return;
        currentRound=0; eliminatedParticipants=[]; results=[]; winnerPositions=[];
        resultDisplay.innerHTML=''; resultHistory.innerHTML='<h3>Historial</h3>';
        document.getElementById('winners-container').style.display='none';
        document.querySelector('#winners-table tbody').innerHTML='';
        createRuleta(); updateControlsState();
    });

    function updateControlsState() {
        const type = gameTypeSelect.value;
        const hasP = participants.length>0;
        const hasA = participants.filter(p=>!eliminatedParticipants.includes(p.id)).length>0;
        let ok = hasP && hasA;
        if (ok && type==='specific') {
            const v = parseInt(specificNumberInput.value,10);
            ok = !isNaN(v)&&v>0;
        }
        if (ok && type==='multiple') {
            ok = /^(\d+)(,\s*\d+)*$/.test(winnersPositionsInput.value.trim());
        }
        spinBtn.disabled = !ok || isSpinning;
    }

    gameTypeSelect.addEventListener('change', function() {
        specificNumberContainer.style.display = this.value==='specific' ? 'block':'none';
        multipleWinnersContainer.style.display = this.value==='multiple' ? 'block':'none';
        updateControlsState();
    });

    const manualNumbersCheckbox = document.getElementById('manual-numbers');
    manualNumbersCheckbox.addEventListener('change', function() {
        document.getElementById('participant-number-container')
          .style.display = this.checked ? 'block':'none';
    });

    document.querySelectorAll('input[name="theme"]').forEach(r => {
        r.addEventListener('change', function() {
            document.body.classList.remove(
              'theme-green','theme-red','theme-blue','theme-pink','theme-dark');
            if (this.value!=='theme-green') document.body.classList.add(this.value);
        });
    });

    // Toggle panel
    document.getElementById('toggle-panel-btn').addEventListener('click', function() {
        const panel = document.getElementById('config-panel');
        const wrapper = document.getElementById('ruleta-container');
        if (panel.style.display==='none') {
            panel.style.display='block';
            wrapper.classList.remove('ruleta-expanded');
            this.textContent='Ocultar Configuraciones';
        } else {
            panel.style.display='none';
            wrapper.classList.add('ruleta-expanded');
            this.textContent='Mostrar Configuraciones';
        }
    });
});
