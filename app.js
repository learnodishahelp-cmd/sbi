const form = document.getElementById("registrationForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageEl.textContent = "";
  messageEl.className = "message";

  const formData = new FormData(form);
  const payload = {
    staffName: formData.get("staffName")?.trim(),
    pfNumber: formData.get("pfNumber")?.trim(),
    branch: formData.get("branch")?.trim(),
    boardingPlace: formData.get("boardingPlace")?.trim(),
    mobileNumber: formData.get("mobileNumber")?.trim(),
    numPersons: Number(formData.get("numPersons") || "1"),
    vehicleRequired: formData.get("vehicleRequired"),
    remarks: formData.get("remarks")?.trim(),
  };

  // Basic frontend validation (extra safety)
  if (!payload.pfNumber || !payload.mobileNumber) {
    messageEl.textContent = "PF Number and Mobile Number are required.";
    messageEl.classList.add("error");
    return;
  }

  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  try {
    const res = await fetch("YOUR_N8N_WEBHOOK_URL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.status === "success") {
      messageEl.textContent =
        data.message || "Registration submitted successfully.";
      messageEl.classList.add("success");
      form.reset();
    } else {
      messageEl.textContent =
        data.message || "Registration could not be processed.";
      messageEl.classList.add("error");
    }
  } catch (err) {
    messageEl.textContent = "Network error. Please try again.";
    messageEl.classList.add("error");
  } finally {
    submitBtn.disabled = false;
  }
});
