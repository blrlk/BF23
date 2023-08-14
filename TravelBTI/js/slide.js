var slideIndex = 0;

showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
  
    // 현재 슬라이드 숨기기
    var currentIndex = slideIndex - 1;
    if (currentIndex < 0) {
      currentIndex = slides.length - 1;
    }
    slides[currentIndex].style.opacity = 0;
  
    // 다음 슬라이드 보여주기
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "block";
  
    // fadeIn 효과 적용을 위해 약간의 딜레이 추가
    setTimeout(() => {
      slides[slideIndex - 1].style.opacity = 1;
    }, 100);
  
    setTimeout(showSlides, 2000); // 2초마다 이미지 변경
  }
