<template>
 <div class="curved-div first">
  <h1 class="mainh1">Covering letter generator</h1>
  <p>
    Generate a covering letter from your resume and the desired job offer.
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
    <h3>Step 1: Select your CV</h3>
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
  <p>

  </p>
  <svg viewBox="0 0 1440 319">
    <path fill="#00BBF9" fill-opacity="1" d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
</div>
<section class="footer">
    <p>2023 by Franky Melero</p>
</section>
  </template>

  <script setup>
const config = useRuntimeConfig();
import pdfjs from 'pdfjs-dist/build/pdf';

const form = ref({
  offer: '',
  language: 'english',
  wordlimit: 100,
});

const pdfContent = ref(null);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file && file.name.endsWith('.pdf')) {
    const fileReader = new FileReader();

    fileReader.onload = async () => {
  const buffer = new Uint8Array(fileReader.result);

  try {
    const pdf = await pdfjs.getDocument({ data: buffer }).promise;
    form.pdfContent = pdf;
  } catch (error) {
    console.error('Error while loading PDF:', error);
  }
};

    fileReader.readAsArrayBuffer(file);
  } else {
    pdfContent.value = null;
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  console.log('Language:', form.language);
  console.log('Offer:', form.offer);
  console.log('wordlimit:', form.wordlimit);
  console.log(config.public.token);
  console.log('PDF Content:', pdfContent.value);

  // Puedes realizar más acciones, como enviar los datos a un servidor
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
</style>
