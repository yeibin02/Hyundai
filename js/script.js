window.onload = function () {
  //aos기능
  AOS.init();
  //메뉴 기능
  const nav = document.querySelector(".nav");
  const btMenu = document.querySelector(".bt-menu");
  const navClose = document.querySelector(".nav-close");
  btMenu.addEventListener("click", function () {
    nav.classList.add("nav-active");
  });
  navClose.addEventListener("click", function () {
    nav.classList.remove("nav-active");
  });
  // nav 영역을 벗어나는 이벤트 발생처리
  nav.addEventListener("mouseleave", function () {
    nav.classList.remove("nav-active");
  });
  //스크롤 기능
  //스크롤바의 상단위치
  let scy = 0;
  let scActive = 50;
  scy = window.document.documentElement.scrollTop;
  let header = document.querySelector(".header");
  let logoW = document.querySelector(".logo-w");
  let logoG = document.querySelector(".logo-g");
  header.addEventListener("mouseenter", function () {
    header.classList.add("header-active");
    logoW.style.display = "none";
    logoG.style.display = "block";
  });
  header.addEventListener("mouseleave", function () {
    if (scy < scActive) {
      header.classList.remove("header-active");
      logoW.style.display = "block";
      logoG.style.display = "none";
    }
  });
  //새로고침 시 적용
  if (scy > scActive) {
    header.classList.add("header-active");
    logoW.style.display = "none";
    logoG.style.display = "block";
  }
  window.addEventListener("scroll", function () {
    scy = window.document.documentElement.scrollTop;
    // console.log(scy);
    if (scy > scActive) {
      header.classList.add("header-active");
      logoW.style.display = "none";
      logoG.style.display = "block";
    } else {
      header.classList.remove("header-active");
      logoW.style.display = "block";
      logoG.style.display = "none";
    }
  });
  //펼침 언어 기능
  const langWord = document.querySelector(".language-word");
  const language = document.querySelector(".language");
  const languageLi = document.querySelector(".language li");
  setTimeout(function () {
    languageLi.style.transition = "all 0.2s";
  }, 500);
  langWord.addEventListener("click", function () {
    language.classList.toggle("language-box-active");
  });

  // 비디오 항목을 체크(video 태그로 파악)
  let videos = document.querySelectorAll(".swVisual video");
  // 비디오 시간 체크
  let videosTimeArr = [];

  for (let i = 0; i < videos.length; i++) {
    // 시간을 보관한다
    videosTimeArr[i] = Math.ceil(videos[i].duration); // duration: 재생하는 시간을 나타냄.
  }

  // 첫번째 비디오 자동 실행
  let videoIndex = 0;
  videos[videoIndex].play();
  // visual slide
  let swVisual = new Swiper(".swVisual", {
    loop: true,
  });

  // 슬라이드 변경 이벤트시 처리
  swVisual.on("slideChange", function () {
    // 진행 중인 비디오 멈춤
    videos[videoIndex].pause();
    // 다음 화면에 보이는 swiper 슬라이드 번호
    videoIndex = swVisual.realIndex;
    // 현재 보이는 슬라이드에 해당하는 비디오의 재생시간을 처음으로 설정
    videos[videoIndex].currentTime = 0;

    const playPromise = videos[videoIndex].play();
    if (playPromise !== undefined) {
      // 기다렸다가 에러메세지를 띄워라
      playPromise.then((_) => {}).catch((error) => {});
    }
    // 방어코드
    clearInterval(videoTimer);
    videoReset();
  });

  // 비디오 영상이 플레이가 끝나면 다음 슬라이드로 이동
  // 늘어나는 흰색 bar
  let bars = document.querySelectorAll(".bar");
  // 늘어나는 길이를 위한 값(최대 100)
  let barScaleW = 0;
  // 타이머 생성
  //비디오 타이머를 초기화 및 설정
  let videoTimer;

  function videoReset() {
    // 처음에는 0%로 만들려고 한다
    barScaleW = 0;
    // 최초의 bar를 초기화 한다
    for (let i = 0; i < bars.length; i++) {
      let tag = bars[i];
      tag.style.width = `${barScaleW}%`;
    }

    // 활성화 될 때 bar 클래스 선택
    let activeBar = bars[videoIndex];
    //setTimeout : 1번 실행 clearTimeout()
    //setInterval : 시간마다 연속 실행 clearInterval()
    clearInterval(videoTimer);
    let videoTime = videosTimeArr[videoIndex];
    videoTimer = setInterval(() => {
      barScaleW++;
      activeBar.style.width = `${barScaleW}%`;

      if (barScaleW >= 100) {
        swVisual.slideNext();
        clearInterval(videoTimer);
        videoReset();
      }
    }, videoTime * 10);
  }
  videoReset();

  const visualControlLi = document.querySelectorAll(".visual-control > li");
  visualControlLi.forEach((item, index) => {
    item.addEventListener("click", function () {
      videoIndex = index;
      swVisual.slideTo(videoIndex);
    });
  });
};
