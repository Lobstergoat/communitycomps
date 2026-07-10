/* =====================================================================
   CommunityComps — email signup handler
   ---------------------------------------------------------------------
   FILL IN THESE TWO VALUES from your Supabase project:
     Supabase dashboard -> Project Settings -> API
       - Project URL     -> SUPABASE_URL
       - anon public key -> SUPABASE_ANON_KEY
   ===================================================================== */

const SUPABASE_URL = "https://YOUR-PROJECT-ref.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
const TABLE = "signups"; // change if you named your table differently

/* --------------------------------------------------------------------- */

const form = document.getElementById("signup-form");
const input = document.getElementById("signup-email");
const button = document.getElementById("signup-button");
const note = document.getElementById("signup-note");

const DEFAULT_NOTE = "No spam — just one note when we launch.";

function setNote(message, type) {
  note.textContent = message;
  note.classList.remove("signup__note--error", "signup__note--success");
  if (type === "error") note.classList.add("signup__note--error");
  if (type === "success") note.classList.add("signup__note--success");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = input.value.trim();

  if (!isValidEmail(email)) {
    setNote("Please enter a valid email address.", "error");
    input.focus();
    return;
  }

  button.disabled = true;
  button.textContent = "Adding you…";
  setNote(DEFAULT_NOTE);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      button.textContent = "You're on the list";
      input.value = "";
      input.disabled = true;
      setNote("Thanks — we'll be in touch when we launch.", "success");
      return;
    }

    if (response.status === 409) {
      button.textContent = "You're on the list";
      input.disabled = true;
      setNote("You're already on the list — see you at launch.", "success");
      return;
    }

    throw new Error(`Request failed with status ${response.status}`);
  } catch (error) {
    console.error(error);
    button.disabled = false;
    button.textContent = "Notify me";
    setNote("Something went wrong. Please try again.", "error");
  }
});