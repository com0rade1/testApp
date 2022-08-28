const express = require("express")
const app = express()
const fs = require("fs")
const bodyParser = require("body-parser")
const urlencodedParser = bodyParser.urlencoded({extended:false})
global.users = []
global.teacherLogIn = false
global.studentLogIn = false
global.students = []
global.theory = [] // theoryTheme, theoryText
global.test = []
global.tasks = []
fs.readFile("users.txt", function(error,data){
    if (error) throw error // ошибка, если таковая возникла
    let tempUsers = data.toString().split("\r") // разбиваем файл с пользователями на массив
    let tempUser = [] // создаем временную переменную
    for (let i in tempUsers) {
        tempUser= tempUsers[i].split("||") // создаем пару Имя:Пароль
        global.users[i] = {
            userName: tempUser[0],
            userPassword: tempUser[1]
        } 
    } // записываем данные в Массив
})
fs.readFile("students.txt",function(error,data){
    if (error) throw error // ошибка, если таковая возникла
    let tempUsers = data.toString().split("\r") // разбиваем файл с пользователями на массив
    let tempUser = [] // создаем временную переменную
    for (let i in tempUsers) {
        tempUser= tempUsers[i].split(" || ") // создаем пару Имя:Пароль
        global.students[i] = {
            userName: tempUser[0],
            userPassword: tempUser[1]
        } 
    } // записываем данные в Массив
})
function checkTasksUpdates(){
    global.tasks=[]
    fs.readFile("tasks.txt",function(error,data){
        if (error) throw error
        let tempData = data.toString().split(" || ")
        for (let i = 0; i<tempData.length;i++) {
            tasks[i] = {
                taskWording: tempData[i].split(" ||| ")[0],
                taskCode: tempData[i].split(" ||| ")[1]
            }
        }
    })
}
checkTasksUpdates()
function checkTheoryUpdates(){
    theory=[]
    fs.readFile("theory.txt",function(error,data){
        if (error) throw error
        let tempData = data.toString().split(" || ")
        for (let i = 0; i<tempData.length;i++) {
            theory[i] = {
                theoryTheme: tempData[i].split(" ||| ")[0],
                theoryText: tempData[i].split(" ||| ")[1]
            }
        }
    })
}
checkTheoryUpdates()
function checkQuestionsUpdates(){
    test = []
    fs.readFile("questions.txt",function(error,data){
        if (error) throw error
        let tempData = data.toString().split("\n")
        let tempQuestionData = []
        let tempAnswerData = []
        let tempCorrectAnswerData = []
        for(let i = 0; i<tempData.length;i++){
            if (tempData[i].length)
            {
                test[i] = {}
                tempQuestionData = tempData[i].split(" ||| ")
                test[i]["question"] = tempQuestionData[0]
                tempAnswerData = tempQuestionData[1].split(" || ")
                for(let j = 0;j<tempAnswerData.length;j++) {
                    test[i]["Answer_"+j]={
                        answerText: tempAnswerData[j].split(" : ")[0],
                        isCorrectAnswer: tempAnswerData[j].split(" : ")[1]
                    }
                }
            }
        }
    
    })
}
checkQuestionsUpdates()
app.get("/mainPage", function(req,res){
    let message = ""
    message +=`
    <style type="text/css">
    body{
        display: grid;
        align-content: center;
        text-align: center;
    }
    div {
        align-content: center;
    font-family: arial;
    font-size: 16px;
    border-radius: 10px;
    border-style: groove;
    background-image: radial-gradient(#d464f1, #76257be8);
    color: #fff700;
    font-weight: 600;
    }
    </style>
    <div>
    <p id = "Hello" style="text-align: center"><h3>Привет, Вы пытаетесь войти в систему бота!</h3></p>
    <p id = "Desc" style="text-align: center">Определите, в качестве кого Вы хотите войти в систему и сделайте правильный выбор!</p>
    <p id = "TeacherForm" style="text-align: center"><form action="/teacherLogin" method = "get"><input type="submit" value="Войти в качестве педагога"></input></form></p>
    <p id = "StudentForm" style="text-align: center"><form action="/studentLogIn" method = "get"><input type="submit" value="Войти в качестве ученика"></input></form></p>
    </div>
    `
    res.send(message)
})
//Учитель
app.get("/teacherLogin", function(req,res){
    let message=""
    if(!global.teacherLogIn) {
        message +=`
        <style type="text/css">
        body{
            align-content: center;
            text-align: center;
            display: grid;
        }
        div {
            font-family: arial;
            font-size: medium;
            border-radius: 10px;
            border-style: groove;
            background-image: radial-gradient(#efafd5, #9c487a);
            color: #fff704;
            font-weight: 600;
        }
        </style>
        <div>
        <h3>Авторизация</h3>
        <form action="/teacherMenu" method="post" style="text-align:center">
        <p>
        <label>Введите Ваши ФИО:</label><input type="text" name="userName"></input><br><br>
        <label>Введите Ваш персональный пароль:</label><input type="password" name="userPassword"></input><br><br>
        <input type="submit" value="Войти">
        </p>
        </form>
        <p><form action="/mainPage" method="get"><input type="submit" value="На главную"></form></p>
        </div>
        `   
        res.send(message)
    } else 
    {
    res.redirect("/teacherMenu")
    }

})
app.post("/teacherMenu", urlencodedParser,function(req,res){
    if(!req.body) return res.sendStatus(400)
    //console.log(req.body)
    let userName = !global.teacherLogIn ? req.body.userName : ""
    let userPassword = !global.teacherLogIn ? req.body.userPassword : ""
    let message = ""
    let index = global.users.findIndex(el => el.userName === userName);
    let flag = global.users[index].userPassword === userPassword ? true:false
        if (index !=-1 || global.teacherLogIn) {
            if (flag) {
                message+=`
                <style type="text/css">
                body {
                    align-content: center;
                    align-items: center;
                    text-align: center;
                    display: grid;
                }
                div {
                    align-content: center;
                    align-items: center;
                    text-align: center;
                    font-family: arial;
                    font-size: medium;
                    font-weight: 600;
                    border-radius: 10px;
                    border-style: groove;
                    background-image: radial-gradient(#fad, #560161);
                    color: #efff00;
                }
                </style>
                <div><h3>Терминал педагога</h3>
                <form action = "/addTheory" method = "get">
                <input type="submit" value="Добавить кусок теории">
                </form>
                <form action = "/addQuestion" method = "get">
                <input type="submit" value = "Добавить вопрос к тесту">
                </form>
                <form action = "/addTask" method = "get">
                <input type="submit" value = "Добавить задачу по теме">
                </form>
                <p><form action="/mainPage" method="get"><input type="submit" value="На главную"></form></p>
                </div>`
                global.teacherLogIn = true
            } else message+='Пароль неверен!'
        }
        else message+="Введенное имя пользователя не найдено в системе!"
        res.send(message)
})
app.get("/teacherMenu", function(req,res){
    let message = ""
    if (teacherLogIn) {
        message+=`
    <style type="text/css">
    body{
        align-content: center;
        align-items: center;
        text-align: center;
        display: grid;
    }
    div {
        align-content: center;
        align-items: center;
        text-align: center;
        font-family: arial;
        font-size: medium;
        font-weight: 600;
        border-radius: 10px;
        border-style: groove;
        background-image: radial-gradient(#fad, #560161);
        color: #efff00;
    }
    </style>
    <div><h3>Терминал педагога</h3>
    <form action = "/addTheory" method = "get">
    <input type="submit" value="Добавить кусок теории">
    </form>
    <form action = "/addQuestion" method = "get">
    <input type="submit" value = "Добавить вопрос к тесту">
    </form>
    <form action = "/addTask" method = "get">
    <input type="submit" value = "Добавить задачу по теме">
    </form>
    <p><form action="/mainPage" method="get"><input type="submit" value="На главную"></form></p>
    </div>`
    } else message += `Чтобы выполнить это действие необходимо авторизоваться в системе в качестве педагога!`
    res.send(message)
})
app.get("/addTheory",function(req,res) {
    message = ""
    if (global.teacherLogIn) {
        message+=`
        <style type="text/css">
    body{
        align-content: center;
        align-items: center;
        text-align: center;
        display: grid;
    }
    div {
        align-content: center;
        align-items: center;
        text-align: center;
        font-family: arial;
        font-size: medium;
        font-weight: 600;
        border-radius: 10px;
        border-style: groove;
        background-image: radial-gradient(#fad, #560161);
        color: #efff00;
    }
    </style>
        <div><h3>Добавление теоретического материала</h3>
        <form action="/theoryAdded" method="post">
        <label>Укажите тему добавляемого теоретического материала: </label><input type="text" name = "theoryTheme"></input><br><br>
        <label>Вставьте кусок теории сюда или напишите его здесь: </label><textarea name = "theoryText"></textarea><br><br>
        <input type = "submit" value = "Добавить теоретичский материал">
        </form>
        <p><form action="/mainPage" method="get"><input type="submit" value="На главную"></form></p>
        <p><form action="/teacherMenu" method="get"><input type="submit" value="В терминал педагога"></form></p>
        </div>`
    } else message +="Для того, чтобы выполнить это действие, необходимо авторизоваться в качестве педагога"
    res.send(message)
})
app.get("/addQuestion", function(req,res){
    message = ""
    if (global.teacherLogIn){
        message+=`
        <style type="text/css">
    body{
        align-content: center;
        align-items: center;
        text-align: center;
        display: grid;
    }
    div {
        align-content: center;
        align-items: center;
        text-align: center;
        font-family: arial;
        font-size: medium;
        font-weight: 600;
        border-radius: 10px;
        border-style: groove;
        background-image: radial-gradient(#fad, #560161);
        color: #efff00;
    }
    </style>
    <div>
        <h2>Добавление вопроса</h2>
        <p>Укажите количество вариантов ответа, введите их, а также отметьте верные варианты галочкой</p>
        <form action = "/questionAdded" method = "post">
        <p>Введите формулировку вопроса: <input type="text" name = "question" id = "question"></input></p>
        <p>Укажите количество ответов, которое будет внесено в тест: <input type="number" name = "count" id = "count"></input></p>
        <input type = "button" value="Отобразить" id = "print">
        <div id = "answersTable"></div>
        <input type = "submit" value = "Отправить">
        </form>
        <script>
        let count = document.getElementById("count")
        let div = document.getElementById("answersTable")
        let button = document.getElementById("print")
        button.onclick = function() {
            div.innerHTML = ''
            for (let i = 0; i < count.value;i++)
            {
                div.innerHTML+='<p><input class = \"checkers\" type = \"checkbox\" name = \"checker_' +  i + '\"><input type = \"text\" name = \"value_' + i + '\"></input><input type="hidden" id = \"hidVal_' + i + '\" name = \"hidVal_' + i + '\" value = "false"></input></input></p>'
            }
            let checkers = document.getElementsByClassName("checkers")
            for (let i=0;i<checkers.length;i++) {
                checkers[i].addEventListener('change',function(){
                    let element = "hidVal_" + i
                    if(this.checked) document.getElementById(element).value="true"
                    else document.getElementById(element).value="false"
                })
            }
        }
        
        </script>
        <p><form action="/mainPage" method="get"><input type="submit" value="На главную"></form></p>
        <p><form action="/teacherMenu" method="get"><input type="submit" value="В терминал педагога"></form></p>
        </div>`
    } else message+="Для того, чтобы выполнить это действие, необходимо авторизоваться в системе в качестве педагога."
    res.send(message)
    
})
app.get("/addTask",function(req,res) {
    message = ""
    if (global.teacherLogIn) {
        message+=`
        <style type="text/css">
    body{
        align-content: center;
        align-items: center;
        text-align: center;
        display: grid;
    }
    div {
        align-content: center;
        align-items: center;
        text-align: center;
        font-family: arial;
        font-size: medium;
        font-weight: 600;
        border-radius: 10px;
        border-style: groove;
        background-image: radial-gradient(#fad, #560161);
        color: #efff00;
    }
    </style>
        <div><h3>Добавление теоретического материала</h3>
        <form action="/taskAdded" method="post">
        <label>Укажите формулировку задачи: </label><input type="text" name = "taskWording"></input><br><br>
        <label>Укажите решение задачи: </label><textarea name = "taskCode"></textarea><br><br>
        <input type = "submit" value = "Добавить задачу">
        </form>
        </div>
        <p><form action="/mainPage" method="get"><input type="submit" value="На главную"></form></p>
        <p><form action="/teacherMenu" method="get"><input type="submit" value="В терминал педагога"></form></p>`
    } else message +="Для того, чтобы выполнить это действие, необходимо авторизоваться в качестве педагога"
    res.send(message)
})

app.post("/questionAdded",urlencodedParser,function(req,res) {
    message = ""
    if (!req.body) return res.sendStatus(400)
    fs.appendFileSync("questions.txt",`${req.body.question} ||| `)
    for (let i = 0; i < req.body.count;i++)
    {
        command1 = 'req.body.value_' + i
        command2 = 'req.body.hidVal_' + i
        sep = i == req.body.count-1 ? '' : ' || '
        fs.appendFileSync("questions.txt", eval(command1) + ' : ' + eval(command2) + sep)
    }
    fs.appendFileSync("questions.txt", "\n")
    message+= `
    <p> Вопрос успешно внесён в базу вопросов</p>
    <p><form action="/addQuestion" method ="get"><input type="submit" value = "Добавить следующий вопрос"></input></form></p>
    <p><form action="/mainPage" method = "get"><input type="submit" value = "На главную"></input></form></p>
    <p><form action="/teacherMenu" method="get"><input type="submit" value="В терминал педагога"></form></p>
    `
    checkQuestionsUpdates()
    res.send(message)
})
app.post("/theoryAdded",urlencodedParser,function(req,res){
    message = ""
    if (!req.body) return res.sendStatus(400)
    fs.appendFileSync("theory.txt", `${req.body.theoryTheme} ||| ${req.body.theoryText} || `)
    message += `
    <p>Теоретический материал успешно внесён!</p>
    <p><form action="/addQuestion" method ="get"><input type="submit" value = "Добавить следующий вопрос"></input></form></p>
    <p><form action="/mainPage" method = "get"><input type="submit" value = "На главную"></input></form></p>
    <p><form action="/teacherMenu" method="get"><input type="submit" value="В терминал педагога"></form></p>
    `
    checkTheoryUpdates()
    res.send(message)
})
app.post("/taskAdded",urlencodedParser,function(req,res){
    message = ""
    if (!req.body) return res.sendStatus(400)
    fs.appendFileSync("tasks.txt", `${req.body.taskWording} ||| ${req.body.taskCode} || `)
    message += `
    <p>Задача успешно внесена в систему!</p>
    <p><form action="/addQuestion" method ="get"><input type="submit" value = "Добавить следующий вопрос"></input></form></p>
    <p><form action="/mainPage" method = "get"><input type="submit" value = "На главную"></input></form></p>
    <p><form action="/teacherMenu" method="get"><input type="submit" value="В терминал педагога"></form></p>
    `
    checkTasksUpdates()
    res.send(message)
})
//Ученик
app.get("/studentLogIn",function(req,res){
    message = ""
    if(!global.teacherLogIn && !global.studentLogIn){
    message += `
    <style type="text/css">
    body{
        align-content: center;
        align-items: center;
        text-align: center;
        display: grid;
    }
    div {
        align-content: center;
        align-items: center;
        text-align: center;
        font-family: arial;
        font-size: medium;
        font-weight: 600;
        border-radius: 10px;
        border-style: groove;
        background-image: radial-gradient(#fad, #560161);
        color: #efff00;
    }
    </style>
    <div>
    <h2>Авторизация ученика</h2>
    <form action = "/studentMenu" method="post">
    <p><label>Введите имя:</label><input type="text" name="userName"></input></p>
    <p><label>Введите пароль:</label><input type="password" name="userPassword"></input></p>
    <p><input type = "submit" value = "Авторизоваться"></p>
    </form>
    </div>
    <p><form action="/mainPage" method = "get"><input type="submit" value = "На главную"></input></form></p>
    `
    res.send(message)
    } else {
        res.redirect("/studentMenu")
    }

})
app.post("/studentMenu",urlencodedParser,function(req,res){
    message=""
    if(!req.body) return res.sendStatus(400)
    let userName = !global.teacherLogIn || !global.studentLogIn ? req.body.userName : ""
    let userPassword = !global.teacherLogIn || !global.studentLogIn ? req.body.userPassword : ""
    let index = global.students.findIndex(el => el.userName === userName);
    let flag = global.students[index].userPassword === userPassword ? true:false
        if (index !=-1 || global.teacherLogIn || global.studentLogIn) {
            if (flag) {
                message+=`
                <style type="text/css">
                body{
                    align-content: center;
                    align-items: center;
                    text-align: center;
                    display: grid;
                }
                div {
                    align-content: center;
                    align-items: center;
                    text-align: center;
                    font-family: arial;
                    font-size: medium;
                    font-weight: 600;
                    border-radius: 10px;
                    border-style: groove;
                    background-image: radial-gradient(#fad, #560161);
                    color: #efff00;
                }
                </style>
                <div>
                <h3>Меню</h3>
                <form action = "/readTheory" method = "get">
                <input type="submit" value="Читать имеющуюся теорию">
                </form>
                <form action = "/completeTest" method = "get">
                <input type="submit" value = "Пройти тест">
                </form>
                <form action = "/tasksView" method = "get">
                <input type="submit" value = "Рассмотреть задачи">
                </form>
                </div>
                <p><form action="/mainPage" method = "get"><input type="submit" value = "На главную"></input></form></p>
                `
                global.studentLogIn = true
            }
           else message+="Пароль неверен!"
        }
        else message+="Введенное имя пользователя не найдено в системе!"
        res.send(message)

})
app.get("/studentMenu",function(req,res){
    message = ""
    if (studentLogIn || teacherLogIn) {
        message += `
    <style type="text/css">
    body{
        align-content: center;
        align-items: center;
        text-align: center;
        display: grid;
    }
    div {
        align-content: center;
        align-items: center;
        text-align: center;
        font-family: arial;
        font-size: medium;
        font-weight: 600;
        border-radius: 10px;
        border-style: groove;
        background-image: radial-gradient(#fad, #560161);
        color: #efff00;
    }
    </style>
    <div>
    <h3>Меню</h3>
        <form action = "/readTheory" method = "get">
        <input type="submit" value="Читать имеющуюся теорию">
        </form>
        <form action = "/completeTest" method = "get">
        <input type="submit" value = "Пройти тест">
        </form>
        <form action = "/tasksView" method = "get">
        <input type="submit" value = "Рассмотреть задачи">
        </form>
    </div>
    <p><form action="/mainPage" method = "get"><input type="submit" value = "На главную"></input></form></p>
    `
    } else message += `<p>Чтобы выполнить это действие необходимо авторизоваться!</p>`
    res.send(message)
})
app.get("/readTheory",function(req,res){
    message = ""
    if (studentLogIn || teacherLogIn) {
        message+=`
    <style type="text/css">
    A:link { 
     text-decoration: none;
    } 
    A:visited { text-decoration: none; } 
    A:active { text-decoration: none; }
    A:hover {
     text-decoration: underline;
     color: red; 
    transition: all ease 1s
    } 
    body {
        display: grid;
        align-content: center;
        text-align: center;
    }
    div{
        margin-block: auto;
        border-radius: 10px;
        border-style: groove;
        padding: 10px;
        margin-top: 10px;
        width: auto;
        background-color: #731a8ab8;
        font-family: arial;
        font-size: 14px;
        font-weight: bold;
        color: #faff00;
        text-align:justify; 
    }
   </style>
    `
    for (let i = 0; i<global.theory.length-1;i++) {
        message +=`
        <div>
        <a id="link_${i}" style="text-decoration:none; margin: 0 auto;"><h2 id="link_${i}_${i}"></h2></a><script>document.getElementById("link_${i}_${i}").innerText = \`${global.theory[i].theoryTheme}\`</script>
        <p id="plink_${i}" style="display:block; visibility: hidden; position: fixed;opacity:0%; transition: all ease 1s; margin: 0 auto;"></p><script>document.getElementById("plink_${i}").innerText = \`${global.theory[i].theoryText}\`</script>
        </div>
        `
    }
    message+=`
    <div id="buttons" style="margin: 0 auto">
    <form action="/mainPage" method="get" style="display: table-cell"><input type="submit" value = "На главную"></input></form>
    <form action="/completeTest" method="get" style="display: table-cell"><input type ="submit" value="К тестам"></input></form>
    <form action="/tasksView" method="get" style="display: table-cell"><input type="submit" value="К задачам"></input></form>
    <form action="/studentMenu" method="get" style="display: table-cell"><input type="submit" value = "В меню"></input></form>
    </div>
    <script> for(let i = 0; i < ${global.theory.length-1};i++){
        let docLink = "link_"+i
        let docPlink = "plink_"+i
        let flag = false
        document.getElementById(docLink).addEventListener("click",function(){
            if (!flag){
                flag = true
                document.getElementById(docPlink).style.transition= "all ease 1s"
                document.getElementById(docPlink).style.position="relative"
                document.getElementById(docPlink).style.visibility="visible"
                document.getElementById(docPlink).style.opacity="100%"
            } else {
                document.getElementById(docPlink).style.transition= ""
                document.getElementById(docPlink).style.visibility="hidden"
                document.getElementById(docPlink).style.position="fixed"
                document.getElementById(docPlink).style.opacity="0%"
                flag = false 
            }
        })
    }
    </script>
    `
    } else message+=`<p>Чтобы выполнить это действие необходимо авторизоваться!</p>`
    res.send(message)
})
app.get("/tasksView",function(req,res){
    message = ""
    if (teacherLogIn || studentLogIn) {
        message+=`
    <style type="text/css">
    A:link { 
     text-decoration: none;
    } 
    A:visited { text-decoration: none; } 
    A:active { text-decoration: none; }
    A:hover {
     text-decoration: underline;
     color: red; 
    transition: all ease 1s
    } 
    body {
        display: grid;
        align-content: center;
        text-align: center;
    }
    div{
        margin-block: auto;
        border-radius: 10px;
        border-style: groove;
        text-align: justify;
        padding: 10px;
        margin-top: 10px;
        width: auto;
        background-color: #731a8ab8;
        font-family: arial;
        font-size: 14px;
        font-weight: bold;
        color: #faff00;
    }
   </style>
    `
    for (let i = 0; i<global.tasks.length-1;i++) {
        message +=`
        <div>
        <a id="link_${i}" style="text-decoration:none; margin: 0 auto;"><h2 id="link_${i}_${i}"></h2></a><script>document.getElementById("link_${i}_${i}").innerText = \`${global.tasks[i].taskWording}\`</script>
        <p id="plink_${i}" style="display:block; visibility: hidden; position: fixed;opacity:0%; transition: all ease 1s; margin: 0 auto;"></p><script>document.getElementById("plink_${i}").innerText = \`${global.tasks[i].taskCode}\`</script>
        </div>
        `
    }
    message+=`
    <div id="buttons" style="margin: 0 auto">
    <form action="/mainPage" method="get" style="display: table-cell"><input type="submit" value = "На главную"></input></form>
    <form action="/completeTest" method="get" style="display: table-cell"><input type ="submit" value="К тестам"></input></form>
    <form action="/readTheory" method="get" style="display: table-cell"><input type="submit" value="К теории"></input></form>
    <form action="/studentMenu" method="get" style="display: table-cell"><input type="submit" value = "В меню"></input></form>
    </div>
    <script> for(let i = 0; i < ${global.tasks.length-1};i++){
        let docLink = "link_"+i
        let docPlink = "plink_"+i
        let flag = false
        document.getElementById(docLink).addEventListener("click",function(){
            if (!flag){
                flag = true
                document.getElementById(docPlink).style.transition= "all ease 1s"
                document.getElementById(docPlink).style.position="relative"
                document.getElementById(docPlink).style.visibility="visible"
                document.getElementById(docPlink).style.opacity="100%"
            } else {
                document.getElementById(docPlink).style.transition= ""
                document.getElementById(docPlink).style.visibility="hidden"
                document.getElementById(docPlink).style.position="fixed"
                document.getElementById(docPlink).style.opacity="0%"
                flag = false 
            }
        })
    }
    </script>
    `
    } else message += `<p>Чтобы выполнить это действие необходимо авторизоваться!</p>`
    res.send(message)
})

app.get("/completeTest", function(req,res){
    message = ""
    if (teacherLogIn || studentLogIn) {
        message += `
        <style type="text/css">
        .question {
            background-color: #34064e;
            color: #ffff00;
            margin: 10px auto;
            width: auto;
            height: fit-content;
            display: block;
            vertical-align: middle;
            padding: 10px;
            border: 3px;
            border-radius: 10px;
            font-family: arial;
            font-size: medium;
            font-weight: bold;
            border-color: #a882bd;
            border-style: groove;
        }
        </style>
        `
        let k = 0
        for (let i = 0; i<test.length; i++) {
            message += `
            <div class = "question" id = "question_${i}">
            <p id = "pMessage_${i}"></p><script>document.getElementById("pMessage_${i}").innerText = \`${test[i].question}\`</script>
            `
            for(let answer in test[i]) {
            if (answer != "question"){
                message+=`
            <p><input type = "checkbox" class="${i}" name="${test[i][answer].isCorrectAnswer}" value="" id="p_${k}">${test[i][answer].answerText}</p>
            `
            }
            k++
            }
            message += `<div id="CheckAnswer_${i}"></div>
            <p><input id="button_${i}" type = "submit" value = "Проверить"></p></div>
            <script>
            document.getElementById("button_${i}").onclick = function() {
                let flag = false
                let canICheck = true
                let answers = document.getElementsByTagName("input")
                for (let i = 0;i<answers.length;i++) {
                    if(answers[i].getAttribute('class') == "${i}" && canICheck){
                        if (answers[i].name == "true") {
                            if (answers[i].checked) {
                                flag=true
                            } else {
                                flag = false;
                                canICheck = false
                            }
                        } else {
                            if (answers[i].checked) {
                                flag = false
                                canICheck = false
                            }
                        }
                    }
                    }
                    if (flag){
                        document.getElementById("CheckAnswer_${i}").innerHTML = "Верно!"
                    } else document.getElementById("CheckAnswer_${i}").innerHTML = "Неверно! Подумайте ещё!"
                    
                }
            </script>`
        }
        message+=`    <div id="buttons" style="margin: 0 auto">
        <form action="/mainPage" method="get" style="display: table-cell"><input type="submit" value = "На главную"></input></form>
        <form action="/completeTest" method="get" style="display: table-cell"><input type ="submit" value="К тестам"></input></form>
        <form action="/readTheory" method="get" style="display: table-cell"><input type="submit" value="К теории"></input></form>
        <form action="/studentMenu" method="get" style="display: table-cell"><input type="submit" value = "В меню"></input></form>
        </div>`
    } else message+=`<p> Чтобы выполнить это действие, необходимо авторизоваться!`
    
    res.send(message)
})

app.listen("3000")