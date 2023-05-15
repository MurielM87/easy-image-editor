const fileInput = document.querySelector('.file_input');
filterOptions = document.querySelectorAll('.filter button');
filterName = document.querySelector('.filter_info .name');
filterValue = document.querySelector('.filter_info .value');
filterSlider = document.querySelector('.slider input');
rotateOptions = document.querySelectorAll('.rotate button');
previewImg = document.querySelector('.preview_img img');
resetFilterBtn = document.querySelector('.reset_filter');
chooseImgBtn = document.querySelector('.choose_img');
saveImgBtn = document.querySelector('.save_img');

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = function () {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = function () {
    let file = fileInput.files[0]; //select file
    if (!file) return;
    previewImg.src = URL.createObjectURL(file); //passing file url as preview img src
    previewImg.addEventListener('load', () => {
        resetFilterBtn.click(); //clicking reset btn so the filter value reset if the user select new image
        document.querySelector('.container').classList.remove('disable');
    })
}

filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        document.querySelector('.filter .active').classList.remove('active');
        option.classList.add('active');
        filterName.innerText = option.innerText;

        if (option.id === 'brightness') {
            filterSlider.max = '200';
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === 'saturation') {
            filterSlider.max = '200';
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === 'inversion') {
            filterSlider.max = '100';
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = '100';
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    })
})

const updateFilter = function () {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector('.filter .active');

    if (selectedFilter.id === 'brightness') {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === 'saturation') {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === 'inversion') {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilters();
}

rotateOptions.forEach(option => {
    option.addEventListener('click', () => {
        if (option.id === 'left') {
            rotate -= 90; //if clicked btn is left rotate, decrement rotate value by -90
        } else if (option.id === 'right') {
            rotate += 90; //if clicked btn is right rotate, decrement rotate value by +90
        } else if (option.id === 'horizontal') {
            //if flipHorizontal value is 1, set this value to -1 else set 1
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            //if flipVertical value is 1, set this value to -1 else set 1
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    })
})

const resetFilter = function () {
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click(); //clicking brightness btn, so te brightness selected by default
    applyFilters();
}

const saveImg = function() {
    const canvas = document.createElement('canvas'); //creating canvas element
    const ctx = canvas.getContext('2d'); //canvas.getContext return a drawing context on the canvas
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    //applying user selected filters to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2); //translating canvas from center
    if(rotate !== 0) {//if rotate value isn't 0, rotate the canvas
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical); //flip canvas horizontally/vertically
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height); //drawImage(image to draw, dx, dy, dWidth, dHeight)
    
    const link = document.createElement('a'); //creating <a> element
    link.download = 'image.jpg'; 
    link.href = canvas.toDataURL();
    link.click(); // clicking <a> tag so the image download
}

fileInput.addEventListener('change', loadImage);
filterSlider.addEventListener('input', updateFilter);
resetFilterBtn.addEventListener('click', resetFilter);
saveImgBtn.addEventListener('click', saveImg)
chooseImgBtn.addEventListener('click', () => fileInput.click());