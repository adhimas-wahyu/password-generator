(function () {
  const form = document.getElementById("passwordForm");
  const lengthInput = document.getElementById("length");
  const output = document.getElementById("generatedPassword");
  const copyBtn = document.getElementById("copyButton");
  const saveBtn = document.getElementById("saveButton");

  const LOWER = "abcdefghijklmnopqrstuvwxyz";
  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const DIGITS = "0123456789";
  const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>/?`~|";

  function getRandomInt(max) {
    // secure random integer in [0, max)
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = getRandomInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function generatePassword(len) {
    len = Math.max(4, Math.min(256, Number(len) || 12));
    // ensure at least one from each category when possible
    const categories = [LOWER, UPPER, DIGITS, SYMBOLS];
    const all = categories.join("");
    const chars = [];

    // guarantee one char from each category for lengths >=4
    for (let i = 0; i < 4 && i < len; i++) {
      const set = categories[i];
      chars.push(set[getRandomInt(set.length)]);
    }

    // fill remaining
    for (let i = chars.length; i < len; i++) {
      chars.push(all[getRandomInt(all.length)]);
    }

    return shuffleArray(chars).join("");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const pwd = generatePassword(lengthInput.value);
    output.value = pwd;
  });

  copyBtn.addEventListener("click", async function () {
    const text = output.value;
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy to Clipboard"), 1500);
      } catch {
        fallbackCopy(text);
      }
    } else {
      fallbackCopy(text);
    }
  });

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy to Clipboard"), 1500);
    } finally {
      document.body.removeChild(ta);
    }
  }

  saveBtn.addEventListener("click", function () {
    const text = output.value;
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const now = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `password-${now}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
})();
