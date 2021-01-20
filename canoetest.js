/*
1). Given a SQL database with the following table full of data
Please write the SQL statement to show the top 3 average government debts in percent of the gdp_per_capita
(govt_debt / gdp_per_capita) for those countries of which gdp_per_capita was over 40,000 dollars in every year in
the last four years.
*/

SELECT code, year, gdp_per_capita, avg(govt_debt) as avgDebt
FROM countries
WHERE year > 2016
GROUP BY code
Having MIN(gdp_per_capita > 40000)
ORDER BY avgDebt DESC //assuming top means most debt
LIMIT 3

/*
2) OOP general programming

  He can open and close his mouth as he wishes.
  ● Nobody can force a man to open/close his mouth.
  ● A doctor can ask a man to open/close his mouth and a man will do so.
  ● He refuses anyone else who asks him to open/close his mouth other than doctors
*/
function Man(setName){
  let name = setName
  let mouth = 'closed'
  return{
    open:function(person,doctor = false){
      person = person.toLowerCase()
      if(person===name || doctor){
        mouth = 'opened'
      }
      return mouth
    },
    close:function(person,doctor = false){
      person = person.toLowerCase()
      if(person === name ||doctor){
        mouth = 'closed'
      }
      return mouth
    }
  }
}

let john = new Man('john')
console.log(john.mouth)//returns undefined(not in scope)
console.log(john.open('john'))//returns 'open'
console.log(john.close('Andy')) //returns 'open'
console.log(john.close('Lauren',true)) //returns 'closed'
console.log(john.open('Lauren',true)) //returns 'open'

/*
3) Web Form Submission and Handling
  In a form, we have three input boxes for users to type in their choices of courses and submit the form without
  refreshing the page(i.e using ajax request). Here are the requirements:
  1. User can type in 1, 2 or 3 courses
  2. Each choice is case insensitive (also, user can type anything, in any case or leave it empty)
  3. The choices have to contain “calculus”(in any case, e.g “Calculus” or “CALCULUS”) in one input box.
  4. Frontend code should make sure the choices contain “calculus”.
  5. Backend code on the server side needs to have the same validation as in frontend to make sure data is
  consistent.


/*        FRONTEND CODE
   I'll be using react as a framework, and will be writing out the handleSubmit function with the following assumptions:
   1)I like using the axios wrapper for to make requests, so I'd like to import that library
   2)There's state values for choice1, choice2 and choice3 present on the component, all written like the following:
    const [choice1,setChoice1] = useState('')
   3)There's a property identifying this specific user (I would like to assume that I can access it in props as props.user.id)
*/

async function handleSubmit(event){
  event.preventDefault()
  const choices = [choice1,choice2,choice3]
  let calcPresent = false
  choices = choices.map((curChoice)=>{
    curChoice = curChoice.toLowerCase()
    if(curChoice==='calculus')calcPresent = true
  })
  if(!calcPresent) return 'You must have one choice present be calculus'
  try {
    await axios.post('/choicesRoute',{
      userId:props.user.id,
      choices:choices
    })
  } catch (error) {
    console.error(error)
  }
}

/*        BACKEND CODE
   I'll be using Node/Express as a framework, and submitting data to a Postgres server, using Sequelize as an ORM
*/
//The Sequelize schema would look like the following:

module.exports = db.define('studentChoices', {
  studentId:{
    type:Sequelize.STRING,
    allowNull:false
  },
  choice1:{
    type:Sequelize.STRING,
  },
  choice2:{
    type:Sequelize.STRING,
  },
  choice3:{
    type:Sequelize.STRING,
  },
})

//And the express route would look like the following:

router.post('/choices', async (req,res,next) =>{
  let receivedChoices = req.body.choices
  let calcFlag = false
  for(let choice of receivedChoices){
    choice = choice.toLowerCase()
    if(choice ==='calculus')calcFlag=true
  }
  if(!calcFlag)res.status(400).send('user must have calculus as one of their choices')
  try {
    const returnChoices = await students.create({
      studentId:req.body.userId,
      choice1:req.body.choices[0],
      choice2:req.body.choices[1],
      choice3:req.body.choices[2],
    })
    res.status(201).json(returnChoices)
  } catch (error) {
    console.error(error)
    res.json(error)
  }
})
