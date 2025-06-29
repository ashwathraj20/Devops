const pageMain = document.getElementById("page-main");
      const pageChar = document.getElementById("page-char");
      const pageSentence = document.getElementById("page-sentence");

      // Navigation buttons
      const navMainBtn = document.getElementById("nav-main");
      const navCharBtn = document.getElementById("nav-char");
      const navSentenceBtn = document.getElementById("nav-sentence");

      // Main Page clickable cards
      const startCharTestBtn = document.getElementById("start-char-test");
      const startSentenceTestBtn = document.getElementById("start-sentence-test");

      // Character Practice elements
      const originalCharDiv = document.getElementById("original-char");
      const typedCharInput = document.getElementById("typed-char");
      const correctCountDisplay = document.getElementById("correct-count");
      const wrongCountDisplay = document.getElementById("wrong-count");
      const accuracyDisplay = document.getElementById("accuracy");
      const cpmDisplay = document.getElementById("cpm");
      const charStartBtn = document.getElementById("char-start-btn");
      const charResetBtn = document.getElementById("char-reset-btn");
      const charBackBtn = document.getElementById("char-back-btn");

      // Sentence Practice elements
      const sentenceTextDiv = document.getElementById("sentence-text");
      const sentenceInput = document.getElementById("sentence-input");
      const sentenceTimerDisplay = document.getElementById("sentence-timer");
      const sentenceAccuracyDisplay = document.getElementById("sentence-accuracy");
      const wpmDisplay = document.getElementById("wpm");
      const sentenceStartBtn = document.getElementById("sentence-start-btn");
      const sentenceResetBtn = document.getElementById("sentence-reset-btn");
      const sentenceBackBtn = document.getElementById("sentence-back-btn");

      // Shared Navigation Helpers
      function resetNavUnderline() {
        [...document.querySelectorAll(".nav-btn")].forEach((btn) => {
          btn.classList.remove("underline", "decoration-yellow-300", "decoration-4", "decoration-solid");
        });
      }

      function showPage(target) {
        pageMain.classList.add("hidden");
        pageChar.classList.add("hidden");
        pageSentence.classList.add("hidden");
        if (target === "main") {
          pageMain.classList.remove("hidden");
          resetNavUnderline();
          navMainBtn.classList.add("underline", "decoration-yellow-300", "decoration-4", "decoration-solid");
        } else if (target === "char") {
          pageChar.classList.remove("hidden");
          resetNavUnderline();
          navCharBtn.classList.add("underline", "decoration-yellow-300", "decoration-4", "decoration-solid");
        } else if (target === "sentence") {
          pageSentence.classList.remove("hidden");
          resetNavUnderline();
          navSentenceBtn.classList.add("underline", "decoration-yellow-300", "decoration-4", "decoration-solid");
        }
      }

      // INITIAL SHOW MAIN PAGE
      showPage("main");

      // NAVIGATION EVENTS
      navMainBtn.addEventListener("click", () => {
        showPage("main");
        resetCharPractice();
        resetSentencePractice();
      });
      navCharBtn.addEventListener("click", () => {
        showPage("char");
        resetCharPractice();
      });
      navSentenceBtn.addEventListener("click", () => {
        showPage("sentence");
        resetSentencePractice();
      });

      // Cards on main page
      startCharTestBtn.addEventListener("click", () => {
        showPage("char");
        resetCharPractice();
      });
      startCharTestBtn.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          showPage("char");
          resetCharPractice();
          typedCharInput.focus();
        }
      });

      startSentenceTestBtn.addEventListener("click", () => {
        showPage("sentence");
        resetSentencePractice();
      });
      startSentenceTestBtn.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          showPage("sentence");
          resetSentencePractice();
          sentenceInput.focus();
        }
      });

      // CHARACTER PRACTICE LOGIC
      let charTestIntervalId = null;
      let charStartTime = null;
      let charTestDuration = 30000; // 30 seconds
      let correctCount = 0;
      let wrongCount = 0;
      let currentChar = '';

      function randomChar() {
        // Letters both uppercase and lowercase
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        return chars.charAt(Math.floor(Math.random() * chars.length));
      }

      function updateCharStats() {
        const total = correctCount + wrongCount;
        const accuracy = total === 0 ? 100 : Math.round((correctCount / total) * 100);
        const elapsedInMinutes = (Date.now() - charStartTime) / 60000 || 1 / 60;
        const speedCPM = Math.round(correctCount / elapsedInMinutes);
        correctCountDisplay.textContent = correctCount;
        wrongCountDisplay.textContent = wrongCount;
        accuracyDisplay.textContent = accuracy + "%";
        cpmDisplay.textContent = speedCPM + " CPM";
      }

      function newCharToType() {
        currentChar = randomChar();
        originalCharDiv.textContent = currentChar;
        typedCharInput.value = "";
        typedCharInput.focus();
      }

      function startCharTest() {
        correctCount = 0;
        wrongCount = 0;
        charStartTime = Date.now();
        charStartBtn.disabled = true;
        charResetBtn.disabled = false;
        typedCharInput.disabled = false;

        newCharToType();
        updateCharStats();

        if (charTestIntervalId) clearInterval(charTestIntervalId);
        charTestIntervalId = setInterval(() => {
          const elapsed = Date.now() - charStartTime;
          if (elapsed >= charTestDuration) {
            finishCharTest();
          }
        }, 200);
      }

      function finishCharTest() {
        if (charTestIntervalId) clearInterval(charTestIntervalId);
        charTestIntervalId = null;
        charStartBtn.disabled = false;
        typedCharInput.disabled = true;
        alert(`Character Practice Test Finished!\n\nCorrect: ${correctCount}\nWrong: ${wrongCount}\nAccuracy: ${accuracyDisplay.textContent}\nSpeed: ${cpmDisplay.textContent}`);
      }

      function resetCharPractice() {
        if (charTestIntervalId) clearInterval(charTestIntervalId);
        charTestIntervalId = null;
        correctCount = 0;
        wrongCount = 0;
        currentChar = '';
        originalCharDiv.textContent = "";
        typedCharInput.value = "";
        typedCharInput.disabled = true;
        correctCountDisplay.textContent = 0;
        wrongCountDisplay.textContent = 0;
        accuracyDisplay.textContent = "100%";
        cpmDisplay.textContent = "0 CPM";
        charStartBtn.disabled = false;
        charResetBtn.disabled = true;
      }

      // Handle character input submission
      typedCharInput.addEventListener("input", (e) => {
        if (!charStartBtn.disabled) return; // test not started
        const typed = typedCharInput.value;
        if (typed.length === 1) {
          if (typed === currentChar) {
            correctCount++;
          } else {
            wrongCount++;
          }
          updateCharStats();
          newCharToType();
        }
      });

      charStartBtn.addEventListener("click", startCharTest);
      charResetBtn.addEventListener("click", resetCharPractice);

      charBackBtn.addEventListener("click", () => {
        showPage("main");
        resetCharPractice();
      });
      charBackBtn.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          showPage("main");
          resetCharPractice();
        }
      });

      // SENTENCE PRACTICE LOGIC
      let sentenceTestTimeout = null;
      let sentenceTestStartTime = null;
      let sentenceTestTimeLength = 60; // seconds default
      let sentenceTestInterval = null;

      // Sentences array to randomly select for sentence test (can add more)
      const sentenceSamples = [
        "Dealing Natural Disasters: A natural disaster is a major event resulting from processes of the Earth. It causes a lot of life and property loss. It is true that a disaster is a natural process and stop it but by making certain we can reduce the magnitution of the loss property.",
        "Typing speed tests measure how fast and accurately you can type. With practice, people can increase their typing speed significantly.",
        "Good reading skills help improve comprehension and overall knowledge, which in turn supports better writing and typing abilities.",
        "The quick brown fox jumps over the lazy dog is a pangram commonly used to test typing skills because it includes every letter of the English alphabet.",
        "Practice daily for best results; consistency is key to mastering any new skill including typing and reading."
      ];

      function calculateAccuracy(original, typed) {
        let correctChars = 0;
        for (let i = 0; i < typed.length; i++) {
          if (typed[i] === original[i]) {
            correctChars++;
          }
        }
        return typed.length === 0 ? 100 : Math.round((correctChars / typed.length) * 100);
      }

      function calculateWPM(text, elapsedSeconds) {
        // Words per minute = (typed words / elapsed minutes)
        const wordsTyped = text.trim().split(/\s+/).length;
        const elapsedMinutes = elapsedSeconds / 60 || 1 / 60;
        return Math.round(wordsTyped / elapsedMinutes);
      }

      function loadNewSentence() {
        const index = Math.floor(Math.random() * sentenceSamples.length);
        const sentence = sentenceSamples[index];
        sentenceTextDiv.textContent = sentence;
        sentenceInput.value = "";
        sentenceInput.disabled = true;
        sentenceAccuracyDisplay.textContent = "100%";
        wpmDisplay.textContent = "0";
        sentenceTimerDisplay.textContent = sentenceTestTimeLength;
      }

      function startSentenceTest() {
        loadNewSentence();
        sentenceInput.disabled = false;
        sentenceInput.focus();
        sentenceTestStartTime = Date.now();

        if (sentenceTestInterval) clearInterval(sentenceTestInterval);
        sentenceTestInterval = setInterval(() => {
          const elapsedMs = Date.now() - sentenceTestStartTime;
          const timeLeft = Math.max(0, sentenceTestTimeLength - Math.floor(elapsedMs / 1000));
          sentenceTimerDisplay.textContent = timeLeft;
          if (timeLeft <= 0) {
            finishSentenceTest();
          }
        }, 300);
      }

      function finishSentenceTest() {
        if (sentenceTestInterval) clearInterval(sentenceTestInterval);
        sentenceTestInterval = null;
        const originalText = sentenceTextDiv.textContent.trim();
        const typedText = sentenceInput.value.trim();
        const elapsedSeconds = (Date.now() - sentenceTestStartTime) / 1000;
        sentenceInput.disabled = true;

        const acc = calculateAccuracy(originalText, typedText);
        const wpm = calculateWPM(typedText, elapsedSeconds);

        sentenceAccuracyDisplay.textContent = acc + "%";
        wpmDisplay.textContent = wpm;

        alert(`Sentence Test Finished!\n\nAccuracy: ${acc}%\nWPM: ${wpm}`);
      }

      function resetSentencePractice() {
        if (sentenceTestInterval) clearInterval(sentenceTestInterval);
        sentenceTestInterval = null;
        sentenceInput.disabled = true;
        sentenceInput.value = "";
        sentenceAccuracyDisplay.textContent = "100%";
        wpmDisplay.textContent = "0";
        sentenceTimerDisplay.textContent = sentenceTestTimeLength;
        loadNewSentence();
      }

      sentenceStartBtn.addEventListener("click", startSentenceTest);
      sentenceResetBtn.addEventListener("click", resetSentencePractice);

      sentenceBackBtn.addEventListener("click", () => {
        showPage("main");
        resetSentencePractice();
      });
      sentenceBackBtn.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          showPage("main");
          resetSentencePractice();
        }
      });

      // Track sentence input on each key for live accuracy and WPM updates
      sentenceInput.addEventListener("input", () => {
        if (sentenceInput.disabled || !sentenceTestStartTime) return;
        const originalText = sentenceTextDiv.textContent.trim();
        const typedText = sentenceInput.value.trim();
        const elapsedSeconds = (Date.now() - sentenceTestStartTime) / 1000;
        const acc = calculateAccuracy(originalText, typedText);
        sentenceAccuracyDisplay.textContent = acc + "%";
        const wpm = calculateWPM(typedText, elapsedSeconds);
        wpmDisplay.textContent = wpm;
      });


(() => {
  
})();
