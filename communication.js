const phrases = {
  needs: [
    { icon: "💧", text: "عايز أشرب" }, { icon: "🍽️", text: "عايز آكل" },
    { icon: "🚻", text: "عايز الحمام" }, { icon: "🛏️", text: "عايز أرتاح" },
    { icon: "🆘", text: "محتاج مساعدة" }, { icon: "💊", text: "عايز الدواء" },
    { icon: "🏠", text: "عايز أرجع البيت" }, { icon: "📱", text: "عايز الموبايل" }
  ],
  feelings: [
    { icon: "😊", text: "أنا سعيد" }, { icon: "😢", text: "أنا حزين" },
    { icon: "😡", text: "أنا غاضب" }, { icon: "😴", text: "أنا تعبان" },
    { icon: "😨", text: "أنا خايف" }, { icon: "🤕", text: "أنا بتألم" },
    { icon: "❤️", text: "أنا مرتاح" }, { icon: "😟", text: "أنا قلقان" }
  ],
  actions: [
    { icon: "🚶", text: "عايز أمشي" }, { icon: "🪑", text: "عايز أقعد" },
    { icon: "🚗", text: "عايز أخرج" }, { icon: "📖", text: "عايز أقرأ" },
    { icon: "🎮", text: "عايز ألعب" }, { icon: "📞", text: "عايز أكلم حد" },
    { icon: "🙋", text: "عايز أتكلم" }, { icon: "✋", text: "توقف من فضلك" }
  ],
  people: [
    { icon: "👩", text: "عايز ماما" }, { icon: "👨", text: "عايز بابا" },
    { icon: "👩‍⚕️", text: "عايز الدكتورة" }, { icon: "👨‍🏫", text: "عايز المدرس" },
    { icon: "🧑‍🤝‍🧑", text: "عايز صاحبي" }, { icon: "👨‍👩‍👧", text: "عايز أسرتي" },
    { icon: "🙋", text: "عايز حد يساعدني" }, { icon: "👮", text: "عايز الشرطة" }
  ]
};

const cardsContainer = document.getElementById("cards");
const sentenceContainer = document.getElementById("sentence");
const feedback = document.getElementById("feedback");
const selectedWords = [];
let activeCategory = "needs";

function renderSentence() {
  sentenceContainer.replaceChildren();

  if (selectedWords.length === 0) {
    const empty = document.createElement("span");
    empty.className = "empty-message";
    empty.textContent = "اختار صورة أو عبارة للبدء...";
    sentenceContainer.appendChild(empty);
  } else {
    selectedWords.forEach((word, index) => {
      const chip = document.createElement("span");
      chip.className = "word-chip";

      const text = document.createElement("span");
      text.textContent = word;

      const remove = document.createElement("button");
      remove.className = "remove-word";
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `حذف ${word}`);
      remove.addEventListener("click", () => {
        selectedWords.splice(index, 1);
        renderSentence();
      });

      chip.append(text, remove);
      sentenceContainer.appendChild(chip);
    });
  }

  document.getElementById("undoButton").disabled = selectedWords.length === 0;
  document.getElementById("speakButton").disabled = selectedWords.length === 0;
}

function addWord(word) {
  selectedWords.push(word);
  feedback.textContent = `تمت إضافة: ${word}`;
  renderSentence();
}

function renderCards(category) {
  activeCategory = category;
  cardsContainer.replaceChildren();

  phrases[category].forEach((phrase) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-card";

    const icon = document.createElement("span");
    icon.className = "choice-emoji";
    icon.textContent = phrase.icon;

    const label = document.createElement("span");
    label.className = "choice-label";
    label.textContent = phrase.text;

    button.append(icon, label);
    button.addEventListener("click", () => addWord(phrase.text));
    cardsContainer.appendChild(button);
  });
}

document.querySelectorAll(".category-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".category-button.active")?.classList.remove("active");
    button.classList.add("active");
    renderCards(button.dataset.category);
  });
});

document.getElementById("clearButton").addEventListener("click", () => {
  selectedWords.length = 0;
  feedback.textContent = "تم مسح الجملة.";
  window.speechSynthesis?.cancel();
  renderSentence();
});

document.getElementById("undoButton").addEventListener("click", () => {
  selectedWords.pop();
  feedback.textContent = "تم حذف آخر عبارة.";
  renderSentence();
});

document.getElementById("speakButton").addEventListener("click", () => {
  if (!selectedWords.length) return;

  if (!("speechSynthesis" in window)) {
    feedback.textContent = "المتصفح لا يدعم تحويل النص إلى صوت.";
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(selectedWords.join("، "));
  utterance.lang = "ar-EG";
  utterance.rate = 0.88;
  utterance.onstart = () => { feedback.textContent = "جاري نطق الجملة..."; };
  utterance.onend = () => { feedback.textContent = "انتهى نطق الجملة."; };
  utterance.onerror = () => { feedback.textContent = "تعذر تشغيل الصوت على هذا الجهاز."; };
  window.speechSynthesis.speak(utterance);
});

document.getElementById("customForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("customText");
  const value = input.value.trim();

  if (!value) {
    feedback.textContent = "اكتب عبارة أولًا.";
    input.focus();
    return;
  }

  addWord(value);
  input.value = "";
  input.focus();
});

renderCards(activeCategory);
renderSentence();
