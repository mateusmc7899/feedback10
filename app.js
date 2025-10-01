// Application data
const DATA = {
  disciplinas_medicas: [
    {"id": 1, "nome": "Cardiologia", "assuntos": ["Arritmias", "Insuficiência Cardíaca", "Coronariopatias", "Hipertensão", "Valvopatias"]},
    {"id": 2, "nome": "Pneumologia", "assuntos": ["Asma", "DPOC", "Pneumonias", "Derrame Pleural", "Embolia Pulmonar"]},
    {"id": 3, "nome": "Gastroenterologia", "assuntos": ["DRGE", "Úlcera Péptica", "Hepatites", "Cirrose", "Pancreatite"]},
    {"id": 4, "nome": "Neurologia", "assuntos": ["AVC", "Epilepsia", "Cefaléias", "Demências", "Parkinson"]},
    {"id": 5, "nome": "Endocrinologia", "assuntos": ["Diabetes", "Tireoidopatias", "Obesidade", "Osteoporose", "Adrenal"]},
    {"id": 6, "nome": "Ginecologia", "assuntos": ["Amenorreia", "Sangramento Uterino", "Endometriose", "Miomatose", "Climatério"]},
    {"id": 7, "nome": "Urologia", "assuntos": ["ITU", "Litíase Renal", "HPB", "Câncer de Próstata", "Disfunção Erétil"]},
    {"id": 8, "nome": "Dermatologia", "assuntos": ["Dermatite", "Psoríase", "Melanoma", "Acne", "Infecções Fúngicas"]},
    {"id": 9, "nome": "Oftalmologia", "assuntos": ["Glaucoma", "Catarata", "Retinopatia", "Conjuntivite", "Uveíte"]},
    {"id": 10, "nome": "Otorrinolaringologia", "assuntos": ["Otite", "Sinusite", "Faringite", "Vertigem", "Perda Auditiva"]}
  ],
  tipos_aves: [
    {"name": "Canário", "rarity": "comum", "weight": 50, "emoji": "🐤"},
    {"name": "Bem-te-vi", "rarity": "comum", "weight": 50, "emoji": "🐦"}, 
    {"name": "Sabiá", "rarity": "incomum", "weight": 30, "emoji": "🐦"},
    {"name": "Cardeal", "rarity": "raro", "weight": 15, "emoji": "🐦"},
    {"name": "Uirapuru", "rarity": "lendário", "weight": 5, "emoji": "🦅"}
  ],
  cores_aves: ["azul", "vermelho", "verde", "amarelo", "roxo", "dourado"],
  estagios_pet: [
    {"stage": "egg", "name": "Ovo", "emoji": "🥚", "minDays": 0, "maxDays": 7},
    {"stage": "hatching", "name": "Eclodindo", "emoji": "🐣", "minDays": 1, "maxDays": 7},
    {"stage": "chick", "name": "Filhote", "emoji": "🐤", "minDays": 8, "maxDays": 21},
    {"stage": "young", "name": "Jovem", "emoji": "🐦", "minDays": 22, "maxDays": 45},
    {"stage": "teenager", "name": "Adolescente", "emoji": "🦜", "minDays": 46, "maxDays": 90},
    {"stage": "adult", "name": "Adulto", "emoji": "🦅", "minDays": 91, "maxDays": 999}
  ],
  conquistas: [
    {"id": "primeira_eclosao", "name": "Primeira Eclosão", "desc": "Seu primeiro ovo eclodiu!", "icon": "🐣"},
    {"id": "sequencia_7", "name": "Uma Semana", "desc": "7 dias consecutivos estudando", "icon": "📚"},
    {"id": "sequencia_30", "name": "Um Mês", "desc": "30 dias consecutivos estudando", "icon": "🗓️"},
    {"id": "questoes_100", "name": "Centena", "desc": "100 questões respondidas corretamente", "icon": "💯"},
    {"id": "questoes_1000", "name": "Milhar", "desc": "1000 questões respondidas corretamente", "icon": "🏆"},
    {"id": "performance_80", "name": "Excelência", "desc": "Performance média acima de 80%", "icon": "⭐"},
    {"id": "ave_adulta", "name": "Ave Madura", "desc": "Primeira ave chegou à fase adulta", "icon": "🦅"},
    {"id": "colecao_5", "name": "Colecionador", "desc": "5 aves diferentes na coleção", "icon": "🏅"},
    {"id": "tempo_100h", "name": "Dedicação", "desc": "100 horas de estudo acumuladas", "icon": "⏱️"},
    {"id": "sequencia_100", "name": "Persistência", "desc": "100 dias consecutivos estudando", "icon": "🔥"}
  ]
};

const BIRD_VISUALS = {
  'egg': '🥚',
  'hatching': '🐣',
  'chick': '🐤',
  'young': '🐦',
  'teenager': '🦜',
  'adult': {
    'Canário': '🐤',
    'Bem-te-vi': '🦅',
    'Sabiá': '🐦',
    'Cardeal': '🦜',
    'Uirapuru': '🦅'
  }
};

// Storage Helper
class StorageHelper {
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error getting from storage:', error);
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting to storage:', error);
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

// Study Timer System
class StudyTimer {
  constructor() {
    this.startTime = null;
    this.elapsedTime = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.interval = null;
    this.lastActiveTime = Date.now();
    this.wasActiveBeforePause = true;
    
    this.initElements();
    this.bindEvents();
    this.checkVisibility();
  }

  initElements() {
    this.displayElement = document.getElementById('timer-display');
    this.startBtn = document.getElementById('start-timer');
    this.pauseBtn = document.getElementById('pause-timer');
    this.stopBtn = document.getElementById('stop-timer');
    this.statusElement = document.getElementById('timer-status');
    this.studyDurationInput = document.getElementById('study-duration');
  }

  bindEvents() {
    this.startBtn.addEventListener('click', () => this.start());
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    this.stopBtn.addEventListener('click', () => this.stop());
    
    // Visibility change detection
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isRunning && !this.isPaused) {
        this.autoPause();
      } else if (!document.hidden && this.isRunning && this.isPaused && this.wasActiveBeforePause) {
        // Don't auto-resume, just show status
        this.showPauseNotification('Timer pausado - clique continuar para retomar');
      }
    });
    
    // Window focus/blur events
    window.addEventListener('blur', () => {
      if (this.isRunning && !this.isPaused) {
        this.autoPause();
      }
    });

    window.addEventListener('focus', () => {
      if (this.isRunning && this.isPaused && this.wasActiveBeforePause) {
        this.showPauseNotification('Timer pausado - clique continuar para retomar');
      }
    });
  }

  checkVisibility() {
    setInterval(() => {
      const now = Date.now();
      if (this.isRunning && !this.isPaused) {
        if (document.hidden || !document.hasFocus()) {
          if (now - this.lastActiveTime > 2000) { // 2 seconds tolerance
            this.autoPause();
          }
        } else {
          this.lastActiveTime = now;
          this.hidePauseNotification();
        }
      }
    }, 1000);
  }

  start() {
    if (!this.isRunning) {
      this.startTime = Date.now() - this.elapsedTime;
      this.isRunning = true;
      this.isPaused = false;
      this.wasActiveBeforePause = true;
      this.lastActiveTime = Date.now();
      
      this.interval = setInterval(() => this.updateDisplay(), 100);
      
      this.startBtn.classList.add('hidden');
      this.pauseBtn.classList.remove('hidden');
      this.pauseBtn.textContent = '⏸️ Pausar';
      this.hidePauseNotification();
    }
  }

  togglePause() {
    if (this.isRunning) {
      if (this.isPaused) {
        // Resume
        this.isPaused = false;
        this.wasActiveBeforePause = true;
        this.lastActiveTime = Date.now();
        this.startTime = Date.now() - this.elapsedTime;
        this.interval = setInterval(() => this.updateDisplay(), 100);
        
        this.pauseBtn.textContent = '⏸️ Pausar';
        this.hidePauseNotification();
      } else {
        // Manual pause
        this.isPaused = true;
        this.wasActiveBeforePause = false;
        clearInterval(this.interval);
        
        this.pauseBtn.textContent = '▶️ Continuar';
        this.showPauseNotification('Timer pausado manualmente');
      }
    }
  }

  autoPause() {
    if (this.isRunning && !this.isPaused) {
      this.isPaused = true;
      this.wasActiveBeforePause = true;
      clearInterval(this.interval);
      
      this.pauseBtn.textContent = '▶️ Continuar';
      this.showPauseNotification('Timer pausado - app inativo');
    }
  }

  stop() {
    if (this.isRunning) {
      const totalMinutes = Math.floor(this.elapsedTime / 60000);
      if (totalMinutes > 0) {
        this.studyDurationInput.value = totalMinutes;
      }
    }
    
    this.isRunning = false;
    this.isPaused = false;
    this.elapsedTime = 0;
    this.wasActiveBeforePause = true;
    clearInterval(this.interval);
    
    this.displayElement.textContent = '00:00:00';
    this.startBtn.classList.remove('hidden');
    this.pauseBtn.classList.add('hidden');
    this.pauseBtn.textContent = '⏸️ Pausar';
    this.hidePauseNotification();
  }

  updateDisplay() {
    if (this.isRunning && !this.isPaused && !document.hidden && document.hasFocus()) {
      this.elapsedTime = Date.now() - this.startTime;
      this.displayElement.textContent = this.formatTime(this.elapsedTime);
    }
  }

  formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  showPauseNotification(message = 'Timer pausado - app inativo') {
    this.statusElement.textContent = message;
    this.statusElement.classList.remove('hidden');
  }

  hidePauseNotification() {
    this.statusElement.classList.add('hidden');
  }

  getElapsedMinutes() {
    return Math.floor(this.elapsedTime / 60000);
  }
}

// Pet System
class PetSystem {
  constructor() {
    this.currentPet = this.loadCurrentPet();
    this.initElements();
    this.updateDisplay();
  }

  initElements() {
    this.petVisual = document.getElementById('pet-visual');
    this.petName = document.getElementById('pet-name');
    this.petStage = document.getElementById('pet-stage');
    this.petDays = document.getElementById('pet-days');
    this.petProgressFill = document.getElementById('pet-progress-fill');
    this.petProgressText = document.getElementById('pet-progress-text');
  }

  loadCurrentPet() {
    return StorageHelper.get('currentPet', {
      stage: 'egg',
      daysSinceStart: 0,
      studyStreak: 0,
      totalCorrectAnswers: 0,
      totalStudyTime: 0,
      createdAt: Date.now(),
      type: null,
      color: null
    });
  }

  savePet() {
    StorageHelper.set('currentPet', this.currentPet);
  }

  addProgress(studyData) {
    const { correctAnswers, studyTime, isNewDay } = studyData;
    
    // Update pet stats
    this.currentPet.totalCorrectAnswers += correctAnswers;
    this.currentPet.totalStudyTime += studyTime;
    
    if (isNewDay) {
      this.currentPet.daysSinceStart++;
      this.currentPet.studyStreak++;
    }

    // Check for evolution
    this.checkEvolution();
    this.savePet();
    this.updateDisplay();
  }

  checkEvolution() {
    const currentStageIndex = DATA.estagios_pet.findIndex(s => s.stage === this.currentPet.stage);
    const currentStageData = DATA.estagios_pet[currentStageIndex];
    
    // Check if pet meets evolution criteria
    const meetsTimeCriteria = this.currentPet.daysSinceStart >= currentStageData.maxDays;
    const meetsStudyCriteria = this.currentPet.studyStreak >= Math.floor(currentStageData.maxDays / 2);
    const meetsQuestionsCriteria = this.currentPet.totalCorrectAnswers >= currentStageData.maxDays * 5;
    
    if (meetsTimeCriteria || (meetsStudyCriteria && meetsQuestionsCriteria)) {
      this.evolvePet();
    }
  }

  evolvePet() {
    const currentStageIndex = DATA.estagios_pet.findIndex(s => s.stage === this.currentPet.stage);
    
    if (currentStageIndex < DATA.estagios_pet.length - 1) {
      // Normal evolution
      const nextStage = DATA.estagios_pet[currentStageIndex + 1];
      this.currentPet.stage = nextStage.stage;
      this.currentPet.daysSinceStart = nextStage.minDays;
      
      // Assign type and color when hatching
      if (nextStage.stage === 'chick' && !this.currentPet.type) {
        this.assignBirdTypeAndColor();
      }
      
      this.showEvolutionAnimation();
      
      if (nextStage.stage === 'chick') {
        window.app.achievementSystem.unlock('primeira_eclosao');
      } else if (nextStage.stage === 'adult') {
        window.app.achievementSystem.unlock('ave_adulta');
      }
      
    } else {
      // Adult bird - move to collection and create new egg
      this.moveToCollectionAndReset();
    }
  }

  assignBirdTypeAndColor() {
    // Weighted random selection for bird type
    const totalWeight = DATA.tipos_aves.reduce((sum, bird) => sum + bird.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const bird of DATA.tipos_aves) {
      random -= bird.weight;
      if (random <= 0) {
        this.currentPet.type = bird.name;
        this.currentPet.rarity = bird.rarity;
        break;
      }
    }
    
    // Random color selection
    this.currentPet.color = DATA.cores_aves[Math.floor(Math.random() * DATA.cores_aves.length)];
  }

  moveToCollectionAndReset() {
    // Add current pet to collection
    window.app.birdCollection.addBird({
      type: this.currentPet.type,
      rarity: this.currentPet.rarity,
      color: this.currentPet.color,
      obtainedAt: Date.now()
    });
    
    // Reset to new egg
    this.currentPet = {
      stage: 'egg',
      daysSinceStart: 0,
      studyStreak: this.currentPet.studyStreak, // Keep streak
      totalCorrectAnswers: 0,
      totalStudyTime: 0,
      createdAt: Date.now(),
      type: null,
      color: null
    };
    
    this.savePet();
    this.updateDisplay();
  }

  showEvolutionAnimation() {
    this.petVisual.classList.add('evolution');
    setTimeout(() => {
      this.petVisual.classList.remove('evolution');
    }, 1000);
  }

  updateDisplay() {
    const stageData = DATA.estagios_pet.find(s => s.stage === this.currentPet.stage);
    
    // Update visual
    if (this.currentPet.stage === 'adult' && this.currentPet.type) {
      const birdType = DATA.tipos_aves.find(b => b.name === this.currentPet.type);
      this.petVisual.textContent = birdType ? birdType.emoji : BIRD_VISUALS.adult['Canário'];
    } else {
      this.petVisual.textContent = stageData.emoji;
    }
    
    // Update info
    if (this.currentPet.stage === 'adult' && this.currentPet.type) {
      this.petName.textContent = `${this.currentPet.type} ${this.currentPet.color}`;
    } else {
      this.petName.textContent = stageData.name;
    }
    
    this.petStage.textContent = stageData.name;
    this.petDays.textContent = `Dia ${this.currentPet.daysSinceStart} de ${stageData.maxDays}`;
    
    // Update progress
    const progress = Math.min((this.currentPet.daysSinceStart / stageData.maxDays) * 100, 100);
    this.petProgressFill.style.width = `${progress}%`;
    this.petProgressText.textContent = `${Math.floor(progress)}% para próxima evolução`;
  }
}

// Bird Collection System
class BirdCollection {
  constructor() {
    this.collection = this.loadCollection();
  }

  loadCollection() {
    return StorageHelper.get('birdCollection', []);
  }

  saveCollection() {
    StorageHelper.set('birdCollection', this.collection);
  }

  addBird(birdData) {
    this.collection.push(birdData);
    this.saveCollection();
    this.updateDisplay();
    
    // Check collection achievements
    if (this.collection.length >= 5) {
      window.app.achievementSystem.unlock('colecao_5');
    }
  }

  updateDisplay() {
    const container = document.getElementById('birds-collection');
    const countElement = document.getElementById('collection-count');
    
    if (!container || !countElement) return;
    
    countElement.textContent = this.collection.length;
    
    if (this.collection.length === 0) {
      container.innerHTML = '<p class="text-secondary">Sua coleção está vazia. Continue estudando para ganhar suas primeiras aves!</p>';
      return;
    }
    
    container.innerHTML = this.collection.map((bird, index) => {
      const birdType = DATA.tipos_aves.find(b => b.name === bird.type);
      const emoji = birdType ? birdType.emoji : '🐦';
      
      return `
        <div class="bird-card">
          <div class="bird-visual">${emoji}</div>
          <div class="bird-name">${bird.type}</div>
          <div class="bird-rarity ${bird.rarity}">${bird.rarity}</div>
          <div class="bird-color" style="color: ${this.getColorValue(bird.color)};">● ${bird.color}</div>
          <div class="bird-obtained-date">${new Date(bird.obtainedAt).toLocaleDateString('pt-BR')}</div>
        </div>
      `;
    }).join('');
  }

  getColorValue(colorName) {
    const colorMap = {
      'azul': '#3b82f6',
      'vermelho': '#ef4444',
      'verde': '#22c55e',
      'amarelo': '#f59e0b',
      'roxo': '#a855f7',
      'dourado': '#f59e0b'
    };
    return colorMap[colorName] || '#6b7280';
  }
}

// Achievement System
class AchievementSystem {
  constructor() {
    this.unlockedAchievements = this.loadAchievements();
    this.updateDisplay();
  }

  loadAchievements() {
    return StorageHelper.get('achievements', []);
  }

  saveAchievements() {
    StorageHelper.set('achievements', this.unlockedAchievements);
  }

  unlock(achievementId) {
    if (!this.unlockedAchievements.includes(achievementId)) {
      this.unlockedAchievements.push(achievementId);
      this.saveAchievements();
      this.showNotification(achievementId);
      this.updateDisplay();
    }
  }

  showNotification(achievementId) {
    const achievement = DATA.conquistas.find(a => a.id === achievementId);
    if (!achievement) return;
    
    const notification = document.getElementById('achievement-notification');
    if (!notification) return;
    
    const icon = notification.querySelector('.achievement-icon');
    const name = notification.querySelector('.achievement-name');
    const desc = notification.querySelector('.achievement-desc');
    
    if (icon) icon.textContent = achievement.icon;
    if (name) name.textContent = achievement.name;
    if (desc) desc.textContent = achievement.desc;
    
    notification.classList.remove('hidden');
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.classList.add('hidden');
      }, 300);
    }, 3000);
  }

  updateDisplay() {
    const container = document.getElementById('achievements-list');
    const unlockedCount = document.getElementById('achievements-unlocked');
    const totalCount = document.getElementById('achievements-total');
    
    if (!container) return;
    
    if (unlockedCount) unlockedCount.textContent = this.unlockedAchievements.length;
    if (totalCount) totalCount.textContent = DATA.conquistas.length;
    
    container.innerHTML = DATA.conquistas.map(achievement => {
      const isUnlocked = this.unlockedAchievements.includes(achievement.id);
      return `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-info">
            <div class="achievement-title">${achievement.name}</div>
            <p class="achievement-description">${achievement.desc}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  checkAchievements(stats) {
    // Check various achievement conditions
    if (stats.studyStreak >= 7) {
      this.unlock('sequencia_7');
    }
    if (stats.studyStreak >= 30) {
      this.unlock('sequencia_30');
    }
    if (stats.studyStreak >= 100) {
      this.unlock('sequencia_100');
    }
    if (stats.totalCorrectAnswers >= 100) {
      this.unlock('questoes_100');
    }
    if (stats.totalCorrectAnswers >= 1000) {
      this.unlock('questoes_1000');
    }
    if (stats.averagePerformance >= 80) {
      this.unlock('performance_80');
    }
    if (stats.totalStudyTime >= 6000) { // 100 hours in minutes
      this.unlock('tempo_100h');
    }
  }
}

// Review System with SM-2 Algorithm
class ReviewSystem {
  constructor() {
    this.reviews = this.loadReviews();
    this.updateDisplay();
  }

  loadReviews() {
    return StorageHelper.get('reviews', []);
  }

  saveReviews() {
    StorageHelper.set('reviews', this.reviews);
  }

  addOrUpdateReview(discipline, topic) {
    const existingIndex = this.reviews.findIndex(r => 
      r.discipline === discipline && r.topic === topic
    );
    
    if (existingIndex !== -1) {
      // Update existing review - reset to beginning
      this.reviews[existingIndex] = this.createNewReview(discipline, topic);
    } else {
      // Add new review
      this.reviews.push(this.createNewReview(discipline, topic));
    }
    
    this.saveReviews();
    this.updateDisplay();
  }

  createNewReview(discipline, topic) {
    return {
      id: Date.now() + Math.random(), // Ensure unique ID
      discipline,
      topic,
      easinessFactor: 2.5,
      repetition: 0,
      interval: 1,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      createdAt: Date.now()
    };
  }

  processReview(reviewId, quality) {
    const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) return;

    const review = this.reviews[reviewIndex];
    
    // SM-2 Algorithm
    if (quality >= 3) {
      if (review.repetition === 0) {
        review.interval = 1;
      } else if (review.repetition === 1) {
        review.interval = 6;
      } else {
        review.interval = Math.round(review.interval * review.easinessFactor);
      }
      review.repetition++;
    } else {
      review.repetition = 0;
      review.interval = 1;
    }

    review.easinessFactor = review.easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (review.easinessFactor < 1.3) {
      review.easinessFactor = 1.3;
    }

    review.nextReview = new Date(Date.now() + review.interval * 24 * 60 * 60 * 1000);
    
    this.saveReviews();
    this.updateDisplay();
  }

  deleteReview(reviewId) {
    this.reviews = this.reviews.filter(r => r.id !== reviewId);
    this.saveReviews();
    this.updateDisplay();
  }

  clearFutureReviews() {
    const now = new Date();
    this.reviews = this.reviews.filter(r => new Date(r.nextReview) <= now);
    this.saveReviews();
    this.updateDisplay();
  }

  updateDisplay() {
    this.updateMainDisplay();
    this.updateDashboardDisplay();
  }

  updateMainDisplay() {
    const container = document.getElementById('reviews-list');
    if (!container) return;
    
    if (this.reviews.length === 0) {
      container.innerHTML = '<p class="text-secondary">Nenhuma revisão agendada</p>';
      return;
    }
    
    // Sort by next review date
    const sortedReviews = [...this.reviews].sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
    
    container.innerHTML = sortedReviews.map(review => {
      const reviewDate = new Date(review.nextReview);
      const now = new Date();
      const isOverdue = reviewDate < now;
      const isToday = reviewDate.toDateString() === now.toDateString();
      const isTomorrow = reviewDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
      
      let statusClass = 'future';
      let statusText = reviewDate.toLocaleDateString('pt-BR');
      
      if (isOverdue) {
        statusClass = 'due';
        statusText = 'Atrasada';
      } else if (isToday) {
        statusClass = 'due';
        statusText = 'Hoje';
      } else if (isTomorrow) {
        statusClass = 'upcoming';
        statusText = 'Amanhã';
      }
      
      return `
        <div class="review-item">
          <div class="review-info">
            <div class="review-subject">${review.discipline} - ${review.topic}</div>
            <div class="review-date">
              <span class="review-status ${statusClass}">${statusText}</span>
              <small> (Repetição ${review.repetition + 1})</small>
            </div>
          </div>
          <div class="review-actions">
            <button class="delete-btn" data-review-id="${review.id}" data-review-info="${review.discipline} - ${review.topic}">
              Excluir
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    // Add event listeners for delete buttons
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const reviewId = parseFloat(e.target.dataset.reviewId);
        const reviewInfo = e.target.dataset.reviewInfo;
        this.showDeleteModal(reviewId, reviewInfo);
      });
    });
  }

  updateDashboardDisplay() {
    const container = document.getElementById('recent-reviews');
    if (!container) return;
    
    if (this.reviews.length === 0) {
      container.innerHTML = '<p class="text-secondary">Nenhuma revisão agendada</p>';
      return;
    }
    
    // Get next 3 reviews
    const sortedReviews = [...this.reviews]
      .sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview))
      .slice(0, 3);
    
    container.innerHTML = sortedReviews.map(review => {
      const reviewDate = new Date(review.nextReview);
      const now = new Date();
      const isOverdue = reviewDate < now;
      const isToday = reviewDate.toDateString() === now.toDateString();
      
      let statusText = reviewDate.toLocaleDateString('pt-BR');
      if (isOverdue) statusText = 'Atrasada';
      else if (isToday) statusText = 'Hoje';
      
      return `
        <div class="review-item">
          <div class="review-info">
            <div class="review-subject">${review.discipline}</div>
            <div class="review-date">${statusText}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  showDeleteModal(reviewId, reviewInfo) {
    const modal = document.getElementById('delete-modal');
    const reviewInfoElement = document.getElementById('delete-review-info');
    
    if (!modal || !reviewInfoElement) return;
    
    reviewInfoElement.textContent = reviewInfo;
    modal.classList.remove('hidden');
    
    // Store review ID for confirmation
    modal.dataset.reviewId = reviewId;
  }
}

// Study Stats System
class StudyStatsSystem {
  constructor() {
    this.stats = this.loadStats();
    this.studyHistory = this.loadStudyHistory();
    this.updateDisplay();
  }

  loadStats() {
    return StorageHelper.get('studyStats', {
      totalStudyTime: 0,
      totalCorrectAnswers: 0,
      totalQuestionsAttempted: 0,
      studyStreak: 0,
      lastStudyDate: null,
      dailyStats: {}
    });
  }

  loadStudyHistory() {
    return StorageHelper.get('studyHistory', []);
  }

  saveStats() {
    StorageHelper.set('studyStats', this.stats);
  }

  saveStudyHistory() {
    StorageHelper.set('studyHistory', this.studyHistory);
  }

  addStudySession(sessionData) {
    const { discipline, topic, questionsAttempted, questionsCorrect, studyDuration } = sessionData;
    const today = new Date().toDateString();
    
    // Check if it's a new day
    const isNewDay = this.stats.lastStudyDate !== today;
    
    if (isNewDay) {
      // Check if streak should continue (studied yesterday)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      if (this.stats.lastStudyDate === yesterday || this.stats.lastStudyDate === null) {
        this.stats.studyStreak++;
      } else {
        this.stats.studyStreak = 1; // Reset streak
      }
      
      this.stats.lastStudyDate = today;
    }
    
    // Update totals
    this.stats.totalStudyTime += studyDuration;
    this.stats.totalCorrectAnswers += questionsCorrect;
    this.stats.totalQuestionsAttempted += questionsAttempted;
    
    // Update daily stats
    if (!this.stats.dailyStats[today]) {
      this.stats.dailyStats[today] = {
        studyTime: 0,
        correctAnswers: 0,
        questionsAttempted: 0
      };
    }
    
    const dailyStats = this.stats.dailyStats[today];
    dailyStats.studyTime += studyDuration;
    dailyStats.correctAnswers += questionsCorrect;
    dailyStats.questionsAttempted += questionsAttempted;
    
    // Add to history
    this.studyHistory.push({
      id: Date.now(),
      date: Date.now(),
      discipline,
      topic,
      questionsAttempted,
      questionsCorrect,
      studyDuration,
      performance: Math.round((questionsCorrect / questionsAttempted) * 100)
    });
    
    this.saveStats();
    this.saveStudyHistory();
    this.updateDisplay();
    
    // Update pet progress
    window.app.petSystem.addProgress({
      correctAnswers: questionsCorrect,
      studyTime: studyDuration,
      isNewDay
    });
    
    // Check achievements
    window.app.achievementSystem.checkAchievements({
      studyStreak: this.stats.studyStreak,
      totalCorrectAnswers: this.stats.totalCorrectAnswers,
      totalStudyTime: this.stats.totalStudyTime,
      averagePerformance: this.getAveragePerformance()
    });
    
    // Add/update review
    window.app.reviewSystem.addOrUpdateReview(discipline, topic);
    
    return { isNewDay };
  }

  getAveragePerformance() {
    if (this.stats.totalQuestionsAttempted === 0) return 0;
    return Math.round((this.stats.totalCorrectAnswers / this.stats.totalQuestionsAttempted) * 100);
  }

  getTodayStats() {
    const today = new Date().toDateString();
    return this.stats.dailyStats[today] || {
      studyTime: 0,
      correctAnswers: 0,
      questionsAttempted: 0
    };
  }

  updateDisplay() {
    // Update header stats
    const streakElement = document.getElementById('streak-counter');
    const totalQuestionsElement = document.getElementById('total-questions');
    
    if (streakElement) streakElement.textContent = `🔥 ${this.stats.studyStreak} dias`;
    if (totalQuestionsElement) totalQuestionsElement.textContent = `📊 ${this.stats.totalCorrectAnswers} questões`;
    
    // Update daily stats
    const todayStats = this.getTodayStats();
    const dailyTimeElement = document.getElementById('daily-time');
    const dailyCorrectElement = document.getElementById('daily-correct');
    const dailyPerformanceElement = document.getElementById('daily-performance');
    
    if (dailyTimeElement) dailyTimeElement.textContent = `${todayStats.studyTime}min`;
    if (dailyCorrectElement) dailyCorrectElement.textContent = todayStats.correctAnswers;
    
    const todayPerformance = todayStats.questionsAttempted > 0 ? 
      Math.round((todayStats.correctAnswers / todayStats.questionsAttempted) * 100) : 0;
    if (dailyPerformanceElement) dailyPerformanceElement.textContent = `${todayPerformance}%`;

    // Update goal progress
    this.updateGoalDisplay();
  }

  updateGoalDisplay() {
    const dailyGoal = window.app ? window.app.settingsSystem.getDailyGoal() : 20;
    const todayStats = this.getTodayStats();
    const progress = Math.min(todayStats.studyTime, dailyGoal);
    const percentage = Math.round((progress / dailyGoal) * 100);
    
    const goalProgressElement = document.getElementById('goal-progress');
    const dailyGoalStatusElement = document.getElementById('daily-goal-status');
    
    if (goalProgressElement) goalProgressElement.textContent = `${todayStats.studyTime}/${dailyGoal}`;
    if (dailyGoalStatusElement) dailyGoalStatusElement.textContent = `${percentage}%`;
  }

  getFilteredHistory(disciplineFilter = '', periodDays = 'all') {
    let filtered = [...this.studyHistory];
    
    // Filter by discipline
    if (disciplineFilter) {
      filtered = filtered.filter(session => session.discipline === disciplineFilter);
    }
    
    // Filter by period
    if (periodDays !== 'all') {
      const cutoffDate = Date.now() - (parseInt(periodDays) * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(session => session.date >= cutoffDate);
    }
    
    return filtered.sort((a, b) => b.date - a.date);
  }
}

// Settings System
class SettingsSystem {
  constructor() {
    this.settings = this.loadSettings();
    this.customDisciplines = this.loadCustomDisciplines();
    this.initSettings();
  }

  loadSettings() {
    return StorageHelper.get('appSettings', {
      dailyGoal: 20 // minutes
    });
  }

  loadCustomDisciplines() {
    return StorageHelper.get('customDisciplines', []);
  }

  saveSettings() {
    StorageHelper.set('appSettings', this.settings);
  }

  saveCustomDisciplines() {
    StorageHelper.set('customDisciplines', this.customDisciplines);
  }

  initSettings() {
    // Initialize when settings tab becomes active
    setTimeout(() => {
      const goalInput = document.getElementById('daily-goal-input');
      const saveGoalBtn = document.getElementById('save-goal');
      const addDisciplineBtn = document.getElementById('add-discipline');
      
      if (!goalInput || !saveGoalBtn || !addDisciplineBtn) return;
      
      // Set current goal
      goalInput.value = this.settings.dailyGoal;
      
      // Save goal
      saveGoalBtn.addEventListener('click', () => {
        const newGoal = parseInt(goalInput.value);
        if (newGoal >= 5 && newGoal <= 720) {
          this.settings.dailyGoal = newGoal;
          this.saveSettings();
          window.app.studyStats.updateGoalDisplay();
          alert('Meta diária salva com sucesso!');
        } else {
          alert('A meta deve estar entre 5 e 720 minutos.');
        }
      });

      // Add custom discipline
      addDisciplineBtn.addEventListener('click', () => {
        this.addCustomDiscipline();
      });

      // Data management buttons
      this.initDataManagement();
      
      // Update displays
      this.updateCustomDisciplinesDisplay();
    }, 100);
  }

  initDataManagement() {
    const downloadBtn = document.getElementById('download-backup');
    const copyBtn = document.getElementById('copy-data');
    const viewBtn = document.getElementById('view-data');
    const importBtn = document.getElementById('import-data');
    const clearBtn = document.getElementById('clear-all-data');

    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', () => this.downloadBackup());
    copyBtn.addEventListener('click', () => this.copyData());
    viewBtn.addEventListener('click', () => this.viewData());
    importBtn.addEventListener('click', () => this.showImportArea());
    clearBtn.addEventListener('click', () => this.clearAllData());

    // Import area
    const executeImportBtn = document.getElementById('execute-import');
    const cancelImportBtn = document.getElementById('cancel-import');
    
    if (executeImportBtn) executeImportBtn.addEventListener('click', () => this.executeImport());
    if (cancelImportBtn) cancelImportBtn.addEventListener('click', () => this.hideImportArea());
  }

  getDailyGoal() {
    return this.settings.dailyGoal;
  }

  addCustomDiscipline() {
    const nameInput = document.getElementById('new-discipline');
    const topicsInput = document.getElementById('new-topics');
    
    if (!nameInput || !topicsInput) return;
    
    const name = nameInput.value.trim();
    const topics = topicsInput.value.trim().split(',').map(t => t.trim()).filter(t => t);
    
    if (!name || topics.length === 0) {
      alert('Por favor, preencha o nome da disciplina e pelo menos um assunto.');
      return;
    }
    
    // Check if already exists
    const allDisciplines = [...DATA.disciplinas_medicas, ...this.customDisciplines];
    if (allDisciplines.find(d => d.nome.toLowerCase() === name.toLowerCase())) {
      alert('Esta disciplina já existe.');
      return;
    }
    
    this.customDisciplines.push({
      id: Date.now(),
      nome: name,
      assuntos: topics
    });
    
    this.saveCustomDisciplines();
    this.updateCustomDisciplinesDisplay();
    window.app.populateDisciplines();
    
    nameInput.value = '';
    topicsInput.value = '';
    
    alert('Disciplina adicionada com sucesso!');
  }

  removeCustomDiscipline(id) {
    this.customDisciplines = this.customDisciplines.filter(d => d.id !== id);
    this.saveCustomDisciplines();
    this.updateCustomDisciplinesDisplay();
    window.app.populateDisciplines();
  }

  updateCustomDisciplinesDisplay() {
    const container = document.getElementById('custom-disciplines');
    if (!container) return;
    
    if (this.customDisciplines.length === 0) {
      container.innerHTML = '<p class="text-secondary">Nenhuma disciplina personalizada adicionada</p>';
      return;
    }
    
    container.innerHTML = this.customDisciplines.map(discipline => `
      <div class="custom-discipline-item">
        <div class="discipline-info">
          <div class="discipline-name">${discipline.nome}</div>
          <div class="discipline-topics">${discipline.assuntos.join(', ')}</div>
        </div>
        <button class="remove-discipline-btn" data-id="${discipline.id}">Remover</button>
      </div>
    `).join('');
    
    // Add event listeners
    container.querySelectorAll('.remove-discipline-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm('Tem certeza que deseja remover esta disciplina?')) {
          this.removeCustomDiscipline(id);
        }
      });
    });
  }

  getAllData() {
    const data = {
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      settings: this.settings,
      customDisciplines: this.customDisciplines,
      studyStats: StorageHelper.get('studyStats', {}),
      studyHistory: StorageHelper.get('studyHistory', []),
      currentPet: StorageHelper.get('currentPet', {}),
      birdCollection: StorageHelper.get('birdCollection', []),
      achievements: StorageHelper.get('achievements', []),
      reviews: StorageHelper.get('reviews', [])
    };
    return data;
  }

  downloadBackup() {
    const data = this.getAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `medstudy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  async copyData() {
    const data = this.getAllData();
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      alert('Dados copiados para a área de transferência!');
    } catch (error) {
      console.error('Error copying data:', error);
      alert('Erro ao copiar dados. Tente usar o botão de visualizar.');
    }
  }

  viewData() {
    const data = this.getAllData();
    const modal = document.getElementById('data-modal');
    const display = document.getElementById('data-display');
    
    if (!modal || !display) return;
    
    display.textContent = JSON.stringify(data, null, 2);
    modal.classList.remove('hidden');
  }

  showImportArea() {
    const importArea = document.getElementById('import-area');
    if (importArea) importArea.classList.remove('hidden');
  }

  hideImportArea() {
    const importArea = document.getElementById('import-area');
    const importText = document.getElementById('import-text');
    
    if (importArea) importArea.classList.add('hidden');
    if (importText) importText.value = '';
  }

  executeImport() {
    const importText = document.getElementById('import-text');
    if (!importText) return;
    
    const text = importText.value.trim();
    if (!text) {
      alert('Por favor, cole os dados para importar.');
      return;
    }
    
    try {
      const data = JSON.parse(text);
      
      if (!data.version) {
        alert('Formato de dados inválido.');
        return;
      }
      
      if (!confirm('Isso substituirá todos os dados atuais. Tem certeza?')) {
        return;
      }
      
      // Import data
      if (data.settings) StorageHelper.set('appSettings', data.settings);
      if (data.customDisciplines) StorageHelper.set('customDisciplines', data.customDisciplines);
      if (data.studyStats) StorageHelper.set('studyStats', data.studyStats);
      if (data.studyHistory) StorageHelper.set('studyHistory', data.studyHistory);
      if (data.currentPet) StorageHelper.set('currentPet', data.currentPet);
      if (data.birdCollection) StorageHelper.set('birdCollection', data.birdCollection);
      if (data.achievements) StorageHelper.set('achievements', data.achievements);
      if (data.reviews) StorageHelper.set('reviews', data.reviews);
      
      alert('Dados importados com sucesso! Recarregando página...');
      location.reload();
      
    } catch (error) {
      console.error('Import error:', error);
      alert('Erro ao importar dados. Verifique o formato.');
    }
  }

  clearAllData() {
    if (!confirm('Isso removerá TODOS os seus dados permanentemente. Tem certeza?')) {
      return;
    }
    
    if (!confirm('Esta ação é irreversível. Confirma a exclusão de todos os dados?')) {
      return;
    }
    
    StorageHelper.clear();
    alert('Todos os dados foram removidos. Recarregando página...');
    location.reload();
  }
}

// History System
class HistorySystem {
  constructor() {
    this.initHistoryDisplay();
  }

  initHistoryDisplay() {
    // Initialize when history tab becomes active
    setTimeout(() => {
      const disciplineFilter = document.getElementById('history-discipline-filter');
      const periodFilter = document.getElementById('history-period-filter');
      
      if (!disciplineFilter || !periodFilter) return;
      
      // Populate discipline filter
      this.populateDisciplineFilter();
      
      // Add event listeners
      disciplineFilter.addEventListener('change', () => this.updateHistoryDisplay());
      periodFilter.addEventListener('change', () => this.updateHistoryDisplay());
      
      // Initial display
      this.updateHistoryDisplay();
    }, 100);
  }

  populateDisciplineFilter() {
    const select = document.getElementById('history-discipline-filter');
    if (!select || !window.app) return;
    
    const allDisciplines = [...DATA.disciplinas_medicas, ...window.app.settingsSystem.customDisciplines];
    
    select.innerHTML = '<option value="">Todas as disciplinas</option>' +
      allDisciplines.map(d => `<option value="${d.nome}">${d.nome}</option>`).join('');
  }

  updateHistoryDisplay() {
    const disciplineFilter = document.getElementById('history-discipline-filter');
    const periodFilter = document.getElementById('history-period-filter');
    
    if (!disciplineFilter || !periodFilter || !window.app) return;
    
    const filteredHistory = window.app.studyStats.getFilteredHistory(
      disciplineFilter.value,
      periodFilter.value
    );
    
    this.displayHistory(filteredHistory);
    this.displaySummary(filteredHistory);
  }

  displayHistory(history) {
    const container = document.getElementById('history-list');
    if (!container) return;
    
    if (history.length === 0) {
      container.innerHTML = '<p class="text-secondary">Nenhum estudo encontrado para os filtros selecionados</p>';
      return;
    }
    
    container.innerHTML = history.map(session => {
      const performanceClass = this.getPerformanceClass(session.performance);
      
      return `
        <div class="history-item">
          <div class="history-info">
            <div class="history-discipline">${session.discipline}</div>
            <div class="history-topic">${session.topic}</div>
            <div class="history-date">${new Date(session.date).toLocaleString('pt-BR')}</div>
          </div>
          <div class="history-stats">
            <div class="history-stat">
              <div class="history-stat-label">Tempo</div>
              <div class="history-stat-value">${session.studyDuration}min</div>
            </div>
            <div class="history-stat">
              <div class="history-stat-label">Questões</div>
              <div class="history-stat-value">${session.questionsCorrect}/${session.questionsAttempted}</div>
            </div>
            <div class="history-stat">
              <div class="history-stat-label">Performance</div>
              <div class="history-stat-value ${performanceClass}">${session.performance}%</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  displaySummary(history) {
    const totalSessions = history.length;
    const totalTime = history.reduce((sum, s) => sum + s.studyDuration, 0);
    const totalCorrect = history.reduce((sum, s) => sum + s.questionsCorrect, 0);
    const totalAttempted = history.reduce((sum, s) => sum + s.questionsAttempted, 0);
    const avgPerformance = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    
    const summaryElements = {
      sessions: document.getElementById('summary-sessions'),
      time: document.getElementById('summary-time'),
      correct: document.getElementById('summary-correct'),
      performance: document.getElementById('summary-performance')
    };
    
    if (summaryElements.sessions) summaryElements.sessions.textContent = totalSessions;
    if (summaryElements.time) summaryElements.time.textContent = `${Math.floor(totalTime / 60)}h ${totalTime % 60}min`;
    if (summaryElements.correct) summaryElements.correct.textContent = totalCorrect;
    if (summaryElements.performance) summaryElements.performance.textContent = `${avgPerformance}%`;
  }

  getPerformanceClass(performance) {
    if (performance >= 90) return 'performance-excellent';
    if (performance >= 80) return 'performance-good';
    if (performance >= 70) return 'performance-average';
    return 'performance-poor';
  }
}

// Navigation System
class NavigationSystem {
  constructor() {
    this.currentTab = 'dashboard';
    this.initNavigation();
  }

  initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = e.target.dataset.tab;
        if (tabId) {
          this.switchTab(tabId);
        }
      });
    });
  }

  switchTab(tabId) {
    console.log('Switching to tab:', tabId); // Debug log
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(tabId);
    const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
    
    if (targetTab && targetBtn) {
      targetTab.classList.add('active');
      targetBtn.classList.add('active');
      this.currentTab = tabId;
      
      // Update displays when switching to certain tabs
      if (tabId === 'collection' && window.app) {
        window.app.birdCollection.updateDisplay();
      } else if (tabId === 'achievements' && window.app) {
        window.app.achievementSystem.updateDisplay();
      } else if (tabId === 'reviews' && window.app) {
        window.app.reviewSystem.updateDisplay();
      } else if (tabId === 'history' && window.app) {
        window.app.historySystem.populateDisciplineFilter();
        window.app.historySystem.updateHistoryDisplay();
      } else if (tabId === 'settings' && window.app) {
        window.app.settingsSystem.initSettings();
        window.app.settingsSystem.updateCustomDisciplinesDisplay();
      }
    } else {
      console.error('Tab not found:', tabId, targetTab, targetBtn);
    }
  }
}

// Main Application Class
class MedStudyApp {
  constructor() {
    this.studyTimer = new StudyTimer();
    this.settingsSystem = new SettingsSystem();
    this.studyStats = new StudyStatsSystem();
    this.petSystem = new PetSystem();
    this.birdCollection = new BirdCollection();
    this.achievementSystem = new AchievementSystem();
    this.reviewSystem = new ReviewSystem();
    this.historySystem = new HistorySystem();
    this.navigation = new NavigationSystem();
    
    this.initApp();
  }

  initApp() {
    this.populateDisciplines();
    this.initStudyForm();
    this.initModals();
    this.initReviewActions();
  }

  populateDisciplines() {
    const disciplineSelect = document.getElementById('discipline');
    const topicSelect = document.getElementById('topic');
    
    if (!disciplineSelect || !topicSelect) return;
    
    const allDisciplines = [...DATA.disciplinas_medicas, ...this.settingsSystem.customDisciplines];
    
    disciplineSelect.innerHTML = '<option value="">Selecione uma disciplina</option>' +
      allDisciplines.map(d => `<option value="${d.nome}">${d.nome}</option>`).join('');
    
    disciplineSelect.addEventListener('change', (e) => {
      const selectedDiscipline = e.target.value;
      
      if (selectedDiscipline) {
        const discipline = allDisciplines.find(d => d.nome === selectedDiscipline);
        if (discipline) {
          topicSelect.innerHTML = '<option value="">Selecione um assunto</option>' +
            discipline.assuntos.map(a => `<option value="${a}">${a}</option>`).join('');
          topicSelect.disabled = false;
        }
      } else {
        topicSelect.innerHTML = '<option value="">Primeiro selecione a disciplina</option>';
        topicSelect.disabled = true;
      }
    });
  }

  initStudyForm() {
    const form = document.getElementById('study-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const discipline = document.getElementById('discipline').value;
      const topic = document.getElementById('topic').value;
      const customTopic = document.getElementById('custom-topic').value.trim();
      const questionsAttempted = parseInt(document.getElementById('questions-attempted').value);
      const questionsCorrect = parseInt(document.getElementById('questions-correct').value);
      const studyDuration = parseInt(document.getElementById('study-duration').value);
      
      // Use custom topic if provided, otherwise use selected topic
      const finalTopic = customTopic || topic;
      
      if (!discipline || !finalTopic) {
        alert('Por favor, selecione uma disciplina e um assunto (ou digite um assunto personalizado).');
        return;
      }
      
      // Validate
      if (questionsCorrect > questionsAttempted) {
        alert('O número de questões corretas não pode ser maior que o número de questões tentadas.');
        return;
      }
      
      const sessionData = {
        discipline,
        topic: finalTopic,
        questionsAttempted,
        questionsCorrect,
        studyDuration
      };
      
      // Process study session
      this.studyStats.addStudySession(sessionData);
      
      // Reset form
      form.reset();
      document.getElementById('topic').disabled = true;
      document.getElementById('topic').innerHTML = '<option value="">Primeiro selecione a disciplina</option>';
      
      // Stop timer if running
      if (this.studyTimer.isRunning) {
        this.studyTimer.stop();
      }
      
      // Show success message
      alert('Sessão de estudo registrada com sucesso!');
      
      // Switch to dashboard
      this.navigation.switchTab('dashboard');
    });
  }

  initModals() {
    // Delete review modal
    const modal = document.getElementById('delete-modal');
    if (!modal) return;
    
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-delete');
    const confirmBtn = document.getElementById('confirm-delete');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    const closeModal = () => {
      modal.classList.add('hidden');
      delete modal.dataset.reviewId;
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const reviewId = parseFloat(modal.dataset.reviewId);
        if (reviewId) {
          this.reviewSystem.deleteReview(reviewId);
          closeModal();
        }
      });
    }

    // Data view modal
    const dataModal = document.getElementById('data-modal');
    if (dataModal) {
      const closeDataBtn = document.getElementById('close-data-modal');
      const closeDataBtn2 = document.getElementById('close-data-modal-btn');
      const dataBackdrop = dataModal.querySelector('.modal-backdrop');
      
      const closeDataModal = () => {
        dataModal.classList.add('hidden');
      };
      
      if (closeDataBtn) closeDataBtn.addEventListener('click', closeDataModal);
      if (closeDataBtn2) closeDataBtn2.addEventListener('click', closeDataModal);
      if (dataBackdrop) dataBackdrop.addEventListener('click', closeDataModal);
    }
  }

  initReviewActions() {
    const clearFutureBtn = document.getElementById('clear-future-reviews');
    if (clearFutureBtn) {
      clearFutureBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir todas as revisões futuras? Esta ação não pode ser desfeita.')) {
          this.reviewSystem.clearFutureReviews();
          alert('Revisões futuras foram excluídas.');
        }
      });
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing app...');
  window.app = new MedStudyApp();
  console.log('App initialized:', window.app);
});