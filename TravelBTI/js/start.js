const main = document.querySelector("#main");
const qna = document.querySelector("#qna");
const result = document.querySelector("#result");

const endPoint = 9; // 질문이 끝나는 시점(질문개수)
const select = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 선택에 따른 결과값 저장을 위한 빈 배열 생성

// 선택값을 연산하는 알고리즘
function calcResult() {
    console.log(select);
    var result = select.indexOf(Math.max(...select));
    // select 배열 내에서 최대값을 가진 index 반환
    return result;
}

function seeResult() {
    let point = calcResult();
    qna.style.WebkitAnimation = "fadeOut 1s";
    qna.style.animation = "fadeOut 1s";
    location.href="./page/result-" + point + ".html";
}


function addAnswer(anwerText, qIdx, idx) {
    var a = document.querySelector('.answerBox');
    var answer = document.createElement('button');
    answer.classList.add('answerList');
    answer.classList.add('my-3');
    answer.classList.add('py-3');
    answer.classList.add('mx-auto');
    answer.classList.add('fadeIn');
    a.appendChild(answer);
    answer.innerHTML = anwerText;

    // 답을 클릭했을 때
    answer.addEventListener("click", function () {
        var children = document.querySelectorAll('.answerList');
        for (let i = 0; i < children.length; i++) {
            children[i].disabled = true;
            children[i].style.WebkitAnimation = "fadeOut 0.5s";
            children[i].style.animation = "fadeOut 0.5s";
        }
        setTimeout(() => {
            var target = qnaList[qIdx].a[idx].type; // qIdx번째 질문의 답 a배열의 idx번째의 type
            for (let i = 0; i < target.length; i++) {
                select[target[i]] += 1;
            }

            for (let i = 0; i < children.length; i++) {
                children[i].style.display = 'none';
            }
            goNext(++qIdx);
        }, 450)
    }, false);
}


// 다음 질문으로 넘어가는 함수
function goNext(qIdx) {
    if (qIdx === endPoint) { // 질문이 다 끝났을 때
        seeResult();
        return;
    }

    var q = document.querySelector('.qBox');
    q.innerHTML = qnaList[qIdx].q;
    for (let i in qnaList[qIdx].a) {
        addAnswer(qnaList[qIdx].a[i].answer, qIdx, i);
    }
    // i번째 질문의 답을 얻기 위해 i를 파라미터로 

    var status = document.querySelector('.statusBar');
    status.style.width = (100 / endPoint) * (qIdx + 1) + '%'; // 진행상태바 
}


// 첫화면에서 질문창으로 넘어가는 함수
function begin() {
    main.style.WebkitAnimation = "fadeOut 1s";
    main.style.animation = "fadeOut 1s";

    setTimeout(() => {
        qna.style.WebkitAnimation = "fadeIn 1s";
        qna.style.animation = "fadeIn 1s";
        setTimeout(() => {
            main.style.display = "none";
            qna.style.display = "block";
        }, 450)
        let qIdx = 0;
        goNext(qIdx);
    }, 450);
};