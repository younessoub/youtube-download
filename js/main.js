const videoUrlInput = document.getElementById("video-url");
const fetchInfoButton = document.getElementById("fetch-info");
const formatsContainer = document.getElementById("formats-container");
const formatsList = document.getElementById("formats-list");
const loader = document.getElementById("loader");
const image = document.getElementById("image");
const title = document.getElementById("title");

fetchInfoButton.addEventListener("click", async () => {
  loader.classList.remove("hidden");
  const url = videoUrlInput.value;

  // Validate
  if (
    !url ||
    !url.match(/https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/)
  ) {
    alert("Invalid YouTube video URL. Please try again.");
    loader.classList.add("hidden");
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

    // fill the card
    image.src = data.videoDetails.thumbnails[0].url;
    title.innerText = data.videoDetails.title;

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
        "w-full",
        "flex",
        "items-center",
        "gap-2"
      );
      formatItem.dataset.itag = format.itag;
      formatItem.innerHTML = `${format.mimeType.split("/")[0]} ${
        format.hasAudio == false
          ? "<img class='w-6 h-6' src='/noaudio.svg' />"
          : ""
      } ${format.qualityLabel ? format.qualityLabel : format.codecs} ${
        format.container
      } - ${
        format.contentLength
          ? Math.floor(format.contentLength / 1000000) + "MB"
          : ""
      }`;
      formatItem.addEventListener("click", async () => {
        // Handle download
        try {
          window.open(
            `${import.meta.env.VITE_API_URI}/download?url=${url}&itag=${
              format.itag
            }&container=${format.container}`,
            "_blank"
          );
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
