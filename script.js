//add is remove tha classList 
function addToogle(){
    document.querySelector(".modal-overley")
          .classList.toggle("active")

}

const storage ={
    get(){
        return JSON.parse(localStorage.getItem('maratona')) || []
    },

    set(transactions){
        localStorage.setItem("maratona", JSON.stringify(transactions))
    }
}

const transaction = {
   
    all: storage.get(),
    
    add(transactions){
        transaction.all.push(transactions);

        app.reload()
    },

    remove(index){
        transaction.all.splice(index,1);
        app.reload()
    },

    incomes(){//SOMAR AS ENTRADAS
        let income = 0;
        
        transaction.all.forEach(transactions =>{
             
            if(transactions.amount > 0){
                income += transactions.amount;
            }

        })
        
        return income;
    },

    expenses(){//SOMAR AS saida
        let expense = 0;
        
        transaction.all.forEach(function(transactions){
             
            if(transactions.amount < 0){
                expense += transactions.amount;
            }

        })
        
        return expense;
    },  

    total(){
        let total = 0
        
       total += transaction.incomes() + transaction.expenses()
        
        return total;
    },  
     
  
}

const DOM = { 
  
    transactionContener: document.querySelector("#table tbody"),
 
    addTransaction(transactions, index){
        
        const tr =document.createElement("tr")
        tr.innerHTML = DOM.innerHTMLtrasanction(transactions, index)
       
        DOM.transactionContener.appendChild(tr)
        
    },
  
    innerHTMLtrasanction(transactions, index){
        const Cssclass = transactions.amount >0 ?"income" :
        "expense"

        const amount = utils.formatCurrent(transactions.amount)
        
        const html =
        `        
            <td class="description">${transactions.description}</td>
            <td  class="${Cssclass}">${amount}</td>
            <td class="data">${transactions.data}</td>
            
            <td class="exit-description">
                <img onclick="transaction.remove(${index})" src="./assets/minus.svg" alt="Excluir">
            </td>    
        `
        return html
    },

    updataBanlance(){
        document
            .getElementById("incomeDisplay")
            .innerHTML = utils.formatCurrent(transaction.incomes())
        
        document
            .getElementById("expenseDisplay")
            .innerHTML =utils.formatCurrent( transaction.expenses())
        document
            .getElementById("totalDisplay")
            .innerHTML = utils.formatCurrent(transaction.total())
    },

    clearTransaction(){
        DOM.transactionContener.innerHTML = ""
    }
}

const utils ={

    formatAmount(value){
        value = Number(value) * 100
        // value = Number(value)/ 100
        // value = value.toLocaleString("pt-BR",{ 
        //     style:"currency",
        //     currency:"BRL"
        // })
    
       
        return value
        

    },

    formatDate(data){
        let dates = data.split("-")
       
       
        
    return `${dates[2]}/${dates[1]}/${dates[0]}`

       
    },

    formatCurrent(value){
        const signal = Number(value) < 0 ?"-" : ""
         
        value = String(value).replace(/\D/g, "")
        
        value = Number(value)/ 100

        value = value.toLocaleString("pt-BR",{ 
            style:"currency",
            currency:"BRL"
        })
        
        return signal + value
    }

}

const Form= {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    data: document.querySelector("input#data"),

    getValues(){
        return { 
            description: Form.description.value,
            amount: Form.amount.value,
            data: Form.data.value,
        }
    },

    validateFields(){
        const {description, amount, data}=Form.getValues()
       
        if(description.trim() ===""|| amount.trim() ==="" || data.trim() === ""){ 
            throw new Error("preencha todos os campos")
        }
    },

    formatValue(){
       
        let {description, amount, data} = Form
            .getValues()
        
        amount = utils.formatAmount(amount)

        data = utils.formatDate(data)
       
        return {
                description:description,
                amount: amount,
                data:data
                }
    },


    clearTransaction(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.data.value = ""
    },


    submit(event){
        event.preventDefault()//NAO ENVIA DADOS PARA URL
       
        try {
            Form.validateFields()
            // FORMATAR OS DADOS PARA SALVAR
            const transactions= Form.formatValue()
           
            // SALVAR
            transaction.add(transactions)
            // APAGAR OS DADOS DO Formularios
            Form.clearTransaction()
            // MODAL FECHE
            addToogle()
            // ATUALIZA A APLICAÇAO
            
        } catch (error) {
            alert(error.message)
        }
    }
}

const app = {

    init(){
  
        transaction.all.forEach(DOM.addTransaction)
      
        DOM.updataBanlance() 
        
        storage.set(transaction.all)
    },

    reload(){
        DOM.clearTransaction()

        app.init()
    }
}

app.init()

