const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");

const sharingContainer = document.querySelector(".sharing-container");
const fileURLInput = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");

const toast = document.querySelector(".toast");

const maxAllowedSize = 10 * 1024;

const host = "https://quicktransfer-nodejs.herokuapp.com/";
const uploadURL = `${host}api/files`;
// const uploadURL = `${host}api/files`;

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();

    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }
    
});

dropZone.addEventListener("dragleave", ()=>{
    dropZone.classList.remove("dragged");
});
dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.log(files);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", ()=>{
    uploadFile();
});

browseBtn.addEventListener("click", ()=>{
    fileInput.click();
});

copyBtn.addEventListener("click", ()=>{
    fileURLInput.select();
    document.execCommand("copy");
    showToast("Copied to clipboard!");
});

const resetfileinput = ()=>{
    fileInput.value= "";
}

const uploadFile = ()=>{
    
    if(fileInput.files.length > 1){
        fileInput.value = "";
        showToast("Only upload 1 file!");
    }

    const file = fileInput.files[0];

    if(file.size > maxAllowedSize){
        showToast("Upload files should be less than 10kB!");
        //upload size fixed to 10 kb as of now.
        resetfileinput();
        return;
    }
    progressContainer.style.display = "block";

    
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState === XMLHttpRequest.DONE){
            console.log(xhr.response); //we have to show link here;
            showLink(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgess;

    xhr.upload.onerror = ()=>{
        fileInput.value = "";
        showToast(`Error in upload: ${xhr.statusText}`);
    }

    xhr.open("POST", uploadURL);
    xhr.send(formData);

};

const updateProgess = (e)=>{
    const percent = Math.round((e.loaded / e.total) * 100);
    //console.log(percent);
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
}

const showLink = ({file: url})=>{
    console.log(url);
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURLInput.value = url;
}

let toastTimer;
const showToast = (msg)=>{
    toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{
        toast.style.transform = "translate(-50%, 60px)";
    }, 2000);
}