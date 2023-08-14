document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.swiper-container', {
    //기본 셋팅
    //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
    direction: 'horizontal',
    //한번에 보여지는 페이지 숫자
    slidesPerView: 4,
    //페이지와 페이지 사이의 간격
    spaceBetween: 20,
    //드레그 기능 true 사용가능 false 사용불가
    debugger: true,
    //마우스 휠기능 true 사용가능 false 사용불가
    mousewheel: true,
    //반복 기능 true 사용가능 false 사용불가
    loop: true,
    //선택된 슬라이드를 중심으로 true 사용가능 false 사용불가 djqt
    centeredSlides: true,
    // 페이지 전환효과 slidesPerView효과와 같이 사용 불가
    // effect: 'fade',
    autoHeight: true,
   
    //자동 스크를링
    autoplay: {
      //시간 1000 이 1초
      delay: 2500,
      disableOnInteraction: false,
     },
   
    //페이징
    pagination: {
      //페이지 기능
      el: '.swiper-pagination',
      //클릭 가능여부
      clickable: true,
    },
  
    //방향표
    navigation: {
      //다음페이지 설정
      nextEl: '.swiper-button-next',
      //이전페이지 설정
      prevEl: '.swiper-button-prev',
    },


    slidesPerView: 1, //640~1024 해상도 외 레이아웃 뷰 개수
        spaceBetween: 10, //위 slidesPerview 여백
        breakpoints: { //반응형 조건 속성
          640: { //640 이상일 경우
            slidesPerView: 2, //레이아웃 2열
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }

  });

  
  });
  

  function start(url) {
    window.location.href = url;
}