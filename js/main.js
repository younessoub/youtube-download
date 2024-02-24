const videoUrlInput = document.getElementById("video-url");
const fetchInfoButton = document.getElementById("fetch-info");
const formatsContainer = document.getElementById("formats-container");
const formatsList = document.getElementById("formats-list");
const loader = document.getElementById("loader");

fetchInfoButton.addEventListener("click", async () => {
  loader.classList.remove("hidden");
  const url = videoUrlInput.value;

  // Validate
  if (
    !url ||
    !url.match(/https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/)
  ) {
    alert("Invalid YouTube video URL. Please try again.");
    return;
  }

  try {
    // fetching video info
    const response = await fetch(
      import.meta.env.VITE_API_URI + "/info?url=" + url
    );
    const data = (await response.json()).data;

    loader.classList.add("hidden");
    // Check for errors or handle them appropriately
    if (data.error) {
      console.log("Error fetching video info: " + data.error);
      return;
    }

    // Clear existing formats
    formatsList.innerHTML = "";

    // Display available formats
    data.formats.forEach((format) => {
      const formatItem = document.createElement("li");
      formatItem.classList.add(
        "px-4",
        "py-2",
        "rounded-md",
        "cursor-pointer",
        "hover:bg-indigo-100",
        "focus:ring-2",
        "focus:ring-indigo-500",
        "border-2",
        "w-full"
      );
      formatItem.textContent = `${data.videoDetails.title} - ${
        format.container
      } - ${
        format.contentLength
          ? Math.floor(format.contentLength / 1000000)
          : "N/A"
      }MB `;
      formatItem.addEventListener("click", async () => {
        // Handle download logic here
        try {
          // Replace with your actual API endpoint for initiating download with the chosen format
          const downloadResponse =
            await fetch(/* ... your API endpoint for initiating download, passing the URL and format ... */);

          // Check for download initiation success or handle errors
          if (!downloadResponse.ok) {
            alert("Error initiating download: " + downloadResponse.statusText);
            return;
          }

          // Indicate download initiated or redirect to download page
          alert("Download initiated for format: " + format.title);
          // Add additional logic here to handle download progress or redirect to download page
        } catch (err) {
          console.error("Error initiating download:", err);
          alert("An error occurred while initiating download.");
        }
      });
      formatsList.appendChild(formatItem);
    });

    // Show the formats container after fetching info
    formatsContainer.classList.remove("hidden");
  } catch (err) {
    console.error("Error fetching video info:", err);
    alert("An error occurred while fetching video information.");
  }
});
