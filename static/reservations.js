document.addEventListener("DOMContentLoaded", async () => {
  try {
		const response = await fetch("/accountInfo");
		
		if (!response.ok) {
			throw new Error("Failed to fetch account information");
		}

		const accountData = await response.json();

	  document.getElementById("username").textContent = accountData.username;
	  document.getElementById("role").textContent = accountData.role;
	  document.getElementById("terms_accepted").textContent = accountData.terms_accepted ? "Yes" : "No";
	  document.getElementById("created_at").textContent = new Date(accountData.created_at).toLocaleString();
  } catch (error) {
	  console.error("Error loading account information:", error);
  }
});
