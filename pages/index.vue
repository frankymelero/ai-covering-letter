<template>
 <div class="curved-div first">
  <h1 class="mainh1">Covering letter generator</h1>
  <p class="p1">
    Generate compelling cover letters with the power of AI. Take the hassle out of job applications and trust our Covering Letter Generator to help you land your dream job.
  </p>
  <a href="#getting-started"><input type="button" value="Start Now" class="start"></a>
  <svg viewBox="0 0 1440 319">
    <path fill="#00F5D4" fill-opacity="1" d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
</div>
<form @submit="handleSubmit">
<div class="curved-div second" id="getting-started">
  <h2>Get Started</h2>
 <div class="flexbox">
  <div class="left-box">
    <h3>Step 1: Select your CV in .pdf format</h3>
    <input type="file" @change="handleFileUpload" accept=".pdf" />
  </div> 
  <div class="right-box">
    <h3>Step 2: Paste the offer</h3>
    <textarea cols="45" rows="25" v-model="form.offer"></textarea>
  </div> 
  <div class="center-box">
    <h3>Step 3: Select your language, word limit and generate!</h3>
    <select name="language" v-model="form.language"><option value="english">English</option><option value="español">Español</option><option value="french">François</option><option value="italian">Italiano</option><option value="portuguese">Portuguese</option></select>
  <select name="wordlimit" v-model="form.wordlimit"><option value="100">100 words</option><option value="200">200 words</option><option value="300">300 words</option><option value="400">400 words</option><option value="500">500 words</option><option value="600">600 words</option><option value="700">700 words</option></select>
    <br><br> <input type="submit" value="Generate" >
</div>
  </div>


  <svg viewBox="0 0 1440 319">
    <path fill="#FEE440" fill-opacity="1" d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
</div>
</form>
<div class="curved-div third" id="results">
  <h1>Results</h1>
  <p v-html="chatResponse" class="resp">

  </p>
  <svg viewBox="0 0 1440 319">
    <path fill="#00BBF9" fill-opacity="1" d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
</div>
<div class="overlay" v-if="loading">
    <div class="loading-message">
      Generating covering letter... It might take up to 120 seconds.
    </div>
  </div>
<section class="footer">
    <p>2023 by Franky Melero</p>
</section>
  </template>
<script setup>
import * as pdfjs from 'pdfjs-dist/build/pdf';
const config = useRuntimeConfig();
if (pdfjs.GlobalWorkerOptions) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
}


const loading = ref(false);
const form = ref({
  offer: '',
  language: 'english',
  wordlimit: 100,
  pdfContent: null,
  fullText: '', // Agregamos una propiedad para almacenar el texto del PDF
});

const chatResponse = ref('Please introduce your data in order to see the results.');

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file && file.name.endsWith('.pdf')) {
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const buffer = new Uint8Array(fileReader.result);
      try {
        const pdfDocument = await pdfjs.getDocument({ data: buffer }).promise;
        form.pdfContent = pdfDocument;

        // Extraer el texto del PDF
        const numPages = pdfDocument.numPages;
        const fullText = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDocument.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((textItem) => textItem.str).join(' ');
          fullText.push(pageText);
        }
        form.fullText = fullText.join(' ');
      } catch (error) {
        console.error('Error while loading PDF:', error);
      }
    };

    fileReader.readAsArrayBuffer(file);
  } else {
    form.pdfContent = null;
  }
};
const handleSubmit = async (event) => {
  event.preventDefault();

  if (form.pdfContent == null) {
    alert("Invalid file extension. Please upload a .pdf file.");
    return;
  }

  loading.value = true; // Muestra el overlay de carga

  try {
    await sendToChatGpt(form);
    // Cuando la promesa se resuelva correctamente, oculta el overlay de carga
    loading.value = false;
    scrollToResults();
  } catch (error) {
    // Maneja errores aquí, por ejemplo, muestra un mensaje de error
    console.error("Error al generar la respuesta:", error);
    loading.value = false; // Asegúrate de ocultar el overlay en caso de error
  }
};

const sendToChatGpt = async (formContent) => {
  const cvContent = formContent.fullText;
  const language = formContent.value.language;
  const offerContent = formContent.value.offer;
  const wordLimit = formContent.value.wordlimit;
  const response = {};

  const systemMessage = [{
    role: "system",
    content:  `Genera una covering letter en ${language} de unas ${wordLimit}. Esta es la ofera:${offerContent}. Este es mi CV: ${cvContent}. En el caso que en la oferta se incluya el nombre de la empresa, se ha de incluir en la carta de presentación.`
  }];
  
  return new Promise((resolve, reject) => {
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.public.token}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: systemMessage,
        max_tokens: 800,
        temperature: 0.7,
        n: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.choices && data.choices.length > 0) {
          document.querySelector(".resp").style.textAlign = "left";
          const response = data.choices[0].message.content;
          const formattedResponse = response.replace(/\n/g, '<br>');
          chatResponse.value = formattedResponse;
          resolve(); // Resuelve la promesa cuando se completa con éxito
          
        } else {
          console.error("No response data.");
          reject("No response data"); // Rechaza la promesa en caso de error
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error); // Rechaza la promesa en caso de error
      });
  });
};

const scrollToResults = () => {
  const element = document.getElementById('results');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
    };

</script>

<style>
body {
    margin: 0;
    padding: 0;
    border: 0;
    overflow-x: hidden;
    
}
.curved-div {
  background: #00BBF9;
  color: black;
  text-align: center;
  border-bottom: transparent;
  min-height: 75vh;
  margin-top: -7vh;
}
.first{
    min-height: 85vh;
padding-top: 15vh;
}

.second{
    background: #00F5D4 !important;
   
}
.third{
    background: #FEE440 !important;
}


.curved-div h1 {
  font-size: 6rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.curved-div h2 {
  font-size: 4rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin-top: -5vh;
}

.curved-div h3{
  font-size: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: normal;
}
.curved-div p {
  font-size: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.curved-div svg {
  display: block;
margin-top: 20vh;
}
.first svg{
    display: block;
margin-top: 10vh !important;
}
.start{
    height: 60px;
    width: 200px;
    background-color: rgba(0,0,0,0.8);
    color: white;
    border:2px solid white;
    margin-top: 10vh;
    font-size: 26px;
    border-radius: 15px;
    transition: 0.2s;
}
.start:hover{
    cursor: pointer;
    background-color: rgba(0,0,0,1);
    transition: 0.2s;
}
.footer{
    text-align: center;
    font-weight: 600;
    font-size: 25px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #00BBF9;
    margin-top: -10vh;
    height: 15vh;
}
.flexbox{
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.left-box{
    width: 50%;
    height: 30vh;
  
}
.right-box{
    width: 50%;
    height: 30vh;
    overflow: hidden;
 
}
.center-box{
    width: 100%;
    height: 4vh;
    margin-top: 0vh;
    padding-bottom: 4vh;

}
textarea{
    max-height: 15vh;
    resize: none;
}
select{
    width: 200px;
    font-size: 20px;
    text-align: center;
}
input[type=submit]{
    width: 150px;
    height: 60px;
    background-color: rgba(0,0,0,0.8);
    border-radius: 15px;
    color: white;
    font-size: 25px;
    margin-top: 3vh;
    border: 2px solid white;
    margin-bottom: -10vh;
    transition: 0.2s;
    border-radius: 10px;
}
input[type=submit]:hover{
    cursor: pointer;
    background-color: rgba(0,0,0,1);
    transition: 0.2s;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Fondo gris semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Asegura que esté por encima de otros elementos */
}

.loading-message {
  color: white;
  font-size: 24px;
}
.resp{
  text-align: center;
  padding-left: 2vw;
}
.p1{
  width: 80vw;
  margin-left: 10vw;
}
@media screen and (min-width: 572px) and (max-width: 1100px)  {
  .curved-div svg {
    display: block;
    margin-top: 27vh;
}
}

@media screen and (max-width: 571px) {
  .curved-div svg {
    display: block;
    margin-top: 38vh;
}
.left-box{
  width: 100vw;
  height: 20vh;
}
.right-box{
  width: 100vw;
  height: 27vh;
}
h3{
  padding-right: 2vw;
  padding-left: 2vw;
  font-size: 2rem;
}
.curved-div h1 {
     font-size: 3rem; 
   
}
.curved-div.second svg {
    display: block;
    margin-top: 43vh;
}
.right-box{
  width: 100vw;
    height: 32vh;
    margin-top: 3vh;
}

}

</style>
