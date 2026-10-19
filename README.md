# Elifbam - İnteraktif Elifba Öğrenme ve Alıştırma Portalı

Kuran-ı Kerim harflerini ve tecvid temellerini sesli, görsel ve interaktif olarak öğrenmek için hazırlanmış kapsamlı web uygulaması.

---

## 🌟 Öne Çıkan Özellikler

- **📚 Kademeli & Bölüm Bölüm Çalışma:** Harfleri ve kuralları adım adım, belirli harf grupları halinde sindirerek öğrenme imkanı.
- **🎯 Özel Harf/Kelime Seçimi:** İstediğiniz harfleri (örneğin sadece *Elif, Be, Te, Se*) seçerek yalnızca bu harfler üzerinde özel çalışma yapabilme.
- **🔁 Sürekli Tekrar Döngüsü:** Oyun ve alıştırma modlarında sorular bittiğinde durmadan, sürekli tekrar eden bir döngüde kesintisiz pratik yapabilme.
- **🔥 Üst Üste Doğrularla Otomatik Hedef Yükseltme (Kombo & Seri):** Hedef tamamlandığında (5, 10, 15, 20...) oyunu hiç bölmeden ve hiçbir butona basmaya gerek kalmadan hedefin otomatik olarak bir üst kademeye yükselmesi, anlık tebrik bildirimi, alev ve yıldız sayaçları, her doğruda yükselen müzik tonları, kupa, konfeti ve başarı rozetleriyle kesintisiz, akıcı oyun deneyimi (1 ve 2 oyunculu modlarda).
- **✨ Üç Hareke Bir Arada (Yeni Modül):** Harflerin Üstün, Esre ve Ötre hallerini aynı kart üzerinde yan yana görebilme, tek tek ve ardışık (*Be - Bi - Bü*) dinleyebilme.
- **🔊 Sesli Telaffuzlar:** Her harf, hareke ve kelime için gerçek ses kayıtları.
- **🎮 İnteraktif Test & Oyun Modları:** Sesli dinleme, kart eşleştirme ve çoktan seçmeli interaktif alıştırmalar.
- **📱 Responsive & Modern Tasarım:** Masaüstü, tablet ve mobil cihazlarla tam uyumlu arayüz.

---

## 📂 Modüller

1. **Harfler (`/harfler`)**: Temel Elifba harfleri, müstakil yazılışlar ve sesler.
2. **Üç Hareke Bir Arada (`/harekeler`)**: Harflerin üstün, esre ve ötre hallerini bir arada gösteren karşılaştırmalı modül.
3. **Üstün (`/ustun1`, `/ustun`)**: Harflerin üstün ile seslendirilişi ve kelime örnekleri.
4. **Esre (`/esre1`, `/esre`)**: Harflerin esre ile seslendirilişi ve kelime örnekleri.
5. **Ötre (`/otre1`, `/otre`)**: Harflerin ötre ile seslendirilişi ve kelime örnekleri.
6. **Med Harfleri**:
   - `medelif`: Medd-i Tabiî - Elif ile uzatma
   - `medvav`: Medd-i Tabiî - Vav ile uzatma
   - `medye`: Medd-i Tabiî - Ye ile uzatma
7. **Cezm (`/cezm`)**: Harflerin tutturularak (cezimli) okunuşu.
8. **Şedde (`/sedde`)**: Harflerin iki defa (şeddeli) okunuşu.
9. **Tenvinler**:
   - `ikiustun`: İki Üstün (-en / -an)
   - `ikiesre`: İki Esre (-in)
   - `ikiotre`: İki Ötre (-ün / -un)
10. **Karışık Alıştırmalar**:
    - `elana`: Kelime ve harf birleştirme çalışmaları.
    - `elbo2`: Gelişmiş kelime okuma ve telaffuz testleri.

---

## 🚀 Başlangıç

Projeyi yerel bilgisayarınızda çalıştırmak için herhangi bir kurulum veya sunucu yapılandırması gerekmez:

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/ozeme42/elifbam.git
   ```
2. Klasöre gidin ve `index.html` dosyasını favori tarayıcınızda açın:
   - Doğrudan çift tıklayabilir veya Live Server / statik web sunucusu ile açabilirsiniz.

---

## 🛠️ Teknolojiler

- HTML5 & CSS3 (Modern Flexbox/Grid mimarisi)
- Saf JavaScript (Vanilla JS - Bağımlılıksız, hızlı ve hafif)
- Web Audio API (Harf ve kelime seslendirmeleri)
