/*
==========================================================
Audio Spectrum Visualizer
Version : 2.2
Author  : Shahadat Ali

Tech:
HTML5
CSS3
JavaScript
Canvas API
Web Audio API
==========================================================
*/


// ======================================================
// DOM ELEMENTS
// ======================================================

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");


const audioFile = document.getElementById("audioFile");


const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");


const progressBar = document.getElementById("progressBar");
const volumeSlider = document.getElementById("volumeSlider");


const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");


const songTitle = document.getElementById("songTitle");
const songStatus = document.getElementById("songStatus");


const visualizerMode = document.getElementById("visualizerMode");


const fpsCounter = document.getElementById("fpsCounter");



// ======================================================
// CONSTANTS
// ======================================================

const FFT_SIZE = 256;
const BAR_GAP = 2;




// ======================================================
// AUDIO VARIABLES
// ======================================================

const audio = new Audio();


let audioContext = null;

let analyser = null;

let source = null;



let bufferLength = 0;

let dataArray = null;


let smoothData = [];



// Current mode

let currentMode = "blue";



// Animation control

let animationId = null;

let isPlaying = false;



// FPS

let lastFrameTime = performance.now();





// ======================================================
// CANVAS SETUP
// ======================================================

function resizeCanvas(){


    canvas.width = canvas.clientWidth;

    canvas.height = canvas.clientHeight;


}


resizeCanvas();



window.addEventListener(
    "resize",
    resizeCanvas
);





// ======================================================
// EVENT LISTENERS
// ======================================================


audioFile.addEventListener(
    "change",
    loadAudio
);



playBtn.addEventListener(
    "click",
    playAudio
);



pauseBtn.addEventListener(
    "click",
    pauseAudio
);



stopBtn.addEventListener(
    "click",
    stopAudio
);



volumeSlider.addEventListener(
    "input",
    updateVolume
);



progressBar.addEventListener(
    "input",
    seekAudio
);




if(visualizerMode){


    visualizerMode.addEventListener(
        "change",
        function(){


            currentMode = this.value;


        }
    );

}





// ======================================================
// INITIALIZE AUDIO ENGINE
// ======================================================

function initializeAudio(){


    if(audioContext)
        return;



    audioContext = new AudioContext();



    analyser =
    audioContext.createAnalyser();



    analyser.fftSize =
    FFT_SIZE;



    source =
    audioContext.createMediaElementSource(audio);



    source.connect(analyser);



    analyser.connect(
        audioContext.destination
    );



    bufferLength =
    analyser.frequencyBinCount;



    dataArray =
    new Uint8Array(bufferLength);



    smoothData =
    new Array(bufferLength).fill(0);


}





// ======================================================
// LOAD AUDIO FILE
// ======================================================


function loadAudio(event){


    const file =
    event.target.files[0];



    if(!file)
        return;




    songTitle.textContent =
    file.name;



    songStatus.textContent =
    "Ready To Play";




    audio.src =
    URL.createObjectURL(file);



    initializeAudio();



    playBtn.disabled = false;

    pauseBtn.disabled = false;

    stopBtn.disabled = false;




    audio.load();


}





// ======================================================
// PLAY AUDIO
// ======================================================


async function playAudio(){


    if(!audio.src)
        return;




    if(audioContext.state === "suspended"){


        await audioContext.resume();


    }




    audio.play();



    isPlaying = true;



    songStatus.textContent =
    "Playing";




    if(!animationId){

        animate();

    }


}





// ======================================================
// PAUSE AUDIO
// ======================================================


function pauseAudio(){


    audio.pause();



    isPlaying = false;



    songStatus.textContent =
    "Paused";


}






// ======================================================
// STOP AUDIO
// ======================================================


function stopAudio(){


    audio.pause();


    audio.currentTime = 0;



    isPlaying = false;



    songStatus.textContent =
    "Stopped";



    if(animationId){


        cancelAnimationFrame(animationId);


        animationId = null;


    }



    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


}






// ======================================================
// AUDIO EVENTS
// ======================================================


audio.addEventListener(
    "loadedmetadata",
    function(){


        duration.textContent =
        formatTime(audio.duration);


    }
);





audio.addEventListener(
    "timeupdate",
    function(){


        if(!audio.duration)
            return;



        currentTime.textContent =
        formatTime(audio.currentTime);



        progressBar.value =
        (audio.currentTime / audio.duration) * 100;



    }
);





audio.addEventListener(
    "ended",
    function(){


        songStatus.textContent =
        "Finished";


        isPlaying = false;


        progressBar.value = 0;


    }
);





// ======================================================
// TIME FORMAT
// ======================================================


function formatTime(seconds){


    const minutes =
    Math.floor(seconds / 60);



    const secs =
    Math.floor(seconds % 60);



    return (

        String(minutes).padStart(2,"0")
        +
        ":"
        +
        String(secs).padStart(2,"0")

    );


}





// ======================================================
// SEEK
// ======================================================


function seekAudio(){


    if(!audio.duration)
        return;



    audio.currentTime =
    (progressBar.value / 100)
    *
    audio.duration;


}





// ======================================================
// VOLUME
// ======================================================


function updateVolume(){


    audio.volume =
    volumeSlider.value;


}



audio.volume = 1;

volumeSlider.value = 1;

// ======================================================
// ANIMATION LOOP
// ======================================================

function animate(){


    animationId =
    requestAnimationFrame(
        animate
    );



    if(!analyser || !isPlaying)
        return;



    analyser.getByteFrequencyData(
        dataArray
    );



    drawVisualizer();



    updateFPS();



}




// ======================================================
// DRAW VISUALIZER
// ======================================================

function drawVisualizer(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    drawGrid();



    switch(currentMode){


        case "rgb":

            drawRGBSpectrum();

            break;



        case "threeBand":

            drawThreeBandSpectrum();

            break;



        case "blue":

        default:

            drawBlueSpectrum();

            break;


    }



    ctx.shadowBlur = 0;


}





// ======================================================
// BLUE SPECTRUM
// ======================================================


function drawBlueSpectrum(){


    const barWidth =
    canvas.width / bufferLength;



    let x = 0;



    for(
        let i = 0;
        i < bufferLength;
        i++
    ){



        smoothData[i] +=
        (
            dataArray[i]
            -
            smoothData[i]
        )
        *
        0.20;



        const height =
        smoothData[i];



        ctx.fillStyle =
        "#38bdf8";



        ctx.shadowBlur = 15;

        ctx.shadowColor =
        "#38bdf8";




        drawRoundedBar(

            x,

            canvas.height - height,

            barWidth - BAR_GAP,

            height

        );



        x += barWidth;


    }


}






// ======================================================
// RGB SPECTRUM
// ======================================================


function drawRGBSpectrum(){


    const barWidth =
    canvas.width / bufferLength;



    let x = 0;




    for(
        let i = 0;
        i < bufferLength;
        i++
    ){



        smoothData[i] +=
        (
            dataArray[i]
            -
            smoothData[i]
        )
        *
        0.20;



        const height =
        smoothData[i];



        const hue =
        (i / bufferLength) * 360;




        ctx.fillStyle =
        `hsl(${hue},100%,50%)`;



        ctx.shadowBlur = 15;



        ctx.shadowColor =
        `hsl(${hue},100%,50%)`;




        drawRoundedBar(

            x,

            canvas.height - height,

            barWidth - BAR_GAP,

            height

        );



        x += barWidth;



    }


}







// ======================================================
// 3 BAND SPECTRUM
// ======================================================


function drawThreeBandSpectrum(){


    const barWidth =
    canvas.width / bufferLength;



    let x = 0;




    for(
        let i = 0;
        i < bufferLength;
        i++
    ){



        smoothData[i] +=
        (
            dataArray[i]
            -
            smoothData[i]
        )
        *
        0.20;



        const height =
        smoothData[i];




        if(
            i < bufferLength / 3
        ){


            ctx.fillStyle =
            "#ff3b30";


            ctx.shadowColor =
            "#ff3b30";


        }


        else if(
            i < (bufferLength * 2) / 3
        ){


            ctx.fillStyle =
            "#34c759";


            ctx.shadowColor =
            "#34c759";


        }


        else{


            ctx.fillStyle =
            "#0a84ff";


            ctx.shadowColor =
            "#0a84ff";


        }




        ctx.shadowBlur = 15;




        drawRoundedBar(

            x,

            canvas.height - height,

            barWidth - BAR_GAP,

            height

        );



        x += barWidth;



    }


}






// ======================================================
// DRAW BAR
// ======================================================


function drawRoundedBar(
    x,
    y,
    width,
    height
){


    ctx.beginPath();



    ctx.roundRect(

        x,

        y,

        width,

        height,

        4

    );



    ctx.fill();



}






// ======================================================
// GRID BACKGROUND
// ======================================================


function drawGrid(){


    ctx.save();



    ctx.strokeStyle =
    "rgba(255,255,255,0.08)";



    ctx.lineWidth = 1;




    const rows = 8;




    for(
        let i = 1;
        i < rows;
        i++
    ){



        const y =
        (canvas.height / rows) * i;




        ctx.beginPath();



        ctx.moveTo(
            0,
            y
        );



        ctx.lineTo(

            canvas.width,

            y

        );



        ctx.stroke();



    }



    ctx.restore();


}







// ======================================================
// FPS COUNTER
// ======================================================


function updateFPS(){


    const now =
    performance.now();



    const fps =
    Math.round(

        1000 /
        (now - lastFrameTime)

    );



    lastFrameTime =
    now;



    if(fpsCounter){


        fpsCounter.textContent =
        fps;


    }


}