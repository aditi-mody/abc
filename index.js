const dropZone = document.querySelector(".drop-zone");

dropZone.addEventListener("dragover", (e)=>{
    console.log("dragging ");
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }
    
});

dropZone.addEventListener("dragleave", ()=>{
    dropZone.classList.remove("dragged")
})