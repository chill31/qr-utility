/** CODE FOR READING QR-CODES */

const wrapper = document.querySelector(".wrapper"),
  readForm = document.querySelector(".read-form"),
  fileInp = readForm.querySelector("input"),
  infoText = readForm.querySelector("p"),
  closeBtn = document.querySelector(".close"),
  copyBtn = document.querySelector(".copy");

function fetchRequest(userFile, formData) {
  infoText.innerText = "Scanning QR Code...";
  fetch("https://api.qrserver.com/v1/read-qr-code/", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((result) => {
      result = result[0].symbol[0].data;
      infoText.innerText = result
        ? "Upload QR Code to Scan"
        : "Couldn't scan QR Code";
      if (!result) return;
      document.querySelector("textarea").innerText = result;
      readForm.querySelector("img").src = URL.createObjectURL(userFile);
      wrapper.classList.add("active");
    })
    .catch(() => {
      infoText.innerText = "Couldn't scan QR Code";
    });
}

fileInp.addEventListener("change", async (e) => {
  let userFile = e.target.files[0];
  if (!userFile) return;
  let formData = new FormData();
  formData.append("file", userFile);
  fetchRequest(userFile, formData);
});

copyBtn.addEventListener("click", () => {
  let text = document.querySelector("textarea").textContent;
  navigator.clipboard.writeText(text);
  copyBtn.textContent = "Copied!";

  setTimeout(() => {
    copyBtn.textContent = "Copy Text";
  }, 1750);
});

readForm.addEventListener("click", () => fileInp.click());
closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));

/** CODE FOR GENERATING QR-CODES */

const genWrapper = document.querySelector(".generate-container .wrapper");
const generateBtn = genWrapper.querySelector(".form button");
const downloadBtn = genWrapper.querySelector(".download-btn");
const genCloseBtn = genWrapper.querySelector(".close-btn");

const input = document.querySelector(".wrapper .form input");
const img = document.querySelector(".wrapper div img");

let imageSrc = '/imgs/qr_code_default.png';

generateBtn.addEventListener("click", () => {
  let qrValue = input.value;
  if (!qrValue) {
    genWrapper.classList.remove("active");
    return;
  }

  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=2000x2000&data=${qrValue}`;
  imageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=2000x2000&data=${qrValue}`;
  genWrapper.classList.add("active");
});

downloadBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const link = document.createElement("a");

  const response = await fetch(imageSrc);
  const blob = await response.blob();

  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;

  link.download = "qr-code.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(objectUrl);
});

genCloseBtn.addEventListener("click", () => genWrapper.classList.remove("active"));