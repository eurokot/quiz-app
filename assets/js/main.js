const log = console.log;

const start_btn = document.querySelector('.start_btn button');
const info_box = document.querySelector('.info_box');
const exit_btn = info_box.querySelector('.buttons .quit');
const continue_btn = info_box.querySelector('.buttons .restart');
const quiz_box = document.querySelector('.quiz_box');
const next_btn = quiz_box.querySelector('.next_btn');
const bottom_ques_counter = quiz_box.querySelector('.total_que');
const options_list = document.querySelector('.option_list');
const timeCount = quiz_box.querySelector('.timer .timer_sec');
const timeLine = quiz_box.querySelector('header .time_line');
const timeOff = quiz_box.querySelector('header .time_text');
const result_box = document.querySelector('.result_box');
const restart_quiz = result_box.querySelector('.buttons .restart');
const quit_quiz = result_box.querySelector('.buttons .quit');
let counter;
let counterLine;
let timeValue = 15;
let widthValue = 0;
let que_count = 0;
let userScore = 0;
let tickIcon = `<div class="icon tick"><i class="fas fa-check"></i></div>`;
let crossIcon = `<div class="icon cross"><i class="fas fa-times"></i></div>`;


//If Start Quiz Button clicked
start_btn.onclick = () => {
    info_box.classList.add('activeInfo'); 
}

//If Exit Button clicked
exit_btn.onclick = () => {
    info_box.classList.remove('activeInfo');
}

//If Continue Button clicked
continue_btn.onclick = () => {
    info_box.classList.remove('activeInfo');
    quiz_box.classList.add('activeQuiz');
    showQuestions(0);
    startTimer(15);
    startTimerLine(0);
} 

//If Next Button clicked
next_btn.onclick = () => {
    if(que_count < questions.length - 1) {
        que_count++;
        showQuestions(que_count);
        clearInterval(counter);
        startTimer(timeValue);
        clearInterval(counterLine);
        startTimerLine(widthValue);
        next_btn.style.display = "none";
        timeOff.textContent = "Time Left";
    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        showResultBox();
    }
}

restart_quiz.onclick = () => {
    quiz_box.classList.add('activeQuiz');
    result_box.classList.remove('activeResult');

    userScore = 0;
    que_count = 0;
    widthValue = 0;
    timeValue = 15;

    clearInterval(counter);
    startTimer(timeValue);
    clearInterval(counterLine);
    startTimerLine(widthValue);

    showQuestions(que_count);
    next_btn.style.display = "none";
    // timeOff.textContent = "Time Left";
}

quit_quiz.onclick = () => {
    window.location.reload();
}

//getting question and options from array
function showQuestions(index) {
    const que_text = document.querySelector('.que_text');

    let que_tag = `<span>${questions[index].id}. ${questions[index].que}</span>`;
    let totalQuesCountTag = `<span><p>${questions[index].id}</p>of<p>${questions.length}</p>Question</span>`;

    options_list.innerHTML = "";
    questions[index].options.forEach(e => {
        return options_list.innerHTML += `
            <div class="option">
                <span>${e}</span>
            </div>
        `; 
    });

    que_text.innerHTML = que_tag;
    bottom_ques_counter.innerHTML = totalQuesCountTag;

    const option = options_list.querySelectorAll('.option');
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute('onclick', 'optionSelected(this)');
    }
}

function optionSelected(answer) {
    clearInterval(counter);
    clearInterval(counterLine);
    let userAns = answer.textContent.trim();
    let correctAns = questions[que_count].answer;
    let allOptions = options_list.children.length;
    if(userAns == correctAns) {
        userScore += 1;
        answer.classList.add('correct');
        answer.insertAdjacentHTML("beforeend", tickIcon);
    } else {
        answer.classList.add('incorrect');
        answer.insertAdjacentHTML("beforeend", crossIcon);
        //if answers is incorrect then automatically selected the correct answer
        for (let i = 0; i < allOptions; i++) {
            if(options_list.children[i].textContent.trim() == correctAns) {
                options_list.children[i].setAttribute('class', 'option correct');
                options_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
            }
        }
        
    }

    //once user selected disable all options
    for (let i = 0; i < allOptions; i++) {
        options_list.children[i].classList.add('disabled');
    }

    next_btn.style.display = "block";
}

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if(time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if(time < 0) {
            clearInterval(counter);
            timeCount.textContent = "00";
            timeOff.textContent = "Time Off";

            let correctAns = questions[que_count].answer;
            let allOptions = options_list.children.length;

            for (let i = 0; i < allOptions; i++) {
                if(options_list.children[i].textContent.trim() == correctAns) {
                    options_list.children[i].setAttribute('class', 'option correct');
                    options_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
                }
            }

            for (let i = 0; i < allOptions; i++) {
                options_list.children[i].classList.add('disabled');
            }
        
            next_btn.style.display = "block";
        }
    }
}

function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1;
        timeLine.style.width = time + 'px';
        if(time > 549) {
            clearInterval(counterLine);
        }
    }
}

function showResultBox() {
    info_box.classList.remove('activeInfo');
    quiz_box.classList.remove('activeQuiz');
    result_box.classList.add('activeResult');
    const scoreText = result_box.querySelector('.score_text');
    if(userScore > 3) {
        let scoreTag = `<span>and congrats! You got <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
        scoreText.innerHTML = scoreTag;
    } else if (userScore > 1){
        let scoreTag = `<span>and nice, You got only <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
        scoreText.innerHTML = scoreTag;
    } else {
        let scoreTag = `<span>and sorry, You got only <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
        scoreText.innerHTML = scoreTag;
    }
}