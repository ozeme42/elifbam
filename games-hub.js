/**
 * ============================================================================
 * ELİFBA ORTAK OYUNLAR & PUAN SİSTEMİ MERKEZİ (GAMES HUB)
 * ============================================================================
 * Oyunları ayrı buton altına alma, puanla kilit açma ve ödüllendirme motoru.
 */

(function (window, document) {
    'use strict';

    // 1. OYUN LİSTESİ VE GEREKLİ PUAN AYARLARI
    const GAMES_CATALOG = [
        {
            id: 'balonlar',
            title: 'Balon Patlatma',
            icon: '🎈',
            reqPoints: 30,
            desc: 'Sesi dinle, doğru harf balonunu patlat!',
            themeClass: 'theme-balon'
        },
        {
            id: 'hafiza',
            title: 'Hafıza & Eşleştirme',
            icon: '🃏',
            reqPoints: 60,
            desc: 'Harf ikizlerini 3D çevirip eşleştir!',
            themeClass: 'theme-hafiza'
        },
        {
            id: 'cizim',
            title: 'Harf Çizme & Yazma',
            icon: '✍️',
            reqPoints: 100,
            desc: 'Renkli fırçalarla harflerin üzerinden çiz!',
            themeClass: 'theme-cizim'
        },
        {
            id: 'tren',
            title: 'Harf Treni',
            icon: '🚂',
            reqPoints: 150,
            desc: 'Vagonları sıraya diz, treni kaldır!',
            themeClass: 'theme-tren'
        },
        {
            id: 'cark',
            title: 'Şans Çarkıfeleği',
            icon: '🎡',
            reqPoints: 200,
            desc: 'Çarkı çevir, sürpriz harflerle çalış!',
            themeClass: 'theme-cark'
        },
        {
            id: 'macera',
            title: 'Büyük Elifba Macerası',
            icon: '🗺️',
            reqPoints: 0,
            desc: '19 aşamalı harita yolculuğu & Diploma!',
            themeClass: 'theme-macera'
        },
        {
            id: 'basarilar',
            title: 'Başarı Sandığı & Rozetler',
            icon: '🏆',
            reqPoints: 0,
            desc: 'Yıldızlarını biriktir, rozetleri topla!',
            themeClass: 'theme-basarilar'
        }
    ];

    // 2. PUAN VE YILDIZ YÖNETİMİ
    function getGlobalPoints() {
        let pts = parseInt(localStorage.getItem('elifbam_total_points') || '0', 10);
        const stars = parseInt(localStorage.getItem('elifbam_total_stars') || '0', 10);
        // Eğer yıldız var ama puan henüz sıfırsa geriye dönük hak tanıma (yıldız * 10 puan)
        if (pts === 0 && stars > 0) {
            pts = stars * 10;
            localStorage.setItem('elifbam_total_points', pts);
        }
        return isNaN(pts) ? 0 : pts;
    }

    function getGlobalStars() {
        const stars = parseInt(localStorage.getItem('elifbam_total_stars') || '0', 10);
        return isNaN(stars) ? 0 : stars;
    }

    function addGlobalPoints(amount, reason = '') {
        if (!amount || amount <= 0) return getGlobalPoints();
        const current = getGlobalPoints();
        const updated = current + amount;
        localStorage.setItem('elifbam_total_points', updated);

        // Her 20 puanda 1 yıldız da hediye et
        if (Math.floor(updated / 20) > Math.floor(current / 20)) {
            addGlobalStars(1, false);
        }

        updateAllNavBadges();
        showPointToast(amount, reason);
        playPointChirp();

        // Eğer açık bir oyun çekmecesi varsa güncelle
        const drawer = document.getElementById('games-hub-drawer');
        if (drawer && drawer.style.display !== 'none') {
            renderGamesHub();
        }

        return updated;
    }

    function addGlobalStars(amount, showToast = true) {
        if (!amount || amount <= 0) return getGlobalStars();
        const current = getGlobalStars();
        const updated = current + amount;
        localStorage.setItem('elifbam_total_stars', updated);
        updateAllNavBadges();
        if (showToast) {
            showPointToast(amount, '⭐ Yıldız Kazanıldı!');
        }
        return updated;
    }

    // 3. EKRANDAKİ TÜM PUAN / YILDIZ SAYAÇLARINI GÜNCELLEME
    function updateAllNavBadges() {
        const pts = getGlobalPoints();
        const stars = getGlobalStars();

        // Üst bar ve rozet elementleri
        const ptsEls = document.querySelectorAll('.hub-pts-val, #top-point-count, #portal-points, #val-points');
        ptsEls.forEach(el => { el.textContent = pts; });

        const starEls = document.querySelectorAll('#top-star-count, #portal-stars, #val-stars');
        starEls.forEach(el => { el.textContent = stars; });
    }

    // 4. BULUNDUĞUMUZ DİZİNİ VE YOLU TESPİT ETME
    function getRootPrefix() {
        const script = document.querySelector('script[src*="games-hub.js"]');
        if (script) {
            const src = script.getAttribute('src');
            if (src.startsWith('../')) return '../';
            if (src.startsWith('games-hub') || src === 'games-hub.js') return '';
        }

        const path = window.location.pathname.replace(/\\/g, '/');
        const parts = path.split('/').filter(p => p.length > 0);
        if (parts.length > 0 && !parts[parts.length - 1].endsWith('.html')) {
            return '../';
        }
        if (parts.length >= 2) {
            const last = parts[parts.length - 1];
            if (last.endsWith('.html') && parts[parts.length - 2] !== 'elifbam' && parts.length > 1) {
                return '../';
            }
        }
        return '';
    }

    // Aktif konuyu URL'den veya klasör adından bulma
    function getCurrentSectionName() {
        const path = window.location.pathname.replace(/\\/g, '/');
        const matches = path.match(/\/([a-zA-Z0-9_\-]+)\/index\.html/);
        if (matches && matches[1]) {
            return matches[1];
        }
        // Query param kontrolü
        const params = new URLSearchParams(window.location.search);
        if (params.get('section')) return params.get('section');
        return '';
    }

    // 5. OYUNLARI ÇEKMECEYE YERLEŞTİRME (RENDER)
    function renderGamesHub() {
        const grid = document.getElementById('hub-games-grid');
        if (!grid) return;

        const currentPoints = getGlobalPoints();
        const prefix = getRootPrefix();
        const currentSec = getCurrentSectionName();

        grid.innerHTML = '';

        GAMES_CATALOG.forEach(game => {
            const isUnlocked = currentPoints >= game.reqPoints;
            const card = document.createElement('div');
            card.className = `hub-game-card ${game.themeClass} ${isUnlocked ? 'is-unlocked' : 'is-locked'}`;

            // Link hedefi
            let targetUrl = `${prefix}${game.id}/index.html`;
            if (currentSec && !['macera', 'basarilar'].includes(game.id)) {
                targetUrl += `?section=${encodeURIComponent(currentSec)}`;
            }

            // İçerik
            let statusBadge = '';
            if (isUnlocked) {
                statusBadge = `<span class="hub-card-status">✅ Oyna</span>`;
            } else {
                statusBadge = `<span class="hub-card-status">🔒 ${game.reqPoints} Puan</span>`;
            }

            card.innerHTML = `
                <div class="hub-card-icon">${game.icon}</div>
                <div class="hub-card-body">
                    <h4 class="hub-card-title">${game.title}</h4>
                    ${statusBadge}
                </div>
            `;

            card.onclick = function (e) {
                if (isUnlocked) {
                    window.location.href = targetUrl;
                } else {
                    e.preventDefault();
                    showLockModal(game, currentPoints);
                }
            };

            grid.appendChild(card);
        });
    }

    // 6. ÇEKMECYİ AÇMA / KAPATMA (TOGGLE)
    function toggleGamesHub() {
        const drawer = document.getElementById('games-hub-drawer');
        const btn = document.getElementById('btn-games-hub');
        if (!drawer || !btn) return;

        if (drawer.style.display === 'none' || drawer.style.display === '') {
            drawer.style.display = 'block';
            btn.classList.add('is-open');
            renderGamesHub();
            playDrawerChirp(true);
        } else {
            drawer.style.display = 'none';
            btn.classList.remove('is-open');
            playDrawerChirp(false);
        }
    }

    // 7. KİLİTLİ OYUN BİLGİLENDİRME MODALI (POPUP)
    function showLockModal(game, currentPoints) {
        // Varsa eski modalı temizle
        const oldModal = document.getElementById('games-lock-modal-backdrop');
        if (oldModal) oldModal.remove();

        const remaining = Math.max(0, game.reqPoints - currentPoints);
        const pct = Math.min(100, Math.round((currentPoints / game.reqPoints) * 100));
        const prefix = getRootPrefix();

        const backdrop = document.createElement('div');
        backdrop.id = 'games-lock-modal-backdrop';
        backdrop.className = 'games-lock-modal-backdrop';

        backdrop.innerHTML = `
            <div class="games-lock-modal">
                <button class="lock-modal-close-btn" id="lock-modal-close" title="Kapat">✕</button>
                <div class="lock-modal-mascot">🐥</div>
                <h3 class="lock-modal-title">🔒 ${game.title} Henüz Kilitli!</h3>
                <p class="lock-modal-desc">
                    Bu eğlenceli oyunu oynamak için <strong>${game.reqPoints} Puan</strong> gerekiyor.
                </p>

                <div class="lock-modal-progress-box">
                    <div class="lock-progress-stats">
                        <span>Puanın: ${currentPoints}</span>
                        <span>Hedef: ${game.reqPoints}</span>
                    </div>
                    <div class="lock-progress-bar-bg">
                        <div class="lock-progress-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                    <div class="lock-progress-remaining">
                        ${remaining > 0 ? `Sadece <strong>${remaining} Puan</strong> kaldı! ⭐` : 'Kilidi açmaya hazırsın!'}
                    </div>
                </div>

                <div class="lock-modal-tips">
                    <strong>💡 Nasıl Puan Kazanabilirsin?</strong>
                    <ul>
                        <li>🎧 Harfleri dinleyerek: <strong>+5 Puan</strong></li>
                        <li>🎯 Quiz sorularını bilerek: <strong>+15 Puan</strong></li>
                        <li>🔥 Doğru cevap serisi yaparak: <strong>+50 Puan</strong></li>
                        <li>🎙️ Mikrofonla sesini kaydederek: <strong>+10 Puan</strong></li>
                    </ul>
                </div>

                <div class="lock-modal-actions">
                    <button class="btn-lock-action-continue" id="btn-lock-continue">
                        🚀 Puan Toplamaya Devam Et!
                    </button>
                    <a href="${prefix}macera/index.html" class="btn-lock-action-adventure">
                        🗺️ Maceraya Git
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);

        // Kapatma butonları
        document.getElementById('lock-modal-close').onclick = () => backdrop.remove();
        document.getElementById('btn-lock-continue').onclick = () => backdrop.remove();
        backdrop.onclick = (e) => {
            if (e.target === backdrop) backdrop.remove();
        };

        playChirpSound(0.9);
    }

    // 8. OYUN SAYFALARINA DİREKT GİRİŞ GÜVENLİK KONTROLÜ (GATEKEEPER)
    function checkGameLock(gameId, reqPoints, gameTitle) {
        const currentPoints = getGlobalPoints();
        if (currentPoints >= reqPoints) {
            // Kilidi açık, sorunsuz oynayabilir
            updateAllNavBadges();
            return true;
        }

        // Kilitli! Ekranın üstüne tam ekran bilgilendirme koy
        const prefix = getRootPrefix();
        const backdrop = document.createElement('div');
        backdrop.className = 'games-lock-modal-backdrop';
        backdrop.style.zIndex = '99999';

        const remaining = reqPoints - currentPoints;
        const pct = Math.min(100, Math.round((currentPoints / reqPoints) * 100));

        backdrop.innerHTML = `
            <div class="games-lock-modal" style="max-width: 500px;">
                <div class="lock-modal-mascot">🐥</div>
                <h3 class="lock-modal-title">🔒 ${gameTitle} İçin Puan Gerekli!</h3>
                <p class="lock-modal-desc">
                    Bu oyun <strong>${reqPoints} Puan</strong> ile açılıyor.<br>
                    Şu anki Puanın: <strong>${currentPoints} Puan</strong>.
                </p>

                <div class="lock-modal-progress-box">
                    <div class="lock-progress-stats">
                        <span>Puanın: ${currentPoints}</span>
                        <span>Gerekli: ${reqPoints}</span>
                    </div>
                    <div class="lock-progress-bar-bg">
                        <div class="lock-progress-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                    <div class="lock-progress-remaining">
                        Sadece <strong>${remaining} Puan</strong> daha kazanmalısın!
                    </div>
                </div>

                <div class="lock-modal-tips">
                    <strong>💡 Puanları Çok Kolay Kazanabilirsin:</strong>
                    <ul>
                        <li>Harf derslerinde örnekleri dinleyip tekrar et</li>
                        <li>Quiz sorularını çözerek yıldız ve puan topla</li>
                        <li>Büyük Elifba Macerası'nda bölümleri geç</li>
                    </ul>
                </div>

                <div class="lock-modal-actions" style="justify-content: center;">
                    <a href="${prefix}harfler/index.html" class="btn-lock-action-continue" style="text-decoration:none; text-align:center;">
                        📖 Harflere Git & Puan Kazan
                    </a>
                    <a href="${prefix}index.html" class="btn-lock-action-adventure">
                        🏠 Ana Menü
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        return false;
    }

    // 9. CANLI PUAN TOAST BİLDİRİMİ
    function showPointToast(amount, reason = '') {
        const toast = document.createElement('div');
        toast.className = 'point-toast-popup';
        toast.innerHTML = `
            <span>🏆</span>
            <span>+${amount} Puan!</span>
            ${reason ? `<span style="font-size:0.85rem; opacity:0.9;">(${reason})</span>` : ''}
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 1900);
    }

    // 10. SES EFEKTLERİ (WEB AUDIO API)
    function playPointChirp() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') ctx.resume();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
            osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16); // G5
            osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.24); // C6

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {}
    }

    function playDrawerChirp(isOpen) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') ctx.resume();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            if (isOpen) {
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
            } else {
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
            }
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {}
    }

    function playChirpSound(pitch = 1) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') ctx.resume();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600 * pitch, now);
            osc.frequency.exponentialRampToValueAtTime(1200 * pitch, now + 0.08);
            osc.frequency.exponentialRampToValueAtTime(800 * pitch, now + 0.18);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.22);
        } catch (e) {}
    }

    // 11. BAŞLANGIÇ ÇALIŞMASI
    window.addEventListener('DOMContentLoaded', () => {
        updateAllNavBadges();
        // Eğer sayfada games-hub-drawer varsa ilk içeriği doldur
        if (document.getElementById('hub-games-grid')) {
            renderGamesHub();
        }
    });

    // Global Dışa Aktarma
    window.ElifbaGamesHub = {
        catalog: GAMES_CATALOG,
        getPoints: getGlobalPoints,
        addPoints: addGlobalPoints,
        getStars: getGlobalStars,
        addStars: addGlobalStars,
        toggle: toggleGamesHub,
        render: renderGamesHub,
        showLockModal: showLockModal,
        checkGameLock: checkGameLock,
        updateBadges: updateAllNavBadges
    };

    // Kolay erişim fonksiyonları
    window.getGlobalPoints = getGlobalPoints;
    window.addGlobalPoints = addGlobalPoints;
    window.getGlobalStars = getGlobalStars;
    window.addGlobalStars = addGlobalStars;
    window.toggleGamesHub = toggleGamesHub;
    window.checkGameLock = checkGameLock;

})(window, document);
